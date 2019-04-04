import { Component, OnInit } from "@angular/core";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { NestedTreeControl } from "@angular/cdk/tree";
import { TreeContent, TreeNode } from "Models/tree/Tree";
import { TreeService } from "Services/tree/Tree";
import { HSLColor } from "Models/hslcolor/HSLColor";
import { ColorizedNode } from "Models/tree/ColorizedTree";
import { TreeColorizer } from "Services/tree/TreeColorizer";

@Component({
  selector: "doctt-tree",
  templateUrl: "./tree.component.html",
  styleUrls: ["./tree.component.scss"]
})
export class TreeComponent implements OnInit {
  treeControl = new NestedTreeControl<ColorizedNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ColorizedNode>();

  

  constructor(private treeService: TreeService) {
    if (treeService.getActualTree() == null) {
      this.dataSource.data = null;
      console.log("Tree not loaded!");
    } else {
      this.load(treeService.getActualTree().data);
    }
  }

  load(tree: TreeContent) {
    this.dataSource.data = TreeColorizer.colorize(tree.root);
    console.log("Tree loaded");
  }


  hasChild = (_: number, node: ColorizedNode) =>
    !!node.children && node.children.length > 0;

  ngOnInit(): void {}
}
