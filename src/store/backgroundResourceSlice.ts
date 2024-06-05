import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Image, ImageType } from '../types/imageDTO';

const initialState:backgroundResourceStateData = {
    menu:{
        name:"",
        imageData:"",
        type:ImageType.Menu
    },
    board:{
        name:"",
        imageData:"",
        type:ImageType.Board
    }
}

type backgroundResourceStateData = {
    menu: Image,
    board: Image,
}

const backgroundResourceStateDataSlice = createSlice({
    name: 'backgroundResourceStateDataSlice',
    initialState,
    reducers: {
        updateBackgroundResourceData(state, action: PayloadAction<backgroundResourceStateData>)
        {
            state.menu=action.payload.menu
            state.board=action.payload.board
        }
    },    
    extraReducers: (builder) => {

    }
})

export const {updateBackgroundResourceData: updateBackgroundResourceData} = backgroundResourceStateDataSlice.actions

export default backgroundResourceStateDataSlice.reducer