import { FC, useEffect, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import * as signalR from '@microsoft/signalr';
import { getToken } from '../../utility/token';
const mapState = (state: RootState) => (
    {
        logged: state.account.logged
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Lobby: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    let token = getToken()!
    const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7017/game", {accessTokenFactory: () => token.value})
    .build()
    useEffect(() => {
        (async () => {
            if (props.logged) {
                hubConnection.start()
            }
        })()
    }, [])

    return (
        <div>
            LobbyHost
        </div>
    )
}

export default connector(Lobby)