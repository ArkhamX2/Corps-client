import { FC, useEffect, useRef, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import { CardState, GameCard } from '../../types/game'
import { useAppDispatch } from '../../utility/hook'
import { updatePlayerData } from '../../store/playerDataSlice'

const mapState = (state: RootState) => (
    {
        hubConnection: state.hubConnection.hubConnection,
        lobby: state.lobbyData,
        player: state.playerData
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
    return (
        <div>
            GamePlayer
            <div>
                Cardbox
                {props.player.cards?.map((card) =>
                    <div>
                        cardId: {card.id}
                        <button onClick={() => selectCard(card.id)}>SELECT</button>
                    </div>
                )}
            </div>
            <div>
                Selectbox
                {selectedCards.map((card) =>
                    <div>
                        cardId: {card.id} cardState: {card.state}
                        <button onClick={() => selectCard(card.id)}>UNSELECT</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default connector(Game)