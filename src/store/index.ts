import { configureStore } from "@reduxjs/toolkit";
import accountReducer from './accountStateDataSlice'
import lobbyReducer from './lobbyDataSlice'
import hubConnectionReducer from './hubConnectionSlice'
import playerDataReducer from './playerDataSlice'

const store = configureStore({
    reducer: {
        accountStateData: accountReducer,
        lobbyData: lobbyReducer,
        hubConnection: hubConnectionReducer,
        playerData: playerDataReducer
    },
    //Временное решение, нужно что бы не жаловалось что hubConnection не сериализуем.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch