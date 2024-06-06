import { FC, useEffect, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import * as signalR from '@microsoft/signalr';
import { getToken } from '../../utility/token';
import { LobbyMember, LobbyType } from '../../types/lobby'
import { useAppDispatch } from '../../utility/hook';
import { updateLobbyData } from '../../store/lobbyDataSlice';
import { useNavigate } from 'react-router-dom';
import { updateBackgroundResourceData } from '../../store/backgroundResourceSlice';
const mapState = (state: RootState) => (
    {
        hubConnection: state.hubConnection.hubConnection,
        lobby: state.lobbyData,
        logged: state.accountStateData.logged,
        backgroundResourceData: state.backgroundResourceData
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
        var allReady = 0
        props.lobby.lobbyMembers.map((player)=>{
            if(player.isReady==true)
                allReady+=1
        })
        if (allReady==props.lobby.lobbyMembers.length && allReady != 0)
        {
            console.log(props.lobby);
            console.log(props.hubConnection);
            console.log("invoked");
            props.hubConnection?.invoke("StartGame", props.lobby.id).then(() =>
                navigate('/gameHost')).catch(err => console.log(err))
        }
    }

    const TestConnection = () => {
        console.log(props.hubConnection?.state)
    }
    const divStyle: React.CSSProperties = {
        backgroundImage: `url("data:image/png;base64, ${props.backgroundResourceData.menu.imageData}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100vh',
    };
    
    return (
        <div style={divStyle}>
            LobbyHost
            {props.lobby.code}
            {props.lobby.lobbyMembers ?
                props.lobby.lobbyMembers.map((item: LobbyMember) => (
                    <div>name:{item.username}ready:{String(item.isReady)}</div>
                )) : <></>}
            <div>
                <button onClick={() => StartGame()}>StartGame</button>
                <button onClick={() => TestConnection()}>TestConnection</button>
            </div>
        </div>
    )
}

export default connector(Lobby)