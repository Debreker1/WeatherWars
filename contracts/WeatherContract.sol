pragma solidity ^0.5.0;
import "./oraclizeAPI_0.5.sol";

//WeatherContract.deployed().then(function(instance) {return instance.update()})

contract WeatherContract is usingOraclize{
uint public temperature;

event NewOraclizeQuery(string description);
event NewTemperature(string temperature);

    constructor() public
    {
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        // update();
    }

    function __callback(bytes32 _myid, string memory _result) public
    {
        if(msg.sender != oraclize_cbAddress()) revert();
            emit NewTemperature(_result);
            temperature = parseInt(_result);
    }

    function update() public payable
    {
        emit NewOraclizeQuery("Query was sent waiting for response....");
        oraclize_query("WolframAlpha", "Temperature in Rotterdam");
    }
}