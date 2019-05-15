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

class ColorizedUtilities {
    public static getFeatures(node: ColorizedNode): string[] {
        let features: string[] = [];
        if (node == null) {
            return null;
        }
        
        features.push(...this.getFeatures(node.parent));
        if (node.name.toUpperCase() != node.name && node.name.toUpperCase().indexOf('-TYPE') == -1) {
            features.push(node.name);
        }
        return features;
    }
}

export { ColorizedTree, ColorizedNode, ColorizedUtilities };