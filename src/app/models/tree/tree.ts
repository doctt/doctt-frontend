interface Realisation {
    op: string;
    args: string;
}

interface TreeNode {
    id: string;
    realisations: Realisation[] | null;
    children: TreeNode[];
}

interface TreeContent {
    root: TreeNode;
}

class TreeFile {
    public version: number;
    public data: TreeContent;

    constructor(version: number, data: TreeContent){
        this.version = version;
        this.data = data;
    }
};

export {TreeFile, TreeContent, TreeNode, Realisation};