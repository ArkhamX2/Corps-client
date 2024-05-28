import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState:accountStateData = {logged:false}

type accountStateData = {
    logged: boolean
}

const accountStateDataSlice = createSlice({
    name: 'accountStateSlice',
    initialState,
    reducers: {
        updateAccountData(state, action: PayloadAction<accountStateData>)
        {
            state.logged=action.payload.logged
        }
    },    
    extraReducers: (builder) => {

    }
})

export const {updateAccountData} = accountStateDataSlice.actions

export default accountStateDataSlice.reducer