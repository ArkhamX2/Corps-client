import Start from '../../components/host/Start.tsx'

interface ComponentWithBackgroundImageProps {
    backgroundImageBytes: Uint8Array;
}

const StartHost: React.FC<ComponentWithBackgroundImageProps> = ({ backgroundImageBytes }) => {
    const backgroundImageUrl = `data:image/png;base64,${Buffer.from(backgroundImageBytes).toString('base64')}`;

    const divStyle: React.CSSProperties = {
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '400px', // Вы можете настроить высоту под ваши требования
    };

    return (
        <div style={divStyle}>
            <Start />
        </div>
    )
}

export default StartHost