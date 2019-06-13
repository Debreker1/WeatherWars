pragma solidity ^0.5.0;
import "./BettingContract.sol";

contract Betlist
{
    address[] public bets;

    //Creates a new contract
    function createBet(uint startTime, uint timestamp, uint initial, string memory location) public payable
    {
        BettingContract newBet = (new BettingContract).value(msg.value)(startTime, timestamp, initial, location, msg.value, msg.sender);
        address contractAddr = address(newBet);
        bets.push(contractAddr);
    }

    //Returns all the contract
    function GetContracts() public view returns (address[] memory)
    {
        return bets;
    }
}