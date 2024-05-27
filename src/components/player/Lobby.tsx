import { FC, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import signalR from '@microsoft/signalr'

const mapState = (state: RootState) => (
    {

    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Lobby: FC<PropsFromRedux> = (props: PropsFromRedux) => {

    const { state } = useLocation();

    const Ready = () => {
            state.hubConnection.invoke("LobbyMemberReady", state.lobbyCode, state.username).catch((err: any) => console.log(err))
    }

    return (
        <div>
            {state.lobby.lobbyMemberList.map((item: LobbyMember) => (
                <div>{item.username}</div>
            ))}
            <div>
                <button onClick={() => Ready()} />
            </div>
        </div>
    )
}

export default connector(Lobby)