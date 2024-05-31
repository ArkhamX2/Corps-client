import { FC, useEffect, useRef, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'

type SelectedCard = {
    selectedCardId: number,
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
                props.hubConnection?.on("CardSelected", (playerId: number, selectedCardId: number) => {
                    setSelectedCards(oldArray => [...oldArray, { selectedCardId: selectedCardId, playerId: playerId }])
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
                                selectedCardId: {card.selectedCardId}
                            </div>)}
                    </div>
                )}
            </div>
        </div>
    )
}

export default connector(Game)