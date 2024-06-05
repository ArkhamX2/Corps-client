import { FC } from "react"
import { ConnectedProps, connect } from "react-redux"
import Lobby from "../../components/host/Lobby"
import { RootState } from "../../store"
import { useAppDispatch } from "../../utility/hook"
const mapState = (state: RootState) => (
    {
        backgroundResourceData: state.backgroundResourceData
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)
const LobbyHost: FC<PropsFromRedux> = (props: PropsFromRedux) => {

    const dispatch = useAppDispatch();

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

export default LobbyHost