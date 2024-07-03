import { FC, useEffect, useRef, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import { CardState, GameCard } from '../../types/game'
import { useAppDispatch } from '../../utility/hook'
import UserItem from '../UI/UserItem'
import { CardDTO } from '../../types/cardDTO'
import { useNavigate } from 'react-router-dom';
import { LobbyMember } from '../../types/lobby'
import CardItem from '../UI/CardItem'
import Modal from 'react-modal';
import ghostImage from '../../resource/image/ghost-sign.png'
import { updatePlayerData } from '../../store/playerDataSlice'
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
    const navigate = useNavigate()
    const [selectedCards, setSelectedCards] = useState<GameCard[]>([]);
    const hasPageBeenRendered = useRef({ effect1: false })
    const [gameWinner, setWinner] = useState<number>(-1);
    const [gameChangesShown, setGameChangesShown] = useState<boolean>(true);
    const [modalIsOpen, setIsOpen] = useState<boolean>(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {

    }

    function closeModal() {
        setIsOpen(false);
        navigate('/lobbyHost');
    }

    useEffect(() => {
        (() => {
            if (!hasPageBeenRendered.current["effect1"]) {
                props.hubConnection?.on("CardSelected" + props.player.id, (CardsUpdate: GameCard[]) => {
                    console.log("TEST")
                    console.log(CardsUpdate)
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
                props.hubConnection?.on("AllPlayerReady", () => {
                    console.log("AllPlayerReady")
                    setGameChangesShown(false)
                })
                props.hubConnection?.on("WinnerFound", () => {
                    console.log("WinnerFound")
                })
                props.hubConnection?.on("GameChangesShown" + props.player.id, (playerHand: GameCard[]) => {
                    console.log("GameChangesShown")
                    console.log(playerHand)
                    setSelectedCards([])
                    dispatch(updatePlayerData({ ...props.player, cards: playerHand }));
                    setGameChangesShown(true)
                })
            }
            hasPageBeenRendered.current["effect1"] = true
        })()
    }, []);
    const selectCard = (selectedCardId: number) => {
        console.log(selectedCardId)
        props.hubConnection?.invoke("SelectCard", props.lobby.id, props.player.id, selectedCardId).catch((err: any) => console.log(err))
    }

    function findCardById(cardId: number): CardDTO | undefined {
        return props.cardResourceData.dtos.find(card => card.id === cardId);
    }

    const Ready = () => {
        if (props.hubConnection)
            props.hubConnection.invoke("PlayerReady", props.lobby.id, props.player.id).catch((err: any) => console.log(err))
    }

    const divStyle: React.CSSProperties = {
        backgroundImage: `url("data:image/png;base64, ${props.backgroundResourceData.menu.imageData}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        width: '100%',
        height: '100vh',
        fontSize: '40px',
        color: '#FFFFFF',
    };

    return (
        <div style={divStyle}>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                {props.lobby.lobbyMembers.length != 0 ?
                    <div style={{ width: '100%' }}>
                        <div className='user-container-host' style={{ margin: '0px 48px' }}>
                            {props.lobby.lobbyMembers ?
                                props.lobby.lobbyMembers.map((item: LobbyMember) => (
                                    <>
                                        <UserItem userData={props.userResourceData.dtos} imageSize={60} item={item} style={{ marginTop: '5px', fontSize: '40px' }} />
                                        <p>Score: {item.score}</p>
                                        {gameWinner == item.id ?
                                            <p>Победитель</p> : <></>
                                        }
                                    </>
                                )) : <></>}
                        </div>
                    </div> : <></>}
            </Modal>
            <div style={{ position: 'absolute', width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', margin: '14px', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={ghostImage} alt="ghost-sign" />
                        <span>{props.lobby.lobbyMembers.filter(x => x.isReady).length}/{props.lobby.lobbyMembers.length}</span>
                    </div>
                    <button className='start-player-button' style={{ margin: '14px', fontSize: '25px', textAlign: 'center', width: '95px', height: '50px' }} onClick={() => Ready()}>Готов</button>
                </div>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '1',
            }}>
                <div>
                    <button onClick={()=>console.log(props.player.cards)}>TEST</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {selectedCards.map((card) => {
                        const cardInfo = findCardById(card.id);
                        return (
                            cardInfo !== undefined ?
                                <CardItem card={cardInfo} onSelect={(id: number) => selectCard(id)} />
                                : <></>)
                    }
                    )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {props.player.cards?.filter(x => selectedCards.find(y => y.id === x.id) === undefined).map((card) => {
                        const cardInfo = findCardById(card.id);
                        return (
                            cardInfo !== undefined ?
                                <CardItem card={cardInfo} onSelect={(id: number) => selectCard(id)} /> : <></>)
                    }
                    )}
                </div>
            </div>
        </div>
    )
}

export default connector(Game)