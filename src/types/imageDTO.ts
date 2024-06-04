export interface Image {
    name: string;
    type: ImageType;
    imageData: Uint8Array;
}

export enum ImageType {
    Menu,
    Board,
    CardBackground,
    CardIcon,
    UserIcon,
}