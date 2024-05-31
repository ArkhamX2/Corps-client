import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: playerData = {
    id: undefined,
    name: "undefined",
    cards: undefined
}

export type cardType = {
    id: number,
    state: number
}

type playerData = {
    id?: number,
    name: string,
    cards?: cardType[]
}

const playerDataSlice = createSlice({
    name: 'playerDataSlice',
    initialState,
    reducers: {
        updatePlayerData(state, action: PayloadAction<playerData>) {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.cards = action.payload.cards;
        }
    },
    extraReducers: (builder) => {

    }
})

export const { updatePlayerData } = playerDataSlice.actions

export default playerDataSlice.reducer