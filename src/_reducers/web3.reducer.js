import { web3Constants } from '../_constants';

const initialState = {
    Web3: "",
    Accounts: ""
};

export function web3Reducer(state = initialState, action) {
    switch (action.type) {
        case web3Constants.SET_WEB3:
            state = {
                ...state,
                Web3: action.payload
            };
        case web3Constants.SET_ACCOUNTS:
            state = {
                ...state,
                Accounts: action.payload
            }    
        break;
        default:
            return state;
        }
    return state;
}