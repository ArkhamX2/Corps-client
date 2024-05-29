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

const mapState = (state: RootState) => (
    {

    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Start: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [loginInfo, setLoginInfo] = useState({ login: "", password: "" })

    useEffect(() => {
        (async () => {

        })()
    }, [])

    const createLobby = () => {
        if (getToken() != null) {
            console.log("registered")
            dispatch(updateAccountData({ logged: true }))
            connectToHub();
            navigate('/lobbyHost')
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
            .withUrl("https://localhost:7017/game", { accessTokenFactory: () => getToken()!.value })
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
                hubConnection.invoke("CreateLobby").catch(err => console.log(err))
            }
            console.log(hubConnection);

        }).catch(err => console.log(err))
    }

    const LoginClick = async () => {
        if (loginInfo.login != "" && loginInfo.password != "") {
            const response = await fetch("https://localhost:7017/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: loginInfo.login,
                    password: loginInfo.password
                })
            });
            if (response.ok === true) {
                const data = await response.json();
                setToken(data.access_token);
                navigate('/lobbyHost');
                //username = data.username;
            }
            else {
                // если произошла ошибка, получаем код статуса
                console.log(`Status: ${response.status}`);
            }
        }
    }

    return (
        <div>
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
            </Modal>
            StartHost
            <button onClick={() => createLobby()}>
                Host game
            </button>
        </div>
    )
}

export default connector(Start)