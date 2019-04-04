import { HSLColor } from "Models/hslcolor/HSLColor";

interface ColorizedTree {
    root: ColorizedNode;
}

interface ColorizedNode {
    name: string;
    color: HSLColor;
    children?: ColorizedNode[];
    parent?: ColorizedNode
}

export {ColorizedTree, ColorizedNode};