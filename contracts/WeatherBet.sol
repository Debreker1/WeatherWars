pragma solidity ^0.5.0;
import "./oraclizeAPI_0.5.sol";


contract WeatherBet is usingOraclize  {
  address public owner;
  uint public initialBet;
  address public player2;
  uint internal total;
  uint public temperature;
  event NewOraclizeQuery(string description);
  event NewTemperature(string temperature);

  constructor(uint startTime) public payable {
    owner = msg.sender;
    initialBet = msg.value;
    total = msg.value;
    OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
    getWeather(startTime);
  }

  function addPlayer2() public payable {
    if(msg.value != initialBet) {
      msg.sender.transfer(msg.value);
    }
    player2 = msg.sender;
    total += msg.value;
  }

  function getWeather(uint startTime) public payable {
    emit NewOraclizeQuery("Query was sent waiting for response....");
    oraclize_query(startTime, "WolframAlpha", "Temperature in Rotterdam");
  }

  function __callback(bytes32 _myid, string memory _result) public {
    if(msg.sender != oraclize_cbAddress()) revert();
    emit NewTemperature(_result);
    temperature = parseInt(_result);
  }
}
