import { FC } from "react";
import { CardDTO } from "../../types/cardDTO";

type CardItemProps = {
    card:CardDTO,
    onSelect: (id:number)=>void
}

const CardItem : FC<CardItemProps> = (props: CardItemProps) => {
    return (
<div onClick={() => props.onSelect(props.card.id)} style={
                {
                    backgroundImage: `url("data:imageFpng;base64, ${props.card.background}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '120px',
                    height: '170px',
                    fontSize: '20px',
                    color: '#000000',
                    margin: '4px',
                }
            }>
                <div style={{
                    margin: '10px',
                    fontSize: '9px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span style={{ marginTop: "1           0px" }} >cardId: {props.card.id}</span>
                    <span>title: {props.card.info.title} {props.card.info.power}</span>
                    <span>description: {props.card.info.description}</span>
                    <span>direction: {props.card.info.direction}</span>
                </div>
            </div>

    );
}

export default CardItem
