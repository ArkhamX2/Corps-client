import { FC, useEffect, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import * as signalR from '@microsoft/signalr';
import { getToken } from '../../utility/token';
import { LobbyMember, LobbyType } from '../../types/lobby'
const mapState = (state: RootState) => (
    {
        logged: state.accountStateData.logged
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Lobby: FC<PropsFromRedux> = (props: PropsFromRedux) => {

    const [lobby, setLobby] = useState<LobbyType>()

    const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7017/game", { accessTokenFactory: () => getToken()!.value })
        .build()
    hubConnection.on("CreateSuccess", (lobby:LobbyType) => { console.log("Created", lobby); setLobby(lobby); console.log(hubConnection);
     })
    hubConnection.on("PlayerJoined", (lobby:LobbyType) => { console.log("PlayerJoined", lobby); setLobby(lobby); console.log(hubConnection); })
    hubConnection.on("LobbyMemberReady", (lobby:LobbyType) => { console.log("PlayerReady", lobby); setLobby(lobby); console.log(hubConnection); })
    hubConnection.on("GameStarted", (lobby) => { console.log("GameStarted", lobby); console.log(hubConnection); })

    useEffect(() => {
        (async () => {
            if (props.logged) {
                await hubConnection.start().catch(err => console.log(err))
                if (hubConnection.state === signalR.HubConnectionState.Connected) {
                    hubConnection.invoke("CreateLobby").catch(err => console.log(err))
                }
                console.log(hubConnection);
            }
        })()
    }, [])


    const StartGame = () => {
        console.log(lobby);
        console.log(hubConnection);
        console.log("invoked");
        hubConnection.invoke("StartGame", lobby!.id).catch(err  => console.log(err))
    }


    return (
        <div>
            LobbyHost
            {lobby && lobby.lobbyMemberList ?
                lobby.lobbyMemberList.map((item: LobbyMember) => (
                    <div>{item.username}</div>
                )) : <></>}
            <div>
                <button onClick={() => StartGame()}>StartGame</button>
            </div>
        </div>
    )
}

export default connector(Lobby)