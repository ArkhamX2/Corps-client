import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LobbyType, LobbyState, LobbyMember } from '../types/lobby';

const initialState: LobbyType = {
    id: 0,
    lobbyMembers: [],
    code: "",
    state: LobbyState.Wait,
}
const lobbyDataSlice = createSlice({
    name: 'lobbyDataSlice',
    initialState,
    reducers: {
        updateLobbyData(state, action: PayloadAction<LobbyType>) {
            state.id = action.payload.id
            state.lobbyMembers = action.payload.lobbyMembers
            state.code = action.payload.code
            state.state = action.payload.state
        },
        updateLobbyMemberData(state, action: PayloadAction<LobbyMember>) {
            state.lobbyMembers[action.payload.id] = action.payload
        }
    },
    extraReducers: (builder) => {

    }
})

export const { updateLobbyData, updateLobbyMemberData } = lobbyDataSlice.actions

export default lobbyDataSlice.reducer