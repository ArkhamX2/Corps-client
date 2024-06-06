export interface Image {
    id: number;
    name: string;
    type: ImageType;
    imageData: string;
}

export enum ImageType {
    Menu,
    Board,
    CardBackground,
    CardIcon,
    UserIcon,
}