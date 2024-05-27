enum LobbyState  {
    Wait,
    Start
}
type LobbyMember  =  { 
    username: string, 
    isReady: boolean,
}
type Lobby = {
    id: number,
    state: LobbyState, 
    lobbyMemberList: Array<LobbyMember>,
}
