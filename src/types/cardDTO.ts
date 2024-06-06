
export interface CardDTO {
    id: number;
    type: string;
    background: string;
    icon: string;
    info: CardInfoDTO;
}

export interface CardInfoDTO {
    title: string;
    description: string;
    direction: string;
    power: number | null;
}