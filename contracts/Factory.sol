pragma solidity ^0.5.0;
import "./oraclizeAPI_0.5.sol";
import "./BettingContract.sol";

contract Betlist
{
    address[] public bets;

    //Creates a new contract
    function createBet(uint startTime, uint timestamp, uint initial, string memory location) public payable
    {
        BettingContract newBet = new BettingContract(startTime, timestamp, initial, location, msg.value, msg.sender);
        address contractAddr = address(newBet);
        bets.push(contractAddr);
        address payable sendAddr = address(uint160(contractAddr));
        sendAddr.transfer(msg.value);
    }

    //Returns all the contract
    function GetContracts() public view returns (address[] memory)
    {
        return bets;
    }
}