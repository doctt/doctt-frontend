interface Header {
    textfile: string;
    title: string;
    lang: string;
    created_on: Date;
    id: number;
}

interface Segment {
    features: string[];
    id: number;
    state: string;
    text: string;
    children: Segment[];
}

interface Body {
    segments: Segment[];
}

interface Document {
    header: Header;
    body: Body;
}

class File {
    public version: number;
    public data: Document;

    constructor(version: number, data: Document){
        this.version = version;
        this.data = data;
    }
};

export {File, Document, Body, Segment, Header};