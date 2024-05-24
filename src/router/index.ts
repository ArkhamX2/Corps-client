import StartHost from "../pages/hostPages/startpage.tsx"
import StartPlayer from "../pages/playerPages/startpage.tsx"
import BlankPage from "../pages/blankpage.tsx"
export const privateRoutes = [
    { path: '/startHost', element: StartHost },
    { path: '/blank', element: BlankPage },
]

export const publicRoutes = [
    { path: '/startPlayer', element: StartPlayer },
]