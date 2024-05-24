import { FC, useEffect } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => (
    {

    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Start: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    return (
        <div>
            StartPlayer
            Name:
            <input>
            </input>
            Game:
            <input>
            </input>
            <button>
                Connect to game
            </button>
        </div>
    )
}

export default connector(Start)