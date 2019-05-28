pragma solidity ^0.5.0;
import "./oraclizeAPI_0.5.sol";
import "./Strings.sol";

contract BettingContract is usingOraclize
{
    using Strings for string;

    address owner;
    uint playerCount = 0;
    uint betAmount;
    int initialBet;

    uint public temperature;
    event NewOraclizeQuery(string description);
    event NewTemperature(string temperature);

    struct Player {
        address addr; //The address of their account
        bool higher; //Whether their guess was higher than the owner's guess. True = higher, False = lower.
    }

    Player[] players;

    //When called for, Oraclize needs to be called and the Total needs to be updated.
    constructor(uint startTime, int initial) public payable
    {
        owner = msg.sender;
        betAmount = msg.value;
        initialBet = initial;

        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        getWeather(startTime);

    }

    function AddPlayer(bool guessedHigher) public payable
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
            player.higher = guessedHigher; //TODO! Add all Trues to a separate array, and all False to a separate array.
            players.push(player);

            //Update the Total for each player added.
            updateTotalReceived();
        }
    }


    //Function that contains the actions of Oraclize.
    function getWeather(uint _time) public
    {
        emit NewOraclizeQuery("Query was sent waiting for response....");
        oraclize_query(_time, "WolframAlpha",  "Temperature in Rotterdam");
    }


    //This function will do everything needed to give the winnings to the winner of the bet.
    function _callback(string memory _result) public
    {
        //totalReceived should get sent to the winner(s).
        //Thus, the winner(s) need(s) to be chosen.

        //This results in a loop if the owner did not win.

        if(msg.sender != oraclize_cbAddress()) revert();
        emit NewTemperature(_result);
        temperature = parseInt(_result);

        if (initialBet == temperature){
            //Send everything in the contract back to the owner, since he won!
            msg.owner.transfer(this.balance); //TODO! Wss niet correct
        }
        else{
            //
            /*If initialBet > temperature
                for each player in higher {
                    msg.sender.transfer(this.balance / higher.Length)
                }
            else
                {
                for each player in lower {
                msg.sender.transfer(this.balance / higher.Length)
                }
            }


            */
        }
    }
}
