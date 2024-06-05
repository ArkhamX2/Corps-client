export interface Image {
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