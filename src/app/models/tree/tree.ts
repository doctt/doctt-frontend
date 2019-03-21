interface TreeNode {
    id: string;
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

export {TreeFile, TreeContent, TreeNode};