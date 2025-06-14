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
import labelImage from '../../resource/image/CORPS.png';
import '../../styles/index.css'

const serverIp = 'localhost'

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
                    const response = await fetch('http://' + serverIp + ':5228/api/resource/card');
                    const data = await response.json();
                    dispatch(updateCardResourceData({ dtos: data }));
                } catch (error) {
                    console.error('Error fetching cards:', error);
                }
            };

            const fetchBackground = async () => {
                try {
                    const response = await fetch('http://' + serverIp + ':5228/api/resource/background');
                    const data = await response.json();
                    dispatch(updateBackgroundResourceData({ menu: data[1], board: data[0] }));
                } catch (error) {
                    console.error('Error fetching cards:', error);
                }
            };

            const fetchUser = async () => {
                try {
                    const response = await fetch('http://' + serverIp + ':5228/api/resource/user');
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
            .withUrl('http://' + serverIp + ':5228/game')
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
        fontSize: '40px',
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
                        <div className="container-player" style={{width:'100%'}}>
                            <img src={labelImage} alt="CORPS" style={{ margin: '10px', marginBottom: '40px' }}></img>
                            <div className="box-player" style={{ width: '300px', marginTop: '20px' }}>
                                <input style={{ border: 'none', outline: 'none', width: '100%' }} value={username} placeholder='Псевдоним' onChange={e => setUsername(e.target.value)} >
                                </input>
                            </div>
                            <div className="box-player" style={{ width: '300px', marginTop: '20px' }}>
                                <input style={{ border: 'none', outline: 'none', width: '100%' }} value={lobbyCode} placeholder='Код игры' onChange={e => setLobbyCode(e.target.value)}>
                                </input>
                            </div>
                            <div style={{ width:'100%', display: 'flex', flexDirection: 'row', marginTop: '20px', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <button onClick={showPreviousImage}>Назад</button>
                                <img style={{ width: '70px', height: '70px' }} src={`data:image/png;base64, ${props.userResourceData.dtos[currentIndex].imageData}`} alt={`UserIcon ${currentIndex + 1}`} />
                                <button onClick={showNextImage}>Далее</button>
                            </div>
                            <button className='start-player-button' style={{ fontSize: '25px', marginTop: '40px', width: '300px', height: '70px' }} onClick={() => connectToHub()}>
                                <span style={{ margin: '46px 22px' }}>Присоединиться</span>
                            </button>

                        </div>

                    </div>
    )
}

export default connector(Start)