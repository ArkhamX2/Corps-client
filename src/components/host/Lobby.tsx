import { FC, useEffect, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import * as signalR from '@microsoft/signalr';
import { getToken } from '../../utility/token';
import { LobbyMember, LobbyType } from '../../types/lobby'
import { useAppDispatch } from '../../utility/hook';
import { updateLobbyData } from '../../store/lobbyDataSlice';
import { useNavigate } from 'react-router-dom';
const mapState = (state: RootState) => (
    {
        hubConnection: state.hubConnection.hubConnection,
        lobby: state.lobbyData,
        logged: state.accountStateData.logged
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Lobby: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            
        })()
    }, [])

    const StartGame = () => {
        console.log(props.lobby);
        console.log(props.hubConnection);
        console.log("invoked");
        props.hubConnection?.invoke("StartGame", props.lobby.id).catch(err => console.log(err))
        navigate('/gameHost')
    }

    const TestConnection = () => {
        console.log(props.hubConnection?.state)
    }

    return (
        <div>
            LobbyHost
            {props.lobby.lobbyMembers ?
                props.lobby.lobbyMembers.map((item: LobbyMember) => (
                    <div>{item.username}</div>
                )) : <></>}
            <div>
                <button onClick={() => StartGame()}>StartGame</button>
                <button onClick={() => TestConnection()}>TestConnection</button>
            </div>
        </div>
    )
}

export default connector(Lobby)