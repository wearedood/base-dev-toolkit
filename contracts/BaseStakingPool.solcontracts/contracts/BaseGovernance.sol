// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BaseGovernance {
    mapping(uint256 => uint256) public votesFor;
    mapping(uint256 => uint256) public votesAgainst;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    
    uint256 public proposalCount;
    
    event VoteCast(uint256 proposalId, address voter, bool support);
    
    function vote(uint256 proposalId, bool support) external {
        require(!hasVoted[msg.sender][proposalId], "Already voted");
        hasVoted[msg.sender][proposalId] = true;
        
        if (support) {
            votesFor[proposalId]++;
        } else {
            votesAgainst[proposalId]++;
        }
        
        emit VoteCast(proposalId, msg.sender, support);
    }
    
    function createProposal() external {
        proposalCount++;
    }
}
