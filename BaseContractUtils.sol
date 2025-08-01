// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title BaseContractUtils
 * @dev Comprehensive utility contract for Base blockchain development
 * @author ddtrvlr.base
 */
contract BaseContractUtils is Ownable, ReentrancyGuard {
    using Address for address;
    
    // Events
    event BasenameRegistered(address indexed user, string basename);
    event TransactionMonitored(address indexed from, address indexed to, uint256 value);
    event ContractDeployed(address indexed contractAddress, string name);
    
    // Structs
    struct DeploymentInfo {
        address contractAddress;
        string name;
        uint256 deployedAt;
        address deployer;
    }
    
    struct BasenameInfo {
        string basename;
        address owner;
        uint256 registeredAt;
        bool isActive;
    }
    
    // State variables
    mapping(address => BasenameInfo) public basenames;
    mapping(string => address) public basenameToAddress;
    DeploymentInfo[] public deployments;
    
    // Base network specific constants
    uint256 public constant BASE_CHAIN_ID = 8453;
    address public constant BASE_BRIDGE = 0x4200000000000000000000000000000000000010;
    
    constructor() {}
    
    /**
     * @dev Register a basename for an address
     * @param _basename The basename to register
     */
    function registerBasename(string memory _basename) external {
        require(bytes(_basename).length > 0, "Basename cannot be empty");
        require(basenameToAddress[_basename] == address(0), "Basename already taken");
        require(bytes(basenames[msg.sender].basename).length == 0, "Address already has basename");
        
        basenames[msg.sender] = BasenameInfo({
            basename: _basename,
            owner: msg.sender,
            registeredAt: block.timestamp,
            isActive: true
        });
        
        basenameToAddress[_basename] = msg.sender;
        
        emit BasenameRegistered(msg.sender, _basename);
    }
    
    /**
     * @dev Record a contract deployment
     * @param _contractAddress Address of the deployed contract
     * @param _name Name of the contract
     */
    function recordDeployment(address _contractAddress, string memory _name) external {
        require(_contractAddress.isContract(), "Address is not a contract");
        
        deployments.push(DeploymentInfo({
            contractAddress: _contractAddress,
            name: _name,
            deployedAt: block.timestamp,
            deployer: msg.sender
        }));
        
        emit ContractDeployed(_contractAddress, _name);
    }
    
    /**
     * @dev Monitor a transaction
     * @param _to Recipient address
     */
    function monitorTransaction(address _to) external payable {
        require(_to != address(0), "Invalid recipient");
        
        emit TransactionMonitored(msg.sender, _to, msg.value);
        
        if (msg.value > 0) {
            payable(_to).transfer(msg.value);
        }
    }
    
    /**
     * @dev Get basename info for an address
     * @param _address Address to query
     * @return BasenameInfo struct
     */
    function getBasenameInfo(address _address) external view returns (BasenameInfo memory) {
        return basenames[_address];
    }
    
    /**
     * @dev Get total number of deployments
     * @return Number of recorded deployments
     */
    function getDeploymentCount() external view returns (uint256) {
        return deployments.length;
    }
    
    /**
     * @dev Get deployment info by index
     * @param _index Index of deployment
     * @return DeploymentInfo struct
     */
    function getDeployment(uint256 _index) external view returns (DeploymentInfo memory) {
        require(_index < deployments.length, "Index out of bounds");
        return deployments[_index];
    }
    
    /**
     * @dev Check if running on Base network
     * @return True if on Base network
     */
    function isBaseNetwork() external view returns (bool) {
        return block.chainid == BASE_CHAIN_ID;
    }
    
    /**
     * @dev Emergency withdraw function (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}
