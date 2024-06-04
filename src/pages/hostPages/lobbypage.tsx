import Lobby from "../../components/host/Lobby"

interface ComponentWithBackgroundImageProps {
    backgroundImageBytes: Uint8Array;
}
const LobbyHost: React.FC<ComponentWithBackgroundImageProps> = ({ backgroundImageBytes }) => {
    const backgroundImageUrl = `data:image/png;base64,${Buffer.from(backgroundImageBytes).toString('base64')}`;

    const divStyle: React.CSSProperties = {
        backgroundImage: `url(${backgroundImageUrl})`,
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