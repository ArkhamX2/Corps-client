import { FC, useEffect, useRef, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import { CardState, GameCard } from '../../types/game'
import { useAppDispatch } from '../../utility/hook'
import { CardDTO } from '../../types/cardDTO'
const mapState = (state: RootState) => (
    {
        hubConnection: state.hubConnection.hubConnection,
        lobby: state.lobbyData,
        player: state.playerData,
        backgroundResourceData: state.backgroundResourceData,
        userResourceData: state.userResourceData,
        cardResourceData: state.cardResourceData
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>



const connector = connect(mapState)

const Game: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    const dispatch = useAppDispatch()
    const [selectedCards, setSelectedCards] = useState<GameCard[]>([]);
    const hasPageBeenRendered = useRef({ effect1: false })
    useEffect(() => {
        (() => {
            if (!hasPageBeenRendered.current["effect1"]) {
                props.hubConnection?.on("CardSelected" + props.player.id, (CardsUpdate: GameCard[]) => {
                    CardsUpdate.map((card) => {
                        switch (card.state) {
                            case CardState.Unused:
                                {
                                    setSelectedCards(s => s.filter(c => c.id != card.id))
                                    break;
                                }
                            case CardState.Used:
                                {
                                    setSelectedCards(oldArray => [...oldArray, { id: card.id, state: card.state }])
                                    break;
                                }
                        }
                    })
                    //dispatch(updatePlayerData({ ...props.player, cards: tmp }));
                })
            }
            hasPageBeenRendered.current["effect1"] = true
        })()
    }, []);
    const selectCard = (selectedCardId: number) => {
        props.hubConnection?.invoke("SelectCard", props.lobby.id, props.player.id, selectedCardId).catch((err: any) => console.log(err))
    }
    
    function findCardById(cardId: number): CardDTO | undefined {
        return props.cardResourceData.dtos.find(card => card.id === cardId);
    }

    const divStyle: React.CSSProperties = {
        backgroundImage: `url("data:image/png;base64, ${props.backgroundResourceData.menu.imageData}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
    };

    return (
        <div style={divStyle}>
            GamePlayer
            <div>
                Cardbox
                {props.player.cards?.map((card) => {
                    const cardInfo = findCardById(card.id);
                    return (

                        cardInfo !== undefined ?
                            <div style={
                                {
                                    backgroundImage: `url("data:imageFpng;base64, ${cardInfo.background}")`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    width: '100%',
                                    height: '100%',
                                }
                            }>
                                cardId: {card.id}
                                title: {cardInfo.info.title} {cardInfo.info.power}
                                description: {cardInfo.info.description}
                                direction: {cardInfo.info.direction}
                                <button onClick={() => selectCard(card.id)}>SELECT</button>
                            </div> : <></>)
                }

                )}
            </div>
            <div>
                Selectbox
                {selectedCards.map((card) => {
                    const cardInfo = findCardById(card.id);
                    return (
                    cardInfo !== undefined ?
                    <div style={
                        {
                            backgroundImage: `url("data:imageFpng;base64, ${cardInfo.background}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '100%',
                            height: '100%',
                        }
                    }>
                        cardId: {card.id} cardState: {card.state}
                        title: {cardInfo.info.title} {cardInfo.info.power}
                        description: {cardInfo.info.description}
                        direction: {cardInfo.info.direction}
                        <button onClick={() => selectCard(card.id)}>UNSELECT</button>
                    </div>:<></>)
                }
                )}
            </div>
        </div>
    )
}

export default connector(Game)