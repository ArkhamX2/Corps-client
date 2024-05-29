import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: playerData = {
    id: undefined,
    name: "undefined"
}

type playerData = {
    id?: number,
    name: string
}

const playerDataSlice = createSlice({
    name: 'playerDataSlice',
    initialState,
    reducers: {
        updatePlayerData(state, action: PayloadAction<playerData>) {
            state.id = action.payload.id;
            state.name = action.payload.name
        }
    },
    extraReducers: (builder) => {

    }
})

export const { updatePlayerData } = playerDataSlice.actions

export default playerDataSlice.reducer