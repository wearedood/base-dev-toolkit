// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BaseStakingPool {
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public rewards;
    uint256 public totalStaked;
    uint256 public rewardRate = 100;
    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    
    function stake() external payable {
        require(msg.value > 0, "Must stake positive amount");
        stakes[msg.sender] += msg.value;
        totalStaked += msg.value;
        emit Staked(msg.sender, msg.value);
    }
    
    function withdraw(uint256 amount) external {
        require(stakes[msg.sender] >= amount, "Insufficient stake");
        stakes[msg.sender] -= amount;
        totalStaked -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }
}
