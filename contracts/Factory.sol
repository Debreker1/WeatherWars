pragma solidity ^0.5.0;
import "./oraclizeAPI_0.5.sol";

//Factory contract 1
//Contracts get associated with owner address & owners can only have 1 contract
/*
contract Betlist
{
    mapping(address => address) bets;

    function createBet(uint startTime, uint initial, string memory location) public payable
    {
        BettingContract newBet = new BettingContract(startTime, initial, location, msg.value, msg.sender);
        address newBetAddr = address(newBet);
        bets[msg.sender] = newBetAddr;
        address payable sendAddr = address(uint160(newBetAddr));
        sendAddr.transfer(msg.value);
    }

    function GetContract() public view returns (mapping(address => address) storage)
    {
        return bets;
    }

    function GetOwnContract() public view returns (address)
    {
        return bets[msg.sender];
    }
}
*/
//Factory contract 2
//Simpel factory contract
contract Betlist
{
    address[] public bets;

    //Creates a new contract
    function createBet(uint startTime, uint initial, string memory location) public payable
    {
        BettingContract newBet = new BettingContract(startTime, initial, location, msg.value, msg.sender);
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

//Contract for bets
contract BettingContract is usingOraclize
{
    address payable owner;
    uint playerCount = 0;
    uint betAmount;
    uint initialBet;

    uint public temperature;
    event NewOraclizeQuery(string description);
    event NewTemperature(string temperature);

    struct Player {
        address payable addr; //The address of their account
        bool higher; //Whether their guess was higher than the owner's guess. True = higher, False = lower.
    }

    Player[] players;
    Player[] winners;

    //When called for, Oraclize needs to be called and the Total needs to be updated.
    constructor(uint startTime, uint initial, string memory location, uint betAmount_, address owner_) public payable
    {
        owner = address(uint160(owner_));
        betAmount = betAmount_;
        initialBet = initial;

        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        getWeather(startTime, location);
    }

    //Function when a new player is added
    function AddPlayer(bool guessedHigher) public payable
    {
        //If the player doesn't have enough ETH
        if (msg.value != betAmount){
            msg.sender.transfer(msg.value);
        }
        else{
            //Since the owner is also counted, this playerCount starts at 1!
            playerCount = playerCount + 1;

            //Add player to a struct, and add it to the array.
            Player memory player;
            player.addr = msg.sender;
            player.higher = guessedHigher;
            players.push(player);

            //Update the Total for each player added.
            updateTotalReceived(msg.value);
        }
    }

    //Updates the total amount
    function updateTotalReceived(uint amount) internal {
        betAmount += amount;
    }

    //Function that contains the actions of Oraclize.
    function getWeather(uint _time, string memory searchstring) public
    {
        emit NewOraclizeQuery("Query was sent waiting for response....");
        oraclize_query(_time, "WolframAlpha",  searchstring);
    }

    //This function will do everything needed to give the winnings to the winner of the bet.
    function _callback(string memory _result) public
    {
        //if(msg.sender != oraclize_cbAddress()) revert();
        emit NewTemperature(_result);
        temperature = parseInt(_result);

        //Winner gets chosen
        if (initialBet == temperature){
            //The owner wins
            owner.transfer(address(this).balance);
        }
        else{
            //Team higher wins
            if (initialBet > temperature) {
                for (uint i = 0; i < players.length; i++) {
                    if (players[i].higher == true){
                        winners.push(players[i]);
                    }
                }
            }
            //Team Lower wins
            else{
                for (uint i = 0; i < players.length; i++) {
                    if (players[i].higher == false){
                        winners.push(players[i]);
                    }
                }
            }
            //Winners recieve their ETH
            for (uint i = 0; i < winners.length; i++){
                winners[i].addr.transfer(betAmount / winners.length);
            }
        }
    }
}
