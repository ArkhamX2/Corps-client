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

    const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7017/game",{ accessTokenFactory: () => getToken()!.value })
        .build()

    hubConnection.on("CreateSuccess", (id,lobby) => { console.log("Created",id,lobby);  })
    hubConnection.on("PlayerJoined", (lobby) => { console.log("PlayerJoined", lobby);  })

    useEffect(() => {
        (async () => {
            if (props.logged) {
                await hubConnection.start().catch(err => console.log(err))
                if (hubConnection.state === signalR.HubConnectionState.Connected) {
                    hubConnection.invoke("CreateLobby").catch(err => console.log(err))
                }
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