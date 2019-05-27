pragma solidity ^0.5.0;
import "./oraclizeAPI_0.5.sol";
import "./Strings.sol";

contract BettingContract is usingOraclize
{
    using Strings for string;

    address owner;
    uint totalReceived;
    uint playerCount = 0;
    uint betAmount;

    event NewOraclizeQuery(string description);
    event NewTemperature(string temperature);

    struct Player {
        address addr; //The address of their account
        string guess; //What they've made as prediction
        //Currently guess is a string, but it might need to get translated to an integer so it can accomodate the proper operators.
    }

    Player[] players;

    //When called for, Oraclize needs to be called and the Total needs to be updated.
    constructor(uint startTime, string memory place, string memory startGuess) public payable
    {
        owner = msg.sender;
        betAmount = msg.value;
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        AddPlayer(startGuess);
        getWeather(startTime, place);

    }

    function AddPlayer(string memory guess) public payable
    {
        if (msg.value != betAmount){
            msg.sender.transfer(msg.value);
        }
        else{

            //Since the owner is also counted, this playerCount starts at 1!
            playerCount = playerCount + 1;

            //Add player to a struct, and add it to the array.
            Player memory player;
            player.addr = msg.sender;
            player.guess = guess;
            players.push(player);

            //Update the Total for each player added.
            updateTotalReceived();
        }
    }

    //The Total needs to be counted, so that it can be sent (in total) to the winner(s)
    function updateTotalReceived() internal
    {
        totalReceived += msg.value;
    }


    //Function that contains the actions of Oraclize.
    function getWeather(uint _time, string memory _location) public
    {
        emit NewOraclizeQuery("Query was sent waiting for response....");
        oraclize_query(_time, "WolframAlpha",  "Temperature in Rotterdam");
    }


    //This function will do everything needed to give the winnings to the winner of the bet.
    function Ending(/* temperature and winner(?) */) public
    {
        //totalReceived should get sent to the winner.
        //Thus, the winner needs to be chosen.
        //I have yet to decide/figure out what the correct place for the code to calculate the winner is.

    }
}
