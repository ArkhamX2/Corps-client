import { FC, useEffect, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as signalR from '@microsoft/signalr';
import { useAppDispatch } from '../../utility/hook';
import { updateLobbyData } from '../../store/lobbySlice';

const mapState = (state: RootState) => (
    {

    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Start: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [username, setUsername] = useState("");
    const [lobbyCode, setLobbyCode] = useState(0);

    const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7017/game")
        .build()

        

        //TODO: Переделать navigate на редукс
    hubConnection.on("JoinSuccess", (lobby) => {
        console.log("joined",lobby);
        dispatch(updateLobbyData({code: lobbyCode,...lobby}));
        navigate('/lobbyPlayer',{state:{ hub: hubConnection,username: username}})
        
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
            <input input-type="number" value={lobbyCode} onChange={e => setLobbyCode(parseInt(e.target.value))}>
            </input>
            <button onClick={() => ConnectToLobby()}>
                Connect to game
            </button>
        </div>
    )
}

export default connector(Start)