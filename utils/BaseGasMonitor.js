// Base Gas Monitor Utility
// Advanced gas fee monitoring and optimization for Base blockchain

const { ethers } = require('ethers');
const axios = require('axios');

class BaseGasMonitor {
  constructor(rpcUrl = 'https://mainnet.base.org') {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.gasHistory = [];
    this.alertThresholds = {
      low: 0.001, // ETH
      medium: 0.005,
      high: 0.01
    };
  }

  async getCurrentGasPrice() {
    try {
      const gasPrice = await this.provider.getGasPrice();
      const gasPriceGwei = ethers.formatUnits(gasPrice, 'gwei');
      
      return {
        wei: gasPrice.toString(),
        gwei: gasPriceGwei,
        eth: ethers.formatEther(gasPrice)
      };
    } catch (error) {
      console.error('Error fetching gas price:', error);
      throw error;
    }
  }

  async estimateTransactionCost(to, data = '0x', value = '0') {
    try {
      const gasEstimate = await this.provider.estimateGas({
        to,
        data,
        value: ethers.parseEther(value)
      });
      
      const gasPrice = await this.provider.getGasPrice();
      const totalCost = gasEstimate * gasPrice;
      
      return {
        gasLimit: gasEstimate.toString(),
        gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
        totalCostWei: totalCost.toString(),
        totalCostEth: ethers.formatEther(totalCost),
        estimatedUSD: await this.convertToUSD(ethers.formatEther(totalCost))
      };
    } catch (error) {
      console.error('Error estimating transaction cost:', error);
      throw error;
    }
  }

  async convertToUSD(ethAmount) {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const ethPrice = response.data.ethereum.usd;
      return (parseFloat(ethAmount) * ethPrice).toFixed(2);
    } catch (error) {
      console.warn('Could not fetch ETH price:', error.message);
      return 'N/A';
    }
  }

  async monitorGasPrices(intervalMs = 30000) {
    console.log('Starting Base gas price monitoring...');
    
    const monitor = async () => {
      try {
        const gasData = await this.getCurrentGasPrice();
        const timestamp = new Date().toISOString();
        
        this.gasHistory.push({
          ...gasData,
          timestamp
        });
        
        // Keep only last 100 entries
        if (this.gasHistory.length > 100) {
          this.gasHistory.shift();
        }
        
        console.log(`[${timestamp}] Gas Price: ${gasData.gwei} Gwei (${gasData.eth} ETH)`);
        
        // Check for alerts
        this.checkGasAlerts(parseFloat(gasData.eth));
        
      } catch (error) {
        console.error('Monitoring error:', error);
      }
    };
    
    // Initial check
    await monitor();
    
    // Set up interval
    return setInterval(monitor, intervalMs);
  }

  checkGasAlerts(gasPriceEth) {
    if (gasPriceEth <= this.alertThresholds.low) {
      console.log('🟢 LOW GAS ALERT: Optimal time for transactions!');
    } else if (gasPriceEth >= this.alertThresholds.high) {
      console.log('🔴 HIGH GAS ALERT: Consider waiting for lower fees');
    } else if (gasPriceEth >= this.alertThresholds.medium) {
      console.log('🟡 MEDIUM GAS ALERT: Moderate fees detected');
    }
  }

  getGasHistory() {
    return this.gasHistory;
  }

  getAverageGasPrice(hours = 1) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentData = this.gasHistory.filter(entry => 
      new Date(entry.timestamp) > cutoff
    );
    
    if (recentData.length === 0) return null;
    
    const average = recentData.reduce((sum, entry) => 
      sum + parseFloat(entry.gwei), 0
    ) / recentData.length;
    
    return {
      averageGwei: average.toFixed(4),
      sampleSize: recentData.length,
      timeRange: `${hours}h`
    };
  }

  async optimizeGasPrice(priority = 'standard') {
    const current = await this.getCurrentGasPrice();
    const currentGwei = parseFloat(current.gwei);
    
    const multipliers = {
      slow: 0.9,
      standard: 1.0,
      fast: 1.1,
      instant: 1.25
    };
    
    const optimizedGwei = currentGwei * multipliers[priority];
    
    return {
      priority,
      recommendedGwei: optimizedGwei.toFixed(4),
      recommendedWei: ethers.parseUnits(optimizedGwei.toFixed(4), 'gwei').toString()
    };
  }
}

module.exports = BaseGasMonitor;

// Example usage:
// const monitor = new BaseGasMonitor();
// monitor.monitorGasPrices(60000); // Check every minute
// const cost = await monitor.estimateTransactionCost('0x...', '0x', '0.1');
