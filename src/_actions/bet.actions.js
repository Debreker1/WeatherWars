import { betConstants } from "../_constants"; 

export const setBet = (web3) => {
    return {
        type: betConstants.SetBet,
        payload: web3
    }
}
