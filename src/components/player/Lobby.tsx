import { FC, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useRef, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import signalR from '@microsoft/signalr'
import { LobbyMember, LobbyType } from '../../types/lobby'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../utility/hook'
import { updatePlayerData } from '../../store/playerDataSlice'
import { GameCard } from '../../types/game'

const mapState = (state: RootState) => (
    {
        hubConnection: state.hubConnection.hubConnection,
        lobby: state.lobbyData,
        player: state.playerData
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
                props.hubConnection?.on("GameStarted" + props.player.id, (playerHand:GameCard[]) => {
                    console.log("GameStarted", playerHand);
                    dispatch(updatePlayerData({...props.player, cards:playerHand }));
                    navigate('/gamePlayer');
                })
            }
            hasPageBeenRendered.current["effect1"] = true
        })()
    }, []);

    return (
        <div>
            {props.lobby.lobbyMembers.map((item: LobbyMember) => (
                <div>name:{item.username}ready:{String(item.isReady)}</div>
            ))}
            <div>
                <button onClick={() => Ready()}>READY</button>
                <button onClick={() => TestConnection()}>TestConnection</button>
            </div>
        </div>
    )
}

export default connector(Lobby)