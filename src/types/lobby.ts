export enum LobbyState  {
    Wait,
    Start
}
export type LobbyMember  =  { 
    id: number,
    username: string, 
    isReady: boolean,
}
export type LobbyType = {
    id: number,
    state: LobbyState, 
    code: string,
    lobbyMembers: Array<LobbyMember>,
}