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

  toCSS() : string {
    return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
  }
}

@Component({
  selector: "doctt-tree",
  templateUrl: "./tree.component.html",
  styleUrls: ["./tree.component.scss"]
})
export class TreeComponent implements OnInit {
  treeControl = new NestedTreeControl<DynamicFlatNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<DynamicFlatNode>();

  private colorSat : number = 60;
  private colorLum : number = 50;
  private treeLevelMult : number = 1.0;

  constructor() {
    this.dataSource.data = null;
  }

  load(tree: TreeContent){
    console.log("Loading tree", tree);
    this.dataSource.data = this.toDataSource(tree.root);
    console.log(this.dataSource.data);
  }

  toDataSource(root : TreeNode) : DynamicFlatNode[] {
    let nodes : DynamicFlatNode[] = [];

    let lastColor = 0;

    if(root.children !== undefined){
      let incr = 360.0 / root.children.length;

      this.treeLevelMult = root.children.length;

      let element = 0;
      for (let child of root.children) {
        let color: HSLColor = new HSLColor();
        color.h = lastColor;
        color.s = this.colorSat;
        color.l = this.colorLum;

        nodes.push(
          this.getDynamicFlatNode(child, color, 0, element)
        );

        lastColor += incr;
        element++;
      }
    }

    return nodes;
  }

  getDynamicFlatNode(node : TreeNode, color: HSLColor, level: number, element: number) : DynamicFlatNode {
    let dfn : DynamicFlatNode = {
      name: node.id,
      color: this.getColor(color, level, element)
    };

    console.log("DFN: ", level, dfn.color);

    if(node.children !== undefined){
      dfn.children = [];
      let element = 0;
      for (const child of node.children) {
        dfn.children.push(
          this.getDynamicFlatNode(
            child,
            color,
            level + 1,
            element
          )
        );
        element++;
      }
    }

    return dfn;
  }

  getColor(color: HSLColor, level: number, element: number) : HSLColor {

    let nc = new HSLColor();
    nc.h = color.h;
    nc.l = color.l;
    nc.s = color.s;

    if(level != 0){
      nc.h += 15 * element + 20 * level;
    } else {
      nc.h = color.h;
    }

    console.log(nc.h);

    return nc;
  }

  hasChild = (_: number, node: DynamicFlatNode) =>
    !!node.children && node.children.length > 0;

  ngOnInit(): void {}
}
