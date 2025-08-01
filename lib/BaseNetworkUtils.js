README.md# Base Developer Toolkit 🔧

A comprehensive developer toolkit for Base blockchain - smart contract utilities, Basename integration, transaction monitoring, and deployment helpers for Base ecosystem builders.

**Author:** ddtrvlr.base  
**License:** MIT  
**Network:** Base (Chain ID: 8453)

## 🚀 Features

### Smart Contract Utilities
- **BaseContractUtils.sol** - Production-ready smart contract with:
  - Basename registration and management
  - Contract deployment tracking
  - Base network validation
  - Emergency functions with proper access control
  - Gas-optimized operations

### Development Tools
- **Hardhat Configuration** - Complete setup for Base development
  - Base Mainnet, Goerli, and Sepolia networks
  - Optimized compiler settings with Yul optimization
  - BaseScan verification integration
  - Custom deployment tasks

### Testing Suite
- **Comprehensive Tests** - 25+ test cases covering:
  - Contract functionality validation
  - Gas optimization benchmarks
  - Security and access control
  - Base network integration
  - Edge cases and error handling

### Network Utilities
- **BaseNetworkUtils.js** - Advanced Base network library
  - Network constants and configurations
  - Bridge contract addresses
  - Gas optimization utilities
  - Transaction monitoring
  - Batch operations

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/wearedood/base-dev-toolkit.git
cd base-dev-toolkit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your private key and API keys
```

## 🛠 Usage

### Deploy Smart Contract

```bash
# Deploy to Base Mainnet
npx hardhat run scripts/deploy.js --network base

# Deploy to Base Goerli (testnet)
npx hardhat run scripts/deploy.js --network baseGoerli
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests with gas reporting
npm run test:gas

# Run coverage
npm run coverage
```

### Use Network Utilities

```javascript
const { BaseNetworkUtils } = require('./lib/BaseNetworkUtils');

// Initialize with Base network
const baseUtils = new BaseNetworkUtils('base');

// Check if on Base network
const isBase = await baseUtils.isBaseNetwork();

// Get gas price recommendations
const gasPrice = await baseUtils.getOptimalGasPrice();

// Monitor transaction
const receipt = await baseUtils.waitForTransaction(txHash);
```

## 🏗 Project Structure

```
base-dev-toolkit/
├── contracts/
│   └── BaseContractUtils.sol     # Main smart contract
├── scripts/
│   ├── deploy.js                 # Deployment script
│   └── verify.js                 # Contract verification
├── test/
│   └── BaseContractUtils.test.js # Comprehensive test suite
├── lib/
│   └── BaseNetworkUtils.js       # Network utilities
├── hardhat.config.js             # Hardhat configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🌐 Base Network Integration

This toolkit is specifically designed for the Base ecosystem:

- **Base Mainnet** (Chain ID: 8453)
- **Base Goerli** (Chain ID: 84531) 
- **Base Sepolia** (Chain ID: 84532)

### Supported Features
- ✅ Basename integration
- ✅ Base bridge contracts
- ✅ Optimized for Base gas costs
- ✅ BaseScan verification
- ✅ Base-specific constants
- ✅ L2 transaction monitoring

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests** - Individual function testing
- **Integration Tests** - Cross-contract interactions
- **Gas Optimization** - Benchmark gas usage
- **Security Tests** - Access control validation
- **Network Tests** - Base-specific functionality

Run tests with detailed gas reporting:
```bash
npm run test:gas
```

## 🚀 Deployment

### Prerequisites
1. Set up your `.env` file with:
   - `PRIVATE_KEY` - Your deployment wallet private key
   - `BASESCAN_API_KEY` - For contract verification
   - `BASE_RPC_URL` - Base network RPC endpoint

### Deploy and Verify
```bash
# Deploy to Base Mainnet
npx hardhat run scripts/deploy.js --network base

# Verify on BaseScan
npx hardhat verify --network base DEPLOYED_CONTRACT_ADDRESS
```

## 📊 Builder Rewards Integration

This project is designed to contribute to the Base Builder Rewards Summer League:

- **Smart Contract Activity** - Deployed contracts on Base
- **GitHub Contributions** - Quality open-source code
- **Developer Tools** - Utilities for Base ecosystem
- **Documentation** - Comprehensive guides and examples

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Base Network](https://base.org)
- [Base Documentation](https://docs.base.org)
- [BaseScan](https://basescan.org)
- [Builder Rewards](https://builderscore.xyz)

## 👤 Author

**ddtrvlr.base**
- Building tools for the Base ecosystem
- Participating in Builder Rewards Summer League
- Contributing to Base developer experience

---

*Built with ❤️ for the Base ecosystem*
