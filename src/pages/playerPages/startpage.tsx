import Start from '../../components/player/Start.tsx'

interface ComponentWithBackgroundImageProps {
    backgroundImageBytes: Uint8Array;
}

const StartPlayer: React.FC<ComponentWithBackgroundImageProps> = ({ backgroundImageBytes }) => {
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
            <Start />
        </div>
    )
}

export default StartPlayer