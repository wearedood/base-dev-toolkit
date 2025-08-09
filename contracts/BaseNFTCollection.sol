// Base NFT Contract
pragma solidity ^0.8.19;

contract BaseNFT {
    string public name = "Base NFT Collection";
    uint256 public totalSupply = 0;
    
    function mint() public {
        totalSupply++;
    }
}
