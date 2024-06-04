import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Image, ImageType } from '../types/imageDTO';

const initialState:userResourceStateData = {
    dtos: []
}

type userResourceStateData = {
    dtos: Image[]
}

const userResourceStateDataSlice = createSlice({
    name: 'userResourceStateDataSlice',
    initialState,
    reducers: {
        updateUserResourceData(state, action: PayloadAction<userResourceStateData>)
        {
            state.dtos=action.payload.dtos
        }
    },    
    extraReducers: (builder) => {

    }
})

export const {updateUserResourceData: updateUserResourceData} = userResourceStateDataSlice.actions

export default userResourceStateDataSlice.reducer