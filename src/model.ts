export interface IContract {
    address: string;
    betAmount: number;
    players: number;
    ownerBet: number;
    totalBetAmount: number;
    location: string;
    date: string;
    weatherResult: number;
}

export enum status {
    Add = "Add",
    Deploying = "Deploying",
    Done = "Done",
    Error = "Error"
}

export enum betVisability {
    Public = "Public",
    Private = "Private"
}

export enum City {
    Rotterdam = "Rotterdam",
    Amsterdam = "Amsterdam",
    Den_Haag = "Den Haag",
    Utrecht = "Utrecht",
    Groningen = "Groningen",
    Leeuwarden = "leeuwarden",
    Den_bosch = "Den Bosch",
    Eindhoven = "Eindhoven",
    Tilburg = "Tilburg"
}