export type GameCard = {
    id: number,
    state: CardState
}

export enum CardState {
    Used,
    Unused,
    Played,
    Unplayed
}