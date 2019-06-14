export enum status {
    Add = "Add",
    Deploying = "Deploying",
    Done = "Done",
    Error = "Error"
}

export interface IContract {
  address: string;
  location: string;
  date: string;
  ownerBet: number;
  totalBetAmount: number
}