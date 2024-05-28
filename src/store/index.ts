import { configureStore } from "@reduxjs/toolkit";
import accountReducer from './accountSlice'
import lobbyReducer from  './lobbySlice'

const store = configureStore({
    reducer: {
        account: accountReducer,
        lobby: lobbyReducer,
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch