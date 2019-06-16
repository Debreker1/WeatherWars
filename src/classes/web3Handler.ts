import Web3 from 'web3';
import Betlist from '../contracts/Betlist.json';
import WeatherBet from '../contracts/BettingContract.json';
import { differenceInSeconds, getUnixTime, format, fromUnixTime } from 'date-fns';
import { IContract } from '../model';

declare let window: any;

class web3Handler {
    private web3: Web3;
    private accounts: string[];

    constructor() {
        this.web3 = new Web3(window.ethereum);
        this.web3.eth.transactionConfirmationBlocks = 1;
        this.loadAccounts();
    }

    private async loadAccounts() {
        try {
            this.accounts = await this.web3.eth.getAccounts();
        } catch (error) {
            console.log(error);
        }
    };

    private async loadBetList(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const networkId: number = await this.web3.eth.net.getId();
                const deployedNetwork: any = Betlist.networks[networkId];
                const betList = await new this.web3!.eth.Contract(
                    Betlist.abi as any,
                    deployedNetwork && deployedNetwork.address,
                );
                resolve(betList);
            } catch (error) {
                reject(error);
            }
        });
    };

    public deployBet(betAmount: string, date: Date, degreesGuess: number, location: string, isPublic: boolean): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const betlistContract = await this.loadBetList();
                const amountOfSeconds = differenceInSeconds(date, new Date());
                const unixTimestamp = getUnixTime(date)
                const eth = this.web3.utils.toWei(betAmount, "ether");
                const betDeploy = await betlistContract.methods.createBet(
                    amountOfSeconds,
                    unixTimestamp,
                    degreesGuess,
                    location,
                    isPublic
                );
                const address: string = await betDeploy.call();
                await betDeploy.send({
                    from: this.accounts[0],
                    value: eth,
                    gas: 3000000
                });
                resolve(address);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

    private async getBetContract(address: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const weatherContract = await new this.web3!.eth.Contract(WeatherBet.abi as any, address);
                resolve(weatherContract);
            } catch (error) {
                reject(error);
            }
        });
    }

    public async getBetDetails(address: string): Promise<IContract> {
        return new Promise(async (resolve, reject) => {
            try {
                const weatherContract = await this.getBetContract(address);
                const betAmountRaw = await weatherContract.methods.betAmount().call();
                const betAmount: number = parseInt(this.web3.utils.fromWei(betAmountRaw.toString()));

                const playerAmountRaw = await weatherContract.methods.playerCount().call();
                const players: number = playerAmountRaw.toNumber();

                const ownerBetRaw = await weatherContract.methods.initialBet().call();
                const ownerBet = ownerBetRaw.toNumber();

                const location = await weatherContract.methods.location().call();

                const timestamRaw = await weatherContract.methods.timestamp().call();
                const date = format(fromUnixTime(timestamRaw.toNumber()), 'dd-MM-yyyy HH:mm');


                const totalBetAmount: number = (betAmount * players);
                const betDetails: IContract = { address, betAmount, players, ownerBet, totalBetAmount, location, date }
                resolve(betDetails);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

    public playerJoin(address: string, higher: boolean): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const weatherContract = await this.getBetContract(address);
                const betAmountRaw: string = await weatherContract.methods.betAmount().call();
                await weatherContract.methods.AddPlayer(higher).send({ from: this.accounts[0], value: betAmountRaw });
                resolve(true);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

    public getAllBets(): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const betList = await this.loadBetList();
                const addresses: string[] = await betList.methods.GetContracts().call();
                resolve(addresses);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default web3Handler;