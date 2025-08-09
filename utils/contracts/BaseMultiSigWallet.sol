// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BaseMultiSigWallet
 * @dev Advanced Multi-Signature Wallet optimized for Base blockchain
 */
contract BaseMultiSigWallet is ReentrancyGuard {
    
    event Deposit(address indexed sender, uint256 amount);
    event SubmitTransaction(uint256 indexed txIndex, address indexed to, uint256 value);
    event ConfirmTransaction(address indexed owner, uint256 indexed txIndex);
    event ExecuteTransaction(uint256 indexed txIndex);
    
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public numConfirmationsRequired;
    
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 numConfirmations;
        mapping(address => bool) isConfirmed;
    }
    
    Transaction[] public transactions;
    
    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }
    
    modifier txExists(uint256 _txIndex) {
        require(_txIndex < transactions.length, "Transaction does not exist");
        _;
    }
    
    modifier notExecuted(uint256 _txIndex) {
        require(!transactions[_txIndex].executed, "Already executed");
        _;
    }
    
    constructor(address[] memory _owners, uint256 _numConfirmationsRequired) {
        require(_owners.length > 0, "Owners required");
        require(_numConfirmationsRequired > 0 && _numConfirmationsRequired <= _owners.length, "Invalid confirmations");
        
        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner not unique");
            
            isOwner[owner] = true;
            owners.push(owner);
        }
        
        numConfirmationsRequired = _numConfirmationsRequired;
    }
    
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
    
    function submitTransaction(address _to, uint256 _value, bytes memory _data) public onlyOwner {
        uint256 txIndex = transactions.length;
        
        transactions.push();
        Transaction storage transaction = transactions[txIndex];
        transaction.to = _to;
        transaction.value = _value;
        transaction.data = _data;
        transaction.executed = false;
        transaction.numConfirmations = 0;
        
        emit SubmitTransaction(txIndex, _to, _value);
    }
    
    function confirmTransaction(uint256 _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];
        require(!transaction.isConfirmed[msg.sender], "Already confirmed");
        
        transaction.isConfirmed[msg.sender] = true;
        transaction.numConfirmations += 1;
        
        emit ConfirmTransaction(msg.sender, _txIndex);
    }
    
    function executeTransaction(uint256 _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) nonReentrant {
        Transaction storage transaction = transactions[_txIndex];
        require(transaction.numConfirmations >= numConfirmationsRequired, "Not enough confirmations");
        
        transaction.executed = true;
        
        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "Transaction failed");
        
        emit ExecuteTransaction(_txIndex);
    }
    
    function getOwners() public view returns (address[] memory) {
        return owners;
    }
    
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }
    
    function getTransaction(uint256 _txIndex) public view returns (address to, uint256 value, bytes memory data, bool executed, uint256 numConfirmations) {
        Transaction storage transaction = transactions[_txIndex];
        return (transaction.to, transaction.value, transaction.data, transaction.executed, transaction.numConfirmations);
    }
}
