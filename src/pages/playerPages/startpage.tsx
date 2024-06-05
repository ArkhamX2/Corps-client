import { FC, useEffect, useState } from 'react';
import Start from '../../components/player/Start.tsx'
import { updateBackgroundResourceData } from '../../store/backgroundResourceSlice.ts';
import { updateCardResourceData } from '../../store/cardResourceSlice.ts';
import { updateUserResourceData } from '../../store/userResourceSlice.ts';
import { useAppDispatch } from '../../utility/hook.ts';
import { RootState } from '../../store/index.ts';
import { ConnectedProps, connect } from 'react-redux';

const mapState = (state: RootState) => (
    {
        backgroundResourceData: state.backgroundResourceData,
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const StartPlayer: FC<PropsFromRedux> = (props: PropsFromRedux) => {

    const dispatch = useAppDispatch();

    const [loadingBackground, setLoadingBackground] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingCards, setLoadingCards] = useState(true);

    useEffect(() => {
        (async () => {

            const fetchCards = async () => {
                try {
                    const response = await fetch('https://localhost:7017/api/resource/card');
                    const data = await response.json();
                    dispatch(updateCardResourceData({ dtos: data }));
                } catch (error) {
                    console.error('Error fetching cards:', error);
                }
            };

            const fetchBackground = async () => {
                try {
                    const response = await fetch('https://localhost:7017/api/resource/background');
                    const data = await response.json();
                    dispatch(updateBackgroundResourceData({ menu: data[1], board: data[0] }));
                } catch (error) {
                    console.error('Error fetching cards:', error);
                }
            };

            const fetchUser = async () => {
                try {
                    const response = await fetch('https://localhost:7017/api/resource/user');
                    const data = await response.json();
                    dispatch(updateUserResourceData({ dtos: data }));
                    console.log(data);

                } catch (error) {
                    console.error('Error fetching cards:', error);
                }
            };

            await fetchCards();
            setLoadingCards(false);
            await fetchBackground();
            setLoadingBackground(false);
            await fetchUser();
            setLoadingUser(false);
        })()
    }, [])

    return (
        loadingBackground ?
            <p>Загрузка заднего фона...</p> :
            loadingUser ?

                <p>Загрузка автарок игроков...</p> :

                loadingCards ?

                    <p>Загрузка карт...</p> :

                    <div style={{
                        backgroundImage: `url("data:image/png;base64, ${props.backgroundResourceData.menu.imageData}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        width: '100%',
                        height: '100%',
                    }}>
                        <Start />
                    </div>
    )
}

export default StartPlayer