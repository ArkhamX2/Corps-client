import { FC, useEffect, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as signalR from '@microsoft/signalr';
import { useAppDispatch } from '../../utility/hook';
import { updateLobbyData } from '../../store/lobbyDataSlice';
import { updateHubConnection } from '../../store/hubConnectionSlice';
import { updatePlayerData } from '../../store/playerDataSlice';

const mapState = (state: RootState) => (
    {
        playerData: state.playerData
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Start: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [username, setUsername] = useState("");
    const [lobbyCode, setLobbyCode] = useState("");
    var Flick = false

    const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7017/game")
        .build()

    hubConnection.on("JoinSuccess", (lobby, playerId) => {
        console.log("joined", lobby);
        dispatch(updateLobbyData(lobby));
        if (!Flick) {
            dispatch(updateHubConnection({ hubConnection: hubConnection }));
            dispatch(updatePlayerData({ id: playerId, name: username }))
            navigate('/lobbyPlayer')
            Flick = true
        }

        console.log("joined33");
    })

    useEffect(() => {
        (async () => {

        })()
    }, [])

    const ConnectToLobby = () => {
        hubConnection.start().finally(() => {
            if (hubConnection.state === signalR.HubConnectionState.Connected) {
                hubConnection.invoke("JoinLobby", lobbyCode, username).catch(err => console.log(err))
            }
        }).catch(err => console.log(err))
    }

    return (
        <div>
            StartPlayer
            Name:
            <input value={username} onChange={e => setUsername(e.target.value)} >
            </input>
            Game:
            <input value={lobbyCode} onChange={e => setLobbyCode(e.target.value)}>
            </input>
            <button onClick={() => ConnectToLobby()}>
                Connect to game
            </button>
        </div>
    )
}

export default connector(Start)