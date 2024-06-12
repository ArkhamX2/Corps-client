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
import { updateBackgroundResourceData } from '../../store/backgroundResourceSlice';
import { updateCardResourceData } from '../../store/cardResourceSlice';
import { updateUserResourceData } from '../../store/userResourceSlice';

const mapState = (state: RootState) => (
    {
        backgroundResourceData: state.backgroundResourceData,
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

    const [loadingBackground, setLoadingBackground] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingCards, setLoadingCards] = useState(true);

    var Flick = false

    useEffect(() => {
        (async () => {

            const fetchCards = async () => {
                try {
                    const response = await fetch('https://localhost:7017/api/resource/card');
                    const data = await response.json();
                    dispatch(updateCardResourceData({ dtos: data }));
                } catch (error) {
                    console.error('Error fetching cards:', error);
                }
            };

            const fetchBackground = async () => {
                try {
                    const response = await fetch('https://localhost:7017/api/resource/background');
                    const data = await response.json();
                    dispatch(updateBackgroundResourceData({ menu: data[1], board: data[0] }));
                } catch (error) {
                    console.error('Error fetching cards:', error);
                }
            };

            const fetchUser = async () => {
                try {
                    const response = await fetch('https://localhost:7017/api/resource/user');
                    const data = await response.json();
                    dispatch(updateUserResourceData({ dtos: data }));
                    console.log(data);

                } catch (error) {
                    console.error('Error fetching cards:', error);
                }
            };

            await fetchCards();
            setLoadingCards(false);
            await fetchBackground();
            setLoadingBackground(false);
            await fetchUser();
            setLoadingUser(false);
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
                dispatch(updatePlayerData({ id: playerId, name: username, avatarId: props.userResourceData.dtos[currentIndex].id }))
                navigate('/lobbyPlayer')
                Flick = true
            }
        })

        hubConnection.start().finally(() => {
            if (hubConnection.state === signalR.HubConnectionState.Connected) {
                hubConnection.invoke("JoinLobby", lobbyCode, username, props.userResourceData.dtos[currentIndex].id).catch(err => console.log(err))
            }
        }).catch(err => console.log(err))
    }

    const divStyle: React.CSSProperties = {
        backgroundImage: `url("data:image/png;base64, ${props.backgroundResourceData.menu.imageData}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100vh',
        fontSize:'40px',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const [currentIndex, setCurrentIndex] = useState(0);

    const totalImages = props.userResourceData.dtos.length;

    const showNextImage = () => {
        setCurrentIndex((currentIndex + 1) % totalImages);
    };

    const showPreviousImage = () => {
        setCurrentIndex((currentIndex - 1 + totalImages) % totalImages);
    };



    return (
        loadingBackground ?
            <p>Загрузка заднего фона...</p> :
            loadingUser ?

                <p>Загрузка автарок игроков...</p> :

                loadingCards ?

                    <p>Загрузка карт...</p> :

                    <div style={divStyle}>
                        StartPlayer
                        Name:
                        <input value={username} onChange={e => setUsername(e.target.value)} >
                        </input>
                        Game:
                        <input value={lobbyCode} onChange={e => setLobbyCode(e.target.value)}>
                        </input>
                        Image:
                        <div>
                            <img style={{ width: '150px', height: '150px' }} src={`data:image/png;base64, ${props.userResourceData.dtos[currentIndex].imageData}`} alt={`UserIcon ${currentIndex + 1}`} />
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