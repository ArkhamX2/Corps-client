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
                                    setSelectedCards(s => s.filter(c => c.selectedCard.id!=card.id))
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

    return (
        <div>
            GameHost
            <div>SelectedCards:
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