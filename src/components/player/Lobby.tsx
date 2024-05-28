import { FC, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import signalR from '@microsoft/signalr'
import { LobbyMember } from '../../types/lobby'

const mapState = (state: RootState) => (
    {
        hubConnection: state.hubConnection.hubConnection,
        lobby: state.lobbyData,
        username: state.playerData.name
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Lobby: FC<PropsFromRedux> = (props: PropsFromRedux) => {

    const Ready = () => {
        if (props.hubConnection)
            props.hubConnection.invoke("LobbyMemberReady", props.lobby.code, props.username).catch((err: any) => console.log(err))
    }

    return (
        <div>
            {props.lobby.lobbyMemberList.map((item: LobbyMember) => (
                <div>{item.username}</div>
            ))}
            <div>
                <button onClick={() => Ready()} />
            </div>
        </div>
    )
}

export default connector(Lobby)