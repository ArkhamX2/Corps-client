import { FC, useEffect } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const mapState = (state: RootState) => (
    {

    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Start: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    const navigate = useNavigate()
    
    const ConnectToLobby = () => {

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