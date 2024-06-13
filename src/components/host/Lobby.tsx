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
            <img src={labelImage} alt="CORPS" style={{ margin: '10px', marginBottom:"60px" }}></img>
            <div style={{ display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <div>
                    <img src={qrImage} alt="QR CODE" style={{ margin: '10px', width: '566px', height: '566px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: "10px" }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                        <div className="box" style={{height:'140px', display:'flex', alignItems:'center', marginRight:'20px'}}>
                            <span style={{ color: '#242587', fontSize:'60px', margin:'24px 48px'}}>КОД: {props.lobby.code.substring(0,3)}-{props.lobby.code.substring(3)}</span>
                        </div>
                        <div>
                            <button className='start-button' style={{width:'277px', height:'140px', fontSize:'60px', textAlign:'center'}} onClick={() => StartGame()}>СТАРТ</button>
                        </div>
                    </div>
                    {props.lobby.lobbyMembers.length != 0 ?
                        <div className="box" style={{ width:'100%', marginTop:'20px'}}>
                            <div className='custom-scroll' style={{margin:'30px 48px'}}>
                            {props.lobby.lobbyMembers ?
                                props.lobby.lobbyMembers.map((item: LobbyMember) => (
                                    <UserItem userData = {props.userResourceData.dtos} item = {item} style={{marginTop:'10px'}}/>
                                )) : <></>}
                                </div>
                        </div> : <></>}
                </div>
            </div>
        </div>
    )
}

export default connector(Lobby)

