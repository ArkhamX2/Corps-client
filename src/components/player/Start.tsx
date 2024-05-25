import { FC, useEffect } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as signalR from '@microsoft/signalr';

const mapState = (state: RootState) => (
    {

    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Start: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    const navigate = useNavigate()

    const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7017/game")
        .build()

    hubConnection.on("JoinSuccess", () => { console.log("joined"); })

    useEffect(() => {
        (async () => {
            await hubConnection.start().catch(err => console.log(err))
        })()
    }, [])

    const ConnectToLobby = () => {
        if (hubConnection.state === signalR.HubConnectionState.Connected) {
            hubConnection.invoke("JoinLobby",0,"qwerty").catch(err => console.log(err))
        }
    }

    return (
        <div>
            StartPlayer
            Name:
            <input>
            </input>
            Game:
            <input>
            </input>
            <button onClick={() => ConnectToLobby()}>
                Connect to game
            </button>
        </div>
    )
}

export default connector(Start)