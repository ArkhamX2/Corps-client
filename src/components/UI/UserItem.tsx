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
            <img style={{ width: '80px', height: '80px' }} src={`data:image/png;base64, ${props.userData.find(x => x.id === props.item.avatarId)!.imageData}`} alt={`UserIcon ${props.item.avatarId}`} />
            {props.item.isReady ? <img src={readyImage} alt="readyImage" style={{ margin: '0px 20px -100px -20px', width: '40px', height: '40px' }} /> : <div style={{ margin: '0px 20px -100px -20px', width: '40px', height: '40px' }}></div>}
            <p style={{ marginLeft:'30px', color: '#242587'}}>{props.item.username.toUpperCase()}</p>
        </div>
    )
}

export default UserItem