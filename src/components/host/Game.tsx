import { FC, useEffect, useRef, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import { CardState, GameCard } from '../../types/game'

type SelectedCard = {
    selectedCard: GameCard,
    playerId: number
}

const mapState = (state: RootState) => (
    {
        hubConnection: state.hubConnection.hubConnection,
        lobby: state.lobbyData,
        backgroundResourceData: state.backgroundResourceData,
        userResourceData: state.userResourceData,
        cardResourceData: state.cardResourceData
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Game: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    const hasPageBeenRendered = useRef({ effect1: false })
    const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
    useEffect(() => {
        (() => {
            if (!hasPageBeenRendered.current["effect1"]) {
                props.hubConnection?.on("CardSelected", (playerId: number, CardsUpdate: GameCard[]) => {
                    console.log(playerId);
                    console.log(CardsUpdate);
                    CardsUpdate.map((card) => {
                        switch (card.state) {
                            case CardState.Unused:
                                {
                                    //selectedCards.find((s)=>s.playerId==playerId)?.selectedCards.find((c)=>c.id!=card.id)
                                    setSelectedCards(s => s.filter(c => c.selectedCard.id != card.id))
                                    break;
                                }
                            case CardState.Used:
                                {
                                    setSelectedCards(oldArray => [...oldArray, { selectedCard: card, playerId: playerId }])
                                    break;
                                }
                        }
                    })
                })
            }
            hasPageBeenRendered.current["effect1"] = true
        })()
    }, []);
    const divStyle: React.CSSProperties = {
        backgroundImage: `url("data:image/png;base64, ${props.backgroundResourceData.menu.imageData}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
    };
    return (
        <div style={divStyle}>
            GameHost
            <div>SelectedCards:

                {props.lobby.lobbyMembers.map((player, i) =>
                    <div>
                        playerId: {i}
                        {selectedCards.filter((card) => card.playerId === i).map((card) => {
                            const cardInfo = props.cardResourceData.dtos.filter((x) => x.id == card.selectedCard.id)[0];
                            return (<div style={
                                {
                                    backgroundImage: `url("data:imageFpng;base64, ${cardInfo.background}")`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    width: '100%',
                                    height: '100%',
                                }
                            }>
                                <div>
                                    selectedCardId: {card.selectedCard.id} selectedCardState: {card.selectedCard.state}
                                </div>
                                cardId: {card.selectedCard.id}
                                title: {cardInfo.info.title} {cardInfo.info.power}
                                description: {cardInfo.info.description}
                                direction: {cardInfo.info.direction}
                            </div>)
                        }
                        )}
                    </div>

                )}
                {props.lobby.lobbyMembers.map((player, i) =>
                    <div>
                        playerId: {i}
                        {selectedCards.filter((card) => card.playerId === i).map((card) =>
                            <div>
                                selectedCardId: {card.selectedCard.id} selectedCardState: {card.selectedCard.state}
                            </div>)}
                    </div>
                )}
            </div>
        </div>
    )
}

export default connector(Game)