import { FC } from "react"
import { ConnectedProps, connect } from "react-redux"
import Lobby from "../../components/player/Lobby"
import { RootState } from "../../store"
const mapState = (state: RootState) => (
    {
        backgroundResourceData: state.backgroundResourceData
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)
const LobbyPlayer: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    const divStyle: React.CSSProperties = {
        backgroundImage: `url("data:image/png;base64, ${props.backgroundResourceData.menu.imageData}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
    };
    return (
        <div style={divStyle}>
            <Lobby />
        </div>
    )
}

export default LobbyPlayer