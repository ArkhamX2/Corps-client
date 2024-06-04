import { configureStore } from "@reduxjs/toolkit";
import accountReducer from './accountStateDataSlice'
import lobbyReducer from './lobbyDataSlice'
import hubConnectionReducer from './hubConnectionSlice'
import playerDataReducer from './playerDataSlice'
import cardResourceSlice from "./cardResourceSlice";
import backgroundResourceSlice from "./backgroundResourceSlice";
import userResourceSlice from "./userResourceSlice";

const store = configureStore({
    reducer: {
        accountStateData: accountReducer,
        lobbyData: lobbyReducer,
        hubConnection: hubConnectionReducer,
        playerData: playerDataReducer,
        cardResourceData: cardResourceSlice,
        backgroundResourceData: backgroundResourceSlice,
        userResourceData: userResourceSlice
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