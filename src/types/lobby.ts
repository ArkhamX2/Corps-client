export enum LobbyState  {
    Wait,
    Start
}
export type LobbyMember  =  { 
    username: string, 
    isReady: boolean,
}
export type LobbyType = {
    id: number,
    state: LobbyState, 
    code: number,
    lobbyMemberList: Array<LobbyMember>,
}
