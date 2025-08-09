# Base Blockchain Deployment Guide

## 🚀 Complete Guide for Deploying Smart Contracts on Base

### Overview
This comprehensive guide covers everything you need to deploy smart contracts on Base blockchain, optimized for Builder Rewards and production use.

### Prerequisites
- Node.js v16+ installed
- MetaMask or compatible wallet
- Base Mainnet ETH for gas fees
- Hardhat development environment

### Quick Start

#### 1. Environment Setup
```bash
npm init -y
npm install --save-dev hardhat @openzeppelin/contracts
npx hardhat init
```

#### 2. Hardhat Configuration
Create `hardhat.config.js`:
```javascript
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');

module.exports = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    base: {
      url: 'https://mainnet.base.org',
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453
    },
    baseGoerli: {
      url: 'https://goerli.base.org',
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84531
    }
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY
    },
    customChains: [
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org'
        }
      }
    ]
  }
};
```

#### 3. Environment Variables
Create `.env` file:
```
PRIVATE_KEY=your_wallet_private_key
BASESCAN_API_KEY=your_basescan_api_key
```

### Deployment Scripts

#### Basic Deployment Script
Create `scripts/deploy.js`:
```javascript
const { ethers } = require('hardhat');

async function main() {
  console.log('Deploying to Base...');
  
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  
  const balance = await deployer.getBalance();
  console.log('Account balance:', ethers.formatEther(balance), 'ETH');
  
  // Deploy your contract
  const Contract = await ethers.getContractFactory('YourContract');
  const contract = await Contract.deploy();
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  
  console.log('Contract deployed to:', address);
  console.log('Transaction hash:', contract.deploymentTransaction().hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Gas Optimization Tips

1. **Use Solidity 0.8.19+** for latest optimizations
2. **Enable optimizer** in Hardhat config
3. **Pack structs** efficiently
4. **Use `immutable` and `constant`** keywords
5. **Batch operations** when possible

### Base-Specific Features

#### Coinbase Smart Wallet Integration
```solidity
// Check if caller is Coinbase Smart Wallet
function isCoinbaseWallet(address account) public view returns (bool) {
    // Implementation for Coinbase wallet detection
    return account.code.length > 0;
}
```

#### Base Name Service (BNS) Integration
```solidity
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";

contract BaseNameIntegration {
    ENS public immutable ens;
    
    constructor(address _ens) {
        ens = ENS(_ens);
    }
    
    function resolveBaseName(string memory name) public view returns (address) {
        bytes32 node = keccak256(abi.encodePacked(name));
        return ens.resolver(node);
    }
}
```

### Deployment Commands

```bash
# Compile contracts
npx hardhat compile

# Deploy to Base Mainnet
npx hardhat run scripts/deploy.js --network base

# Verify on BaseScan
npx hardhat verify --network base CONTRACT_ADDRESS "Constructor Arg 1" "Constructor Arg 2"

# Check deployment
npx hardhat run scripts/verify-deployment.js --network base
```

### Builder Rewards Optimization

#### Best Practices for Maximum Points
1. **Deploy production-ready contracts** with proper testing
2. **Verify contracts** on BaseScan immediately
3. **Add comprehensive documentation**
4. **Use Base-specific features** (Coinbase Wallet, BNS)
5. **Regular commits** and updates
6. **Share progress** on social media with #BuildOnBase

#### Contract Categories That Score Well
- DeFi protocols (DEX, lending, yield farming)
- NFT marketplaces and collections
- Gaming and social applications
- Infrastructure and developer tools
- Cross-chain bridges and protocols

### Troubleshooting

#### Common Issues
1. **Gas estimation failed**: Increase gas limit or check contract logic
2. **Nonce too low**: Reset MetaMask account or wait for pending transactions
3. **Insufficient funds**: Ensure enough ETH for gas fees
4. **Contract verification failed**: Check constructor arguments and compiler version

#### Base Network Information
- **Chain ID**: 8453 (Mainnet), 84531 (Testnet)
- **RPC URL**: https://mainnet.base.org
- **Block Explorer**: https://basescan.org
- **Bridge**: https://bridge.base.org

### Advanced Features

#### Multi-Signature Deployment
```bash
# Deploy with multiple signers
npx hardhat run scripts/deploy-multisig.js --network base
```

#### Upgradeable Contracts
```solidity
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract UpgradeableContract is Initializable, OwnableUpgradeable {
    function initialize() public initializer {
        __Ownable_init();
    }
}
```

### Resources

- [Base Documentation](https://docs.base.org)
- [Base Builder Rewards](https://base.org/builder-rewards)
- [BaseScan Explorer](https://basescan.org)
- [Base Bridge](https://bridge.base.org)
- [Hardhat Documentation](https://hardhat.org/docs)

### Support

For issues or questions:
- Base Discord: [discord.gg/base](https://discord.gg/base)
- GitHub Issues: Create an issue in this repository
- Base Forum: [forum.base.org](https://forum.base.org)

---

**Happy Building on Base! 🔵**

*This guide is part of the Base Developer Toolkit - helping developers maximize their Builder Rewards and create amazing applications on Base blockchain.*
