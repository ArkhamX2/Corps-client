import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {logged:false}

type accountInfo = {
    logged: boolean
}

const accountSlice = createSlice({
    name: 'accountSlice',
    initialState,
    reducers: {
        updateAccountData(state, action: PayloadAction<accountInfo>)
        {
            state.logged=action.payload.logged
        }
    },    
    extraReducers: (builder) => {

    }
})

export const {updateAccountData} = accountSlice.actions

export default accountSlice.reducer