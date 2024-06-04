import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CardDTO } from '../types/cardDTO';

const initialState:cardResourceStateData = {dtos:[]}

type cardResourceStateData = {
    dtos: CardDTO[]
}

const cardResourceStateDataSlice = createSlice({
    name: 'cardResourceStateDataSlice',
    initialState,
    reducers: {
        updateCardResourceData(state, action: PayloadAction<cardResourceStateData>)
        {
            state.dtos=action.payload.dtos
        }
    },    
    extraReducers: (builder) => {

    }
})

export const {updateCardResourceData} = cardResourceStateDataSlice.actions

export default cardResourceStateDataSlice.reducer