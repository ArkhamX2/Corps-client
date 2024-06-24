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
import qrImage from '../../resource/image/qr-code.png';
import readyImage from '../../resource/image/ready.png';
import '../../styles/index.css'
import { updateBackgroundResourceData } from '../../store/backgroundResourceSlice';
import UserItem from '../UI/UserItem';
import ghostImage from '../../resource/image/ghost-sign.png'
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
        fontSize: '40px',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <div style={divStyle}>
            <img src={labelImage} alt="CORPS" style={{ margin: '10px', marginBottom: "60px" }}></img>
            <div style={{ display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <div>
                    <div className="box-host" style={{ height: '100px', width: '404px', display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                        <span style={{ color: '#242587', fontSize: '45px', margin: '24px 48px' }}>КОД: {props.lobby.code.substring(0, 3)}-{props.lobby.code.substring(3)}</span>
                    </div>
                    <div>
                        <button onClick={() => navigator.clipboard.writeText(props.lobby.code)}>Copy</button>
                    </div>
                    <img src={qrImage} alt="QR CODE" style={{ marginTop: '45px', width: '404px', height: '404px' }} />
                </div>
                <div className='lobby-members-container-host' style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{width:'100%', display:'flex',flexDirection:'row', justifyContent:'space-between',alignItems:'center'}}>
                        <div style={{display:'flex', margin:'0px 10px',flexDirection:'row', justifyContent:'center',alignItems:'center'}}>
                            <img src={ghostImage} alt="ghost-sign" />
                            <span>{props.lobby.lobbyMembers.filter(x=>x.isReady).length}/{props.lobby.lobbyMembers.length}</span>
                            </div>
                        <button className='start-host-button' style={{ width: '196px', height: '66px', fontSize: '40px', textAlign: 'center' }} onClick={() => StartGame()}>СТАРТ</button>
                    </div>
                    {props.lobby.lobbyMembers.length != 0 ?
                        <div style={{ width: '100%' }}>
                            <div className='user-container-host' style={{ margin: '0px 48px' }}>
                                {props.lobby.lobbyMembers ?
                                    props.lobby.lobbyMembers.map((item: LobbyMember) => (
                                        <UserItem userData={props.userResourceData.dtos} imageSize={60} item={item} style={{ marginTop: '5px', fontSize:'40px' }} />
                                    )) : <></>}
                            </div>
                        </div> : <></>}
                </div>
            </div>
        </div>
    )
}

export default connector(Lobby)

