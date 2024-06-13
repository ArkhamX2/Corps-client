import React, { CSSProperties, FC } from 'react'
import { LobbyMember, LobbyType } from '../../types/lobby'
import readyImage from '../../resource/image/ready.png'
import { Image } from '../../types/imageDTO';


type UserItemProps = {
    item : LobbyMember,
    style : CSSProperties,
    userData: Image[]
}

const UserItem : FC<UserItemProps> = (props: UserItemProps) => {
    return (

        <div style={{display: 'flex', flexDirection:'row' ,alignItems: 'center', justifyContent: 'flex-start', ...props.style}}>
            <img style={{ width: '150px', height: '150px' }} src={`data:image/png;base64, ${props.userData.find(x => x.id === props.item.avatarId)!.imageData}`} alt={`UserIcon ${props.item.avatarId}`} />
            {props.item.isReady ? <img src={readyImage} alt="QR CODE" style={{ margin: '0px 20px -100px -20px', width: '40px', height: '40px' }} /> : <div style={{ margin: '0px 20px -100px -20px', width: '40px', height: '40px' }}></div>}
            <span style={{ color: '#242587' }}>{props.item.username.toUpperCase()}</span>
        </div>
    )
}

export default UserItem