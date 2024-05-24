import { FC, useEffect, useState } from 'react'
import { RootState } from '../../store'
import { ConnectedProps, connect } from 'react-redux'
import { getToken, setToken } from '../../utility/token'
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

const mapState = (state: RootState) => (
    {

    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const Start: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    const navigate = useNavigate()

    const [loginInfo, setLoginInfo] = useState({ login: "", password: "" })

    useEffect(() => {
        (async () => {

        })()
    }, [])

    const createLobby = () => {
        if (getToken() != null) {
            console.log("registered")
            navigate('/lobbyHost')
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

    const LoginClick = async () => {
        if (loginInfo.login != "" && loginInfo.password != "") {
            const response = await fetch("https://localhost:7017/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: loginInfo.login,
                    password: loginInfo.password
                })
            });
            if (response.ok === true) {
                const data = await response.json();
                setToken(data.access_token);
                navigate('/lobbyHost');
                //username = data.username;
            }
            else {
                // если произошла ошибка, получаем код статуса
                console.log(`Status: ${response.status}`);
            }
        }
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
                Login:
                <input autoComplete='on' placeholder='Логин' onChange={(e) => setLoginInfo({ ...loginInfo, login: e.target.value })}></input>
                Password:
                <input autoComplete='on' placeholder='Пароль' type='password' onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}></input>
                <button onClick={() => LoginClick()}>Submit</button>
            </Modal>
            StartHost
            <button onClick={() => createLobby()}>
                Host game
            </button>
        </div>
    )
}

export default connector(Start)