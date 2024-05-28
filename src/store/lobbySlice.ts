import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState:Lobby = {
    id:0,
    lobbyMemberList:[],
    code:0,
    state:LobbyState.Wait,
}

const lobbySlice = createSlice({
    name: 'lobbySlice',
    initialState,
    reducers: {
        updateLobbyData(state, action: PayloadAction<Lobby>)
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

export const {updateLobbyData} = lobbySlice.actions

export default lobbySlice.reducer