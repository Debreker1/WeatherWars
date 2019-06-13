pragma solidity ^0.5.0;
import "./oraclizeAPI_0.5.sol";

contract BettingContract is usingOraclize
{

    address payable owner;
    int public playerCount = 1;
    uint public betAmount;
    uint public initialBet; //Temperature set by the owner
    string public location;
    uint public temperature;
    uint public timestamp;
    event NewOraclizeQuery(string description);
    event NewTemperature(string temperature);

    struct Player {
        address payable addr; //The address of their account
        bool higher; //Whether their guess was higher than the owner's guess. True = higher, False = lower.
    }

    Player[] players;
    Player[] winners;

    //When called for, Oraclize needs to be called and the Total needs to be updated.
    constructor(uint startTime, uint timestamp_, uint initial, string memory location_, uint betAmount_, address owner_) public payable
    {
        owner = address(uint160(owner_));
        betAmount = betAmount_;
        initialBet = initial;
        location = location_;
        timestamp = timestamp_;
        
        emit NewOraclizeQuery("Query was sent waiting for response....");
        oraclize_query(startTime, "WolframAlpha", location);
    }

    function AddPlayer(bool guessedHigher) public payable
    {
        if (msg.value != betAmount){
            revert("Amount sent not the same as the required bet amount");
        }
        else{
            //Since the owner is also counted, this playerCount starts at 1!
            playerCount = playerCount + 1;

            //Add player to a struct, and add it to the array.
            Player memory player;
            player.addr = msg.sender;
            player.higher = guessedHigher;
            players.push(player);
        }
    }


    //This function will do everything needed to give the winnings to the winner of the bet.
    function _callback(string memory _result) public
    {
        //if(msg.sender != oraclize_cbAddress()) revert();
        emit NewTemperature(_result);
        temperature = parseInt(_result);

        if (initialBet == temperature){
            //Send everything in the contract back to the owner, since he won!
            owner.transfer(address(this).balance);
        }
        else{
            if (initialBet > temperature) {
                //Team higher wins
                for (uint i = 0; i < players.length; i++) {
                    if (players[i].higher == true){
                        winners.push(players[i]);
                    }
                }
            }
            else{
                //Team lower wins
                for (uint i = 0; i < players.length; i++) {
                    if (players[i].higher == false){
                        winners.push(players[i]);
                    }
                }
            }

            for (uint i = 0; i < winners.length; i++){
                winners[i].addr.transfer(address(this).balance / winners.length);
            }
        }
    }
}