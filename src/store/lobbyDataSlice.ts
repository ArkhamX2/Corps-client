import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LobbyType, LobbyState } from '../types/lobby';

const initialState:LobbyType = {
    id:0,
    lobbyMemberList:[],
    code:"",
    state:LobbyState.Wait,
}

const lobbyDataSlice = createSlice({
    name: 'lobbyDataSlice',
    initialState,
    reducers: {
        updateLobbyData(state, action: PayloadAction<LobbyType>)
        {
            state.id=action.payload.id
            state.lobbyMemberList=action.payload.lobbyMemberList
            state.code=action.payload.code
            state.state=action.payload.state
        }
    },    
    extraReducers: (builder) => {

    }
})

export const {updateLobbyData} = lobbyDataSlice.actions

export default lobbyDataSlice.reducer