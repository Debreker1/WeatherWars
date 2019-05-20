import { betConstants } from "../_constants";
export const betActions = {
    setBet
} 

function setBet(name) {
    return {
        type: betConstants.SetBet,
        payload: name
    }
}