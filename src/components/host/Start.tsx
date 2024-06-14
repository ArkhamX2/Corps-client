import { FC, useEffect, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import { getToken, setToken } from '../../utility/token'
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../utility/hook';
import { updateAccountData } from '../../store/accountStateDataSlice';
import * as signalR from '@microsoft/signalr';
import { LobbyType } from '../../types/lobby';
import { updateLobbyData } from '../../store/lobbyDataSlice';
import { updateHubConnection } from '../../store/hubConnectionSlice';
import { updateCardResourceData } from '../../store/cardResourceSlice';
import { updateBackgroundResourceData } from '../../store/backgroundResourceSlice';
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

    const [loginInfo, setLoginInfo] = useState({ login: "", password: "" })

    const [loadingBackground, setLoadingBackground] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingCards, setLoadingCards] = useState(true);

    useEffect(() => {
        (async () => {

            const fetchCards = async () => {
                try {
                    const response = await fetch('http://'+serverIp+':5228/api/resource/card');
                    const data = await response.json();
                    dispatch(updateCardResourceData({ dtos: data }));
                } catch (error) {
                    console.error('Error fetching cards:', error);
                }
            };

            const fetchBackground = async () => {
                try {
                    const response = await fetch('http://'+serverIp+':5228/api/resource/background');
                    const data = await response.json();
                    dispatch(updateBackgroundResourceData({ menu: data[1], board: data[0] }));
                } catch (error) {
                    console.error('Error fetching cards:', error);
                }
            };

            const fetchUser = async () => {
                try {
                    const response = await fetch('http://'+serverIp+':5228/api/resource/user');
                    const data = await response.json();
                    dispatch(updateUserResourceData({ dtos: data }));

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

    const createLobby = () => {
        if (getToken()?.value != null) {
            console.log("registered")
            dispatch(updateAccountData({ logged: true }))
            connectToHub();
        }
        else {
            console.log("not registered")
            dispatch(updateAccountData({ logged: false }))
            openModal()
        }
    }

    const [modalIsOpen, setIsOpen] = useState<boolean>(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {

    }

    function closeModal() {
        setIsOpen(false);
    }

    const connectToHub = async () => {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://'+serverIp+':5228/game', { accessTokenFactory: () => getToken()!.value })
            .build()

        hubConnection.on("CreateSuccess", (lobby: LobbyType) => {
            console.log("Created", lobby);
            dispatch(updateLobbyData(lobby));
            dispatch(updateHubConnection({ hubConnection: hubConnection }));
        })

        hubConnection.on("PlayerJoined", (lobby: LobbyType) => {
            console.log("PlayerJoined", lobby);
            dispatch(updateLobbyData(lobby));
        })

        hubConnection.on("LobbyMemberReady", (lobby: LobbyType) => {
            console.log("PlayerReady", lobby);
            dispatch(updateLobbyData(lobby));
        })

        hubConnection.on("GameStarted", (lobby) => {
            console.log("GameStarted", lobby);
        })

        await hubConnection.start().finally(() => {
            if (hubConnection.state === signalR.HubConnectionState.Connected) {
                hubConnection.invoke("CreateLobby", getToken()!.value).catch(err => { console.log(err); setToken(null); })
            }
            console.log(hubConnection);

        }).catch(err => console.log(err))

        navigate('/lobbyHost')
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

    const LoginClick = async () => {
        if (loginInfo.login != "" && loginInfo.password != "") {
            const response = await fetch('http://'+serverIp+':5228/jwt/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    login: loginInfo.login,
                    password: loginInfo.password
                })
            });
            if (response.ok === true) {
                const data = await response.json();
                setToken(data.Token);
                connectToHub();
            }
            else {
                // если произошла ошибка, получаем код статуса
                console.log(`Status: ${response.status}`);
            }
        }
    }

    const register = async () => {
        const response = await fetch('http://'+serverIp+':5228/jwt/register', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                login: loginInfo.login,
                password: loginInfo.password
                //123_aA
            })
        });
    }

    return (
        loadingBackground ?
            <p>Загрузка заднего фона...</p> :
            loadingUser ?

                <p>Загрузка автарок игроков...</p> :

                loadingCards ?
                    <p>Загрузка карт...</p> :

                    <div style={divStyle}>
                        <Modal
                            isOpen={modalIsOpen}
                            onAfterOpen={afterOpenModal}
                            onRequestClose={closeModal}
                            contentLabel="Example Modal"
                            ariaHideApp={false}
                        >
                            Login:
                            <input autoComplete='on' placeholder='Логин' onChange={(e) => setLoginInfo({ ...loginInfo, login: e.target.value })}></input>
                            Password:
                            <input autoComplete='on' placeholder='Пароль' type='password' onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}></input>
                            <button onClick={() => LoginClick()}>Submit</button>
                            <button onClick={() => register()}>REGISTER ME</button>
                        </Modal>

                        <div className="container-host">
                            <img src={labelImage} alt="CORPS" style={{ margin: '10px', marginBottom:'74px' }}></img>
                            <div className="box-host" >
                                <p className='box-host-text'>{"Игра будет отображаться на этом экране."}</p>
                                <p className='box-host-text'>{"Делай ходы на телефоне и наблюдай за развитием событий на большом экране."} </p>
                            </div>
                            <button className='start-host-button' style={{fontSize:'60px', marginTop:'74px', width:'740px', height:'140px'}} onClick={() => createLobby()}>
                                <span style={{margin:'46px 22px'}}> СОЗДАТЬ КОМНАТУ</span>
                            </button>

                        </div>
                    </div>
    )
}

export default connector(Start)