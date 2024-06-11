import { FC, useEffect, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import * as signalR from '@microsoft/signalr';
import { getToken } from '../../utility/token';
import { LobbyMember, LobbyType } from '../../types/lobby'
import { useAppDispatch } from '../../utility/hook';
import { updateLobbyData } from '../../store/lobbyDataSlice';
import { useNavigate } from 'react-router-dom';
import labelImage from '../../resource/image/CORPS.png';
import { updateBackgroundResourceData } from '../../store/backgroundResourceSlice';
const mapState = (state: RootState) => (
    {
        hubConnection: state.hubConnection.hubConnection,
        lobby: state.lobbyData,
        logged: state.accountStateData.logged,
        backgroundResourceData: state.backgroundResourceData,
        userResourceData: state.userResourceData
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
        props.lobby.lobbyMembers.map((player) => {
            if (player.isReady == true)
                allReady += 1
        })
        if (allReady == props.lobby.lobbyMembers.length && allReady != 0) {
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
        fontSize:'40px',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <div style={divStyle}>
            <img src={labelImage} alt="CORPS" style={{ margin: '10px' }}></img>
                            
            {props.lobby.code}
            {props.lobby.lobbyMembers ?
                props.lobby.lobbyMembers.map((item: LobbyMember) => (
                    <div>
                        name:{item.username}
                        ready:{String(item.isReady)}
                        <img style={{ width: '150px', height: '150px' }} src={`data:image/png;base64, ${props.userResourceData.dtos.find(x => x.id === item.avatarId)!.imageData}`} alt={`UserIcon ${item.avatarId}`} />
                    </div>

                )) : <></>}
            <div>
                <button onClick={() => StartGame()}>StartGame</button>
                <button onClick={() => TestConnection()}>TestConnection</button>
            </div>
        </div>
    )
}

export default connector(Lobby)