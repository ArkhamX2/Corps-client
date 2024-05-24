import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {Token:"", accountId:0}

type accountInfo = {
    token: string
    accountId: number
}

const accountSlice = createSlice({
    name: 'accountSlice',
    initialState,
    reducers: {
        updateAccountData(state, action: PayloadAction<accountInfo>)
        {
            state.Token=action.payload.token
            state.accountId=action.payload.accountId
        }
    },    
    extraReducers: (builder) => {

    }
})

export const {updateAccountData} = accountSlice.actions

export default accountSlice.reducer