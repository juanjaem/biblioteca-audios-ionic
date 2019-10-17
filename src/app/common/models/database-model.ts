export class Database {
    config: {
        player: {
            playSpeed: number;
        }
    };
    folders: Folder[];

    constructor() {
        this.folders = [];
    }
}

export class Folder {
    id: number;
    name: string;
    img: string;
    audios: Audio[];
    show?: boolean;

    constructor() {
        this.id = undefined;
        this.name = '';
        this.img = '';
        this.audios = [];
        this.show = true;
    }
}

export class Audio {
    fileName: string;
    title: string;
    lastModification: Date;
    duration: number;
    size: number;
    tag: string;
    show?: boolean;

    constructor() {
        this.fileName = '';
        this.title = '';
        this.lastModification = undefined;
        this.duration = 0;
        this.size = 0;
        this.tag = '';
        this.show = true;
    }
}
