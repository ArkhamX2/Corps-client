import StartHost from "../pages/hostPages/startpage.tsx"
import StartPlayer from "../pages/playerPages/startpage.tsx"
import BlankPage from "../pages/blankpage.tsx"
import LobbyHost from "../pages/hostPages/lobbypage.tsx"
import LobbyPlayer from "../pages/playerPages/lobbypage.tsx"
import GameHost from "../pages/hostPages/gamepage.tsx"
import GamePlayer from "../pages/playerPages/gamepage.tsx"
export const privateRoutes = [
    { path: '/startHost', element: StartHost },
    { path: '/blank', element: BlankPage },
    { path: '/lobbyHost', element: LobbyHost },
    { path: '/lobbyPlayer', element: LobbyPlayer },
    { path: '/gameHost', element: GameHost },
    { path: '/gamePlayer', element: GamePlayer },
]

export const publicRoutes = [
    { path: '/startPlayer', element: StartPlayer },
]