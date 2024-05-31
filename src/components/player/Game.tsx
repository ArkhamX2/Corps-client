import { FC, useEffect } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'

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
                        cardState: {card.state}
                        <button onClick={()=>selectCard(card.id)}>SELECT</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default connector(Game)