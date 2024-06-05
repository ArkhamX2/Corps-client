
export interface CardDTO {
    Id: number;
    Type: string;
    Background: string;
    Icon: string;
    Info: CardInfoDTO;
}

export interface CardInfoDTO {
    Title: string;
    Description: string;
    Direction: string;
    Power: number | null;
}