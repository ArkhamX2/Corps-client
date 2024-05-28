import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState:playerData = {name:"undefined"}

type playerData = {
    name: string
}

const playerDataSlice = createSlice({
    name: 'playerDataSlice',
    initialState,
    reducers: {
        updatePlayerData(state, action: PayloadAction<playerData>)
        {
            state.name=action.payload.name
        }
    },    
    extraReducers: (builder) => {

    }
})

export const {updatePlayerData} = playerDataSlice.actions

export default playerDataSlice.reducer