export class DB {
    config: {
        player: {
            playSpeed: number;
        }
    };
    folders: Folder[];
}

export class Folder {
    id: number;
    name: string;
    img: string;
    audios: Audio[];
    show?: boolean;
}

export class Audio {
    fileName: string;
    title: string;
    date: Date;
    duration: number;
    size: number;
    tag: string;
    show?: boolean;
}
