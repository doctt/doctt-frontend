import { Component, OnInit } from "@angular/core";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { NestedTreeControl } from "@angular/cdk/tree";
import { TreeContent, TreeNode } from "Models/tree/tree";
import { getClosureSafeProperty } from "@angular/core/src/util/property";

interface DynamicFlatNode {
  name: string;
  color: HSLColor;
  children?: DynamicFlatNode[];
}

class HSLColor {
  public h: number;
  public s: number;
  public l: number;

  constructor (h: number, s: number, l: number){
    this.h = h;
    this.s = s;
    this.l = l;
  }

  toCSS() : string {
    return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
  }
}

function toHSL(hex : string) : HSLColor {
  hex = hex.toUpperCase();
  if(!hex.match(/^#[A-F0-9]{6}$/)){
    return null;
  }
  let v = hex.match(/[A-F0-9]{2}/g);
  let r = parseInt(v[0], 16) / 255;
  let g = parseInt(v[1], 16) / 255;
  let b = parseInt(v[2], 16) / 255;

  let min = Math.min(r,g,b);
  let max = Math.max(r,g,b);

  let l = (max + min) / 2;
  let s = (l < 0.5 ? (max-min)/(max+min) : (max-min)/(2.0 - max - min));
  let h = (max == r ? (g-b)/(max-min) : (
    max == g ? 2.0 + (b-r) / (max-min) :
    4.0 + (r-g) / (max-min)
  ));

  h *= 60;
  if(h < 0){
    h += 360;
  }

  let hslColor = new HSLColor(Math.round(h), Math.round(s * 100), Math.round(l * 100));

  return hslColor;
}

@Component({
  selector: "doctt-tree",
  templateUrl: "./tree.component.html",
  styleUrls: ["./tree.component.scss"]
})
export class TreeComponent implements OnInit {
  treeControl = new NestedTreeControl<DynamicFlatNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<DynamicFlatNode>();

  private colorSat: number = 60;
  private colorLum: number = 50;
  private treeLevelMult: number = 1.0;
  private colors: Array<HSLColor> = [
    toHSL("#fc5353"),
    toHSL("#a7fc53"),
    toHSL("#53fca7"),
    toHSL("#53c4fc"),
    toHSL("#5353fc")
  ];

  constructor() {
    this.dataSource.data = null;
  }

  load(tree: TreeContent) {
    console.log("Loading tree", tree);
    this.dataSource.data = this.toDataSource(tree.root);
    console.log(this.dataSource.data);
  }

  toDataSource(root: TreeNode): DynamicFlatNode[] {
    let nodes: DynamicFlatNode[] = [];

    let lastColor = 0;

    if (root.children !== undefined) {
      let incr = 360.0 / root.children.length;

      this.treeLevelMult = root.children.length;

      let element = 0;

      let level = 0;
      if (root.children != null && root.children.length == 1) {
        level = -1;
      }

      for (let child of root.children) {
        let color: HSLColor = this.colors[element];
        nodes.push(this.getDynamicFlatNode(child, color, level, element));

        lastColor += incr;
        element++;
      }
    }

    return nodes;
  }

  getDynamicFlatNode(
    node: TreeNode,
    color: HSLColor,
    level: number,
    element: number
  ): DynamicFlatNode {
    if (level == 0 || level == -1) {
      color = this.colors[element];
      color.s = 50;
      color.l = 50;
    } else {
      color = this.getColor(color, level, element);
    }
    let dfn: DynamicFlatNode = {
      name: node.id,
      color:
        level == 0 || level == -1
          ? color
          : this.getColor(color, level, element + 1)
    };

    console.log(dfn.name, dfn.color);

    if (node.children !== undefined) {
      dfn.children = [];
      let element = 0;
      for (const child of node.children) {
        dfn.children.push(
          this.getDynamicFlatNode(child, color, level + 1, element)
        );
        element++;
      }
    }

    return dfn;
  }

  getColor(color: HSLColor, level: number, element: number): HSLColor {
    let nc = new HSLColor(color.h, color.s, color.l);

    element += 1;

    if (level != 0 && level != -1) {
      nc.h += 0 + element * 5;
      nc.l += 0 + element * 2;
      nc.s += 8;
      //nc.h = nc.h % 360;
    }

    return nc;
  }

  hasChild = (_: number, node: DynamicFlatNode) =>
    !!node.children && node.children.length > 0;

  ngOnInit(): void {}
}
