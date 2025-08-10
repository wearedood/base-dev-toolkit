# Contributing to Base Dev Toolkit

We welcome contributions to the Base Dev Toolkit! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Basic knowledge of Solidity and JavaScript

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/base-dev-toolkit.git
   cd base-dev-toolkit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run tests to ensure everything works**
   ```bash
   npm test
   ```

## 📝 Development Guidelines

### Code Style

- **Solidity**: Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- **JavaScript**: Use ESLint configuration provided in the project
- **Comments**: Write clear, concise comments for complex logic
- **Naming**: Use descriptive variable and function names

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(contracts): add new lending pool contract
fix(deploy): resolve gas estimation issues
docs(readme): update installation instructions
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test files
npm test test/contracts/
npm test test/integration/

# Run tests with coverage
npm run coverage
```

### Writing Tests

- Write tests for all new functionality
- Ensure test coverage remains above 90%
- Use descriptive test names
- Test both success and failure scenarios

### Test Structure

```javascript
describe('ContractName', () => {
  beforeEach(async () => {
    // Setup
  });

  describe('functionName', () => {
    it('should handle normal case', async () => {
      // Test implementation
    });

    it('should revert when invalid input', async () => {
      // Test error cases
    });
  });
});
```

## 🔧 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use a clear, descriptive title
   - Provide detailed description of changes
   - Link related issues
   - Add screenshots if applicable

### PR Requirements

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] No merge conflicts
- [ ] Reviewed by at least one maintainer

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Environment**: OS, Node.js version, npm/yarn version
- **Steps to reproduce**: Clear, numbered steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Error messages**: Full error output
- **Code samples**: Minimal reproduction case

### Feature Requests

For feature requests, please provide:

- **Problem description**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other approaches you've thought of
- **Use cases**: Real-world scenarios where this would be useful

## 📚 Documentation

### Writing Documentation

- Use clear, concise language
- Include code examples
- Add links to relevant resources
- Keep documentation up-to-date with code changes

### Documentation Types

- **API Documentation**: Function signatures and usage
- **Tutorials**: Step-by-step guides
- **Examples**: Real-world use cases
- **Architecture**: High-level system design

## 🏗️ Project Structure

```
base-dev-toolkit/
├── contracts/              # Smart contracts
│   ├── interfaces/         # Contract interfaces
│   ├── libraries/          # Reusable libraries
│   └── mocks/             # Test mocks
├── scripts/               # Deployment scripts
├── test/                  # Test files
├── docs/                  # Documentation
├── examples/              # Usage examples
└── utils/                 # Utility functions
```

## 🔒 Security

### Security Guidelines

- Never commit private keys or sensitive data
- Use environment variables for configuration
- Follow smart contract security best practices
- Report security vulnerabilities privately

### Security Review Process

1. All smart contract changes require security review
2. Use static analysis tools (Slither, MythX)
3. Consider formal verification for critical contracts
4. Conduct thorough testing including edge cases

## 🤝 Community

### Getting Help

- **Discord**: Join our [Discord server](https://discord.gg/base)
- **GitHub Discussions**: Use for questions and ideas
- **Issues**: For bug reports and feature requests

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read our [Code of Conduct](CODE_OF_CONDUCT.md).

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Base Dev Toolkit! 🙏**
