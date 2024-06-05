import { FC, useEffect, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as signalR from '@microsoft/signalr';
import { useAppDispatch } from '../../utility/hook';
import { updateLobbyData } from '../../store/lobbyDataSlice';
import { updateHubConnection } from '../../store/hubConnectionSlice';
import { updatePlayerData } from '../../store/playerDataSlice';
import { LobbyType } from '../../types/lobby';

const mapState = (state: RootState) => (
    {
        userResourceData: state.userResourceData
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

    useEffect(() => {
        (async () => {

        })()
    }, [])

    const connectToHub = () => {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7017/game")
            .build()

        hubConnection.on("PlayerJoined", (lobby: LobbyType) => {
            console.log("PlayerJoined", lobby);
            dispatch(updateLobbyData(lobby));
        })

        hubConnection.on("LobbyMemberReady", (lobby: LobbyType) => {
            console.log("PlayerReady", lobby);
            dispatch(updateLobbyData(lobby));
        })

        hubConnection.on("JoinSuccess", (lobby, playerId) => {
            console.log("joined", lobby);
            if (!Flick) {
                dispatch(updateHubConnection({ hubConnection: hubConnection }));
                dispatch(updatePlayerData({ id: playerId, name: username }))
                navigate('/lobbyPlayer')
                Flick = true
            }
        })

        hubConnection.start().finally(() => {
            if (hubConnection.state === signalR.HubConnectionState.Connected) {
                hubConnection.invoke("JoinLobby", lobbyCode, username).catch(err => console.log(err))
            }
        }).catch(err => console.log(err))
    }

    const [currentIndex, setCurrentIndex] = useState(0);

    const totalImages = props.userResourceData.dtos.length;

    const showNextImage = () => {
        setCurrentIndex((currentIndex + 1) % totalImages);
    };

    const showPreviousImage = () => {
        setCurrentIndex((currentIndex - 1 + totalImages) % totalImages);
    };

    return (
        <div>
            StartPlayer
            Name:
            <input value={username} onChange={e => setUsername(e.target.value)} >
            </input>
            Game:
            <input value={lobbyCode} onChange={e => setLobbyCode(e.target.value)}>
            </input>
            Image:
            <div>
                {/* <img src={`url("data:image/png;base64, ${props.userResourceData.dtos[currentIndex].imageData}")`} alt={`UserIcon ${currentIndex + 1}`} /> */}

                <div>
                    <button onClick={showPreviousImage}>Назад</button>
                    <button onClick={showNextImage}>Далее</button>
                </div>
            </div>
            <button onClick={() => connectToHub()}>
                Connect to game
            </button>
        </div>
    )
}

export default connector(Start)