import { web3Constants } from "../_constants"; 

export const setWeb3 = (web3) => {
    return {
        type: web3Constants.SET_WEB3,
        payload: web3
    }
}
