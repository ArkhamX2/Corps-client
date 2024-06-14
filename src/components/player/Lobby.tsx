import { FC, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useRef, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import signalR from '@microsoft/signalr'
import { LobbyMember, LobbyType } from '../../types/lobby'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../utility/hook'
import { updatePlayerData } from '../../store/playerDataSlice'
import { GameCard } from '../../types/game'
import UserItem from '../UI/UserItem'
import labelImage from '../../resource/image/CORPS.png';

const mapState = (state: RootState) => (
    {
        hubConnection: state.hubConnection.hubConnection,
        lobby: state.lobbyData,
        player: state.playerData,
        backgroundResourceData: state.backgroundResourceData,
        userResourceData: state.userResourceData
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Lobby: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    const dispatch = useAppDispatch()
    const hasPageBeenRendered = useRef({ effect1: false })
    const navigate = useNavigate()
    const Ready = () => {
        if (props.hubConnection)
            props.hubConnection.invoke("LobbyMemberReady", props.lobby.id, props.player.id).catch((err: any) => console.log(err))
    }

    const TestConnection = () => {
        console.log(props.hubConnection?.state)
    }

    useEffect(() => {
        (() => {
            if (!hasPageBeenRendered.current["effect1"]) {
                props.hubConnection?.on("GameStarted" + props.player.id, (playerHand: GameCard[]) => {
                    console.log("GameStarted", playerHand);
                    dispatch(updatePlayerData({ ...props.player, cards: playerHand }));
                    navigate('/gamePlayer');
                })
            }
            hasPageBeenRendered.current["effect1"] = true
        })()
    }, []);

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
            <img src={labelImage} alt="CORPS" style={{ margin: '10px', marginBottom: "20px" }}></img>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                    <div>
                        <button className='start-player-button' style={{ fontSize: '25px', textAlign:'center', width: '300px', height: '70px' }} onClick={() => Ready()}>Готов</button>
                    </div>
                </div>
                {props.lobby.lobbyMembers.length != 0 ?
                    <div className="box-player" style={{margin:'20px' }}>
                        <div className='custom-scroll-player' style={{ margin: '10px' }}>
                            {props.lobby.lobbyMembers ?
                                props.lobby.lobbyMembers.map((item: LobbyMember) => (
                                    <UserItem userData={props.userResourceData.dtos} item={item} style={{ marginTop: '10px', width:'650px' }} />
                                )) : <></>}
                        </div>
                    </div> : <></>}
            </div>
        </div>
    )
}

export default connector(Lobby)