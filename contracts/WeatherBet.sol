pragma solidity ^0.5.0;
import "./oraclizeAPI_0.5.sol";


contract WeatherBet is usingOraclize  {
  address public owner;
  uint public initialBet;
  address public player2;
  uint internal total;

  constructor(uint startSeconds) public payable {
    owner = msg.sender;
    initialBet = msg.value;
    total = msg.value;
  }

  function addPlayer2() public payable
  {
    if(msg.value != initialBet)
    {
      msg.sender.transfer(msg.value);
    }
    player2 = msg.sender;
    total += msg.value;
  }

  function getWeather()
  {
    
  }
}
