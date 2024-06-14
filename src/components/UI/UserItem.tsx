import React, { CSSProperties, FC } from 'react'
import { LobbyMember, LobbyType } from '../../types/lobby'
import readyImage from '../../resource/image/ready.png'
import { Image } from '../../types/imageDTO';


type UserItemProps = {
    item : LobbyMember,
    style : CSSProperties,
    imageSize?: number,
    userData: Image[]
}

const UserItem : FC<UserItemProps> = (props: UserItemProps) => {
    return (

        <div style={{display: 'flex', flexDirection:'row' ,alignItems: 'center', justifyContent: 'flex-start', ...props.style}}>
            <img style={{ width: props.imageSize??'70px', height: props.imageSize??'70px' }} src={`data:image/png;base64, ${props.userData.find(x => x.id === props.item.avatarId)!.imageData}`} alt={`UserIcon ${props.item.avatarId}`} />
            {props.item.isReady ? <img src={readyImage} alt="readyImage" style={{ margin: '45px 20px 0px -20px', width: '30px', height: '30px' }} /> : <div style={{ margin: '0px 20px -100px -20px', width: '40px', height: '40px' }}></div>}
            <p style={{ marginLeft:'30px', color: '#ffffff'}}>{props.item.username.toUpperCase()}</p>
        </div>
    )
}

export default UserItem