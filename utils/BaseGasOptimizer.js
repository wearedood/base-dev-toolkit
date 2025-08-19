/**
 * BaseGasOptimizer - Advanced gas optimization utilities for Base blockchain
 * Helps developers minimize transaction costs and improve efficiency
 * @author Base Dev Toolkit Contributors
 * @version 1.0.0
 */

const { ethers } = require('ethers');

class BaseGasOptimizer {
  constructor(provider, options = {}) {
    this.provider = provider;
    this.options = {
      maxGasPrice: options.maxGasPrice || ethers.utils.parseUnits('20', 'gwei'),
      gasBuffer: options.gasBuffer || 1.1, // 10% buffer
      batchSize: options.batchSize || 10,
      ...options
    };
    this.gasHistory = [];
  }

  /**
   * Estimates optimal gas price based on network conditions
   * @returns {Promise<BigNumber>} Optimal gas price
   */
  async getOptimalGasPrice() {
    try {
      const gasPrice = await this.provider.getGasPrice();
      const networkCongestion = await this.getNetworkCongestion();
      
      // Adjust gas price based on network congestion
      let adjustedGasPrice = gasPrice;
      if (networkCongestion > 0.8) {
        adjustedGasPrice = gasPrice.mul(120).div(100); // +20% for high congestion
      } else if (networkCongestion < 0.3) {
        adjustedGasPrice = gasPrice.mul(90).div(100); // -10% for low congestion
      }
      
      // Cap at maximum gas price
      return adjustedGasPrice.gt(this.options.maxGasPrice) 
        ? this.options.maxGasPrice 
        : adjustedGasPrice;
    } catch (error) {
      console.error('Error getting optimal gas price:', error);
      return this.provider.getGasPrice();
    }
  }

  /**
   * Estimates gas limit with buffer for transaction
   * @param {Object} transaction - Transaction object
   * @returns {Promise<BigNumber>} Estimated gas limit
   */
  async estimateGasWithBuffer(transaction) {
    try {
      const gasEstimate = await this.provider.estimateGas(transaction);
      const bufferedGas = gasEstimate.mul(Math.floor(this.options.gasBuffer * 100)).div(100);
      
      this.gasHistory.push({
        timestamp: Date.now(),
        estimated: gasEstimate.toString(),
        buffered: bufferedGas.toString()
      });
      
      return bufferedGas;
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  }

  /**
   * Batches multiple transactions for gas efficiency
   * @param {Array} transactions - Array of transaction objects
   * @returns {Promise<Array>} Batched transaction results
   */
  async batchTransactions(transactions) {
    const batches = [];
    for (let i = 0; i < transactions.length; i += this.options.batchSize) {
      batches.push(transactions.slice(i, i + this.options.batchSize));
    }
    
    const results = [];
    for (const batch of batches) {
      const batchPromises = batch.map(async (tx) => {
        const gasPrice = await this.getOptimalGasPrice();
        const gasLimit = await this.estimateGasWithBuffer(tx);
        
        return {
          ...tx,
          gasPrice,
          gasLimit
        };
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }

  /**
   * Calculates network congestion level
   * @returns {Promise<number>} Congestion level (0-1)
   */
  async getNetworkCongestion() {
    try {
      const latestBlock = await this.provider.getBlock('latest');
      const gasUsedRatio = latestBlock.gasUsed.div(latestBlock.gasLimit);
      return parseFloat(gasUsedRatio.toString());
    } catch (error) {
      console.error('Error calculating network congestion:', error);
      return 0.5; // Default to medium congestion
    }
  }

  /**
   * Optimizes contract call parameters
   * @param {Object} contractCall - Contract call parameters
   * @returns {Promise<Object>} Optimized parameters
   */
  async optimizeContractCall(contractCall) {
    const gasPrice = await this.getOptimalGasPrice();
    const gasLimit = await this.estimateGasWithBuffer(contractCall);
    
    return {
      ...contractCall,
      gasPrice,
      gasLimit,
      type: 2, // EIP-1559 transaction type
      maxFeePerGas: gasPrice,
      maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei')
    };
  }

  /**
   * Gets gas usage statistics
   * @returns {Object} Gas usage statistics
   */
  getGasStats() {
    if (this.gasHistory.length === 0) {
      return { message: 'No gas history available' };
    }
    
    const recent = this.gasHistory.slice(-10);
    const avgEstimated = recent.reduce((sum, entry) => 
      sum + parseInt(entry.estimated), 0) / recent.length;
    const avgBuffered = recent.reduce((sum, entry) => 
      sum + parseInt(entry.buffered), 0) / recent.length;
    
    return {
      totalTransactions: this.gasHistory.length,
      recentAvgEstimated: Math.floor(avgEstimated),
      recentAvgBuffered: Math.floor(avgBuffered),
      bufferEfficiency: ((avgBuffered - avgEstimated) / avgEstimated * 100).toFixed(2) + '%'
    };
  }

  /**
   * Clears gas history
   */
  clearHistory() {
    this.gasHistory = [];
  }
}

// Utility functions
const GasUtils = {
  /**
   * Converts gas price from gwei to wei
   * @param {string|number} gwei - Gas price in gwei
   * @returns {BigNumber} Gas price in wei
   */
  gweiToWei: (gwei) => ethers.utils.parseUnits(gwei.toString(), 'gwei'),
  
  /**
   * Converts gas price from wei to gwei
   * @param {BigNumber} wei - Gas price in wei
   * @returns {string} Gas price in gwei
   */
  weiToGwei: (wei) => ethers.utils.formatUnits(wei, 'gwei'),
  
  /**
   * Calculates transaction cost
   * @param {BigNumber} gasUsed - Gas used
   * @param {BigNumber} gasPrice - Gas price
   * @returns {BigNumber} Transaction cost in wei
   */
  calculateTxCost: (gasUsed, gasPrice) => gasUsed.mul(gasPrice),
  
  /**
   * Formats gas amount for display
   * @param {BigNumber} gas - Gas amount
   * @returns {string} Formatted gas amount
   */
  formatGas: (gas) => gas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
};

module.exports = {
  BaseGasOptimizer,
  GasUtils
};
