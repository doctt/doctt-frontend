import { HSLColor } from "Models/hslcolor/HSLColor";
import { ColorizedNode } from "Models/tree/ColorizedTree";
import { TreeNode } from "Models/tree/Tree";

class TreeColorizer {
  private static colors: Array<HSLColor> = [
    HSLColor.toHSL("#9E9E9E"),
    HSLColor.toHSL("#f44336"),
    HSLColor.toHSL("#673AB7"),
    HSLColor.toHSL("#4CAF50"),
    HSLColor.toHSL("#FFC107")
  ];

  static colorize(root: TreeNode): ColorizedNode[] {
    let nodes: ColorizedNode[] = [];
    nodes.push(this.getColorizedNode(root, this.colors[0], -1, 0));

    return nodes;
  }

  static getColorizedNode(
    node: TreeNode,
    color: HSLColor,
    level: number,
    element: number
  ): ColorizedNode {
    let newColor: HSLColor;
    if (level == -1) {
      // Root
      newColor = this.colors[0];
      newColor.s = 50;
      newColor.l = 50;
    } else if (level == 0) {
      let c = this.colors[element + 1];
      newColor = new HSLColor(c.h, 60, 44);
    } else {
      newColor = this.getColor(color, level, element);
    }
    let dfn: ColorizedNode = {
      name: node.id,
      color:
        level == 0 || level == -1
          ? newColor
          : this.getColor(newColor, level, element)
    };

    if (node.children !== undefined) {
      dfn.children = [];

      if (node.children.length == 1) {
        if (node.children[0].children != undefined) {
          if (node.children[0].children.length > 1) {
            // Skip node, show directly node.children[0]
            node.children[0].id = node.id;
            return this.getColorizedNode(
              node.children[0],
              color,
              level,
              element
            );
          }
        }
      }

      {
        let element = 0;

        for (const child of node.children) {
          dfn.children.push(
            this.getColorizedNode(child, newColor, level + 1, element)
          );
          element++;
        }
      }
    }

    return dfn;
  }

  static getColor(color: HSLColor, level: number, element: number): HSLColor {
    let nc = new HSLColor(color.h, color.s, color.l);

    nc.h += 4 + Math.exp(-level) * 15 * element;
    nc.l += 8;
    nc.s += 10;
    //nc.h = nc.h % 360;

    return nc;
  }
}

export { TreeColorizer };
