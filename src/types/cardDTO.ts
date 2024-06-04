
export interface CardDTO {
    Id: number;
    Type: string;
    Background: Uint8Array;
    Icon: Uint8Array;
    Info: CardInfoDTO;
}

export interface CardInfoDTO {
    Title: string;
    Description: string;
    Direction: string;
    Power: number | null;
}