import { FC, useEffect } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => (
    {

    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Game: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    return (
        <div>
            GameHost
        </div>
    )
}

export default connector(Game)