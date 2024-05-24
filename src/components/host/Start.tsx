import { FC, useEffect, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import { getToken } from '../../utility/token'
import Modal from 'react-modal';

const mapState = (state: RootState) => (
    {

    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Start: FC<PropsFromRedux> = (props: PropsFromRedux) => {

    const [token, setToken] = useState<string>()

    useEffect(() => {
        (async () => {
            setToken(getToken()?.value)
        })()
    }, [])

    const createLobby = () => {
        if (token != null) {
            console.log("registered")
        }
        else {
            console.log("not registered")
            openModal()
        }
    }

    const [modalIsOpen, setIsOpen] = useState<boolean>(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {

    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
                Register here
            </Modal>
            StartHost
            <button onClick={() => createLobby()}>
                Host game
            </button>
        </div>
    )
}

export default connector(Start)