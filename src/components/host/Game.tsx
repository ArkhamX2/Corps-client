import { FC, useEffect, useRef, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import { CardState, GameCard } from '../../types/game'
import UserItem from '../UI/UserItem'
import { LobbyMember } from '../../types/lobby'

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
        height: '100vh',
        fontSize: '40px',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    };
    return (
        <div style={divStyle}>
            <div style={{display:'flex',flexDirection:'row'}}>
                <div
                    style={{
                        backgroundImage: `url("data:image/png;base64, ${props.backgroundResourceData.board.imageData}")`,
                        backgroundSize: "850px 480px",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        width:  '850px',
                        height:   '480px',
                    }}
                >

                </div>
                <div>
                    {props.lobby.lobbyMembers.length != 0 ?
                        <div style={{ width: '100%' }}>
                            <div className='user-container-host' style={{ margin: '0px 48px' }}>
                                {props.lobby.lobbyMembers ?
                                    props.lobby.lobbyMembers.map((item: LobbyMember) => (
                                        <UserItem userData={props.userResourceData.dtos} imageSize={60} item={item} style={{ marginTop: '5px', fontSize: '40px' }} />
                                    )) : <></>}
                            </div>
                        </div> : <></>}
                </div>

            </div>
        </div>
    )
}

export default connector(Game)