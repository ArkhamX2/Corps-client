import { FC } from "react"
import { ConnectedProps, connect } from "react-redux"
import Game from "../../components/player/Game"
import { RootState } from "../../store"
const mapState = (state: RootState) => (
    {
        backgroundResourceData: state.backgroundResourceData
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const GamePlayer: FC<PropsFromRedux> = (props: PropsFromRedux) => {

    const divStyle: React.CSSProperties = {
        backgroundImage: `url("data:image/png;base64, ${props.backgroundResourceData.menu.imageData}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
    };
    return (
        <div style={divStyle}>
            <Game />
        </div>
    )
}

export default GamePlayer