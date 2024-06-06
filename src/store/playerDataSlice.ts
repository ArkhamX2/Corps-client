import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameCard } from '../types/game';

const initialState: playerData = {
    id: undefined,
    name: "undefined",
    cards: undefined
}

type playerData = {
    id?: number,
    name: string,
    cards?: GameCard[],
    avatarId?: number
}

const playerDataSlice = createSlice({
    name: 'playerDataSlice',
    initialState,
    reducers: {
        updatePlayerData(state, action: PayloadAction<playerData>) {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.cards = action.payload.cards;
            state.avatarId = action.payload.avatarId;
        }
    },
    extraReducers: (builder) => {

    }
})

export const { updatePlayerData } = playerDataSlice.actions

export default playerDataSlice.reducer