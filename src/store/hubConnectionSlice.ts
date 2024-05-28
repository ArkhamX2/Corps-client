import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState:hubConnectionType = {hubConnection:undefined}

type hubConnectionType = {
    hubConnection?: signalR.HubConnection
}

const hubConnectionSlice = createSlice({
    name: 'hubConnectionSlice',
    initialState,
    reducers: {
        updateHubConnection(state, action: PayloadAction<hubConnectionType>)
        {
            state.hubConnection=action.payload.hubConnection
        }
    },    
    extraReducers: (builder) => {

    }
})

export const {updateHubConnection} = hubConnectionSlice.actions

export default hubConnectionSlice.reducer