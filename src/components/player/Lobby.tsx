import { FC, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import signalR from '@microsoft/signalr'
import { LobbyMember, LobbyType } from '../../types/lobby'

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

    const Ready = () => {
        if (props.hubConnection)
            props.hubConnection.invoke("LobbyMemberReady", props.lobby.id, props.player.id).catch((err: any) => console.log(err))
    }

    const TestConnection = () => {
        console.log(props.hubConnection?.state)
    }

    return (
        <div>
            {props.lobby.lobbyMemberList.map((item: LobbyMember) => (
                <div>{item.username}</div>
            ))}
            <div>
                <button onClick={() => Ready()}>READY</button>
                <button onClick={() => TestConnection()}>TestConnection</button>
            </div>
        </div>
    )
}

export default connector(Lobby)