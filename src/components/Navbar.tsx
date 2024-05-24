import { FC, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RootState } from '../store'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => (
    {
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Navbar: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    return (
        <div style={{ display: 'flex', border: '2px solid lightgray', padding: '5px', color: '#371F76' }}>
            <Link style={{ margin: '5px', border: '2px solid lightgray', padding: '5px', width: '120px', textAlign: 'center', fontSize: '14px' }} to='/startPlayer'>
            startPlayer</Link>
            <Link style={{ margin: '5px', border: '2px solid lightgray', padding: '5px', width: '120px', textAlign: 'center', fontSize: '14px' }} to='/startHost'>
            startHost</Link>
            <Link style={{ margin: '5px', border: '2px solid lightgray', padding: '5px', width: '120px', textAlign: 'center', fontSize: '14px' }} to='/lobbyPlayer'>
            lobbyPlayer</Link>
            <Link style={{ margin: '5px', border: '2px solid lightgray', padding: '5px', width: '120px', textAlign: 'center', fontSize: '14px' }} to='/lobbyHost'>
            lobbyHost</Link>
            <Link style={{ margin: '5px', border: '2px solid lightgray', padding: '5px', width: '120px', textAlign: 'center', fontSize: '14px' }} to='/gamePlayer'>
            gamePlayer</Link>
            <Link style={{ margin: '5px', border: '2px solid lightgray', padding: '5px', width: '120px', textAlign: 'center', fontSize: '14px' }} to='/gameHost'>
            gameHost</Link>
        </div>
    )
}

export default connector(Navbar)