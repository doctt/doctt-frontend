import { Component, OnInit } from "@angular/core";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { NestedTreeControl } from "@angular/cdk/tree";

interface DynamicFlatNode {
  name: string;
  color: string;
  children?: DynamicFlatNode[];
}

@Component({
  selector: "doctt-tree",
  templateUrl: "./tree.component.html",
  styleUrls: ["./tree.component.scss"]
})
export class TreeComponent implements OnInit {
  treeControl = new NestedTreeControl<DynamicFlatNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<DynamicFlatNode>();

  constructor() {
    this.dataSource.data = [
      {
        name: "Fruit",
        color: "#FF5722",
        children: [{ name: "Apple", color: "#FF8A65" }]
      }
    ];
  }

  parseXML(xml : XMLDocument){
      let parser = new DOMParser();
  }

  hasChild = (_: number, node: DynamicFlatNode) =>
    !!node.children && node.children.length > 0;

  ngOnInit(): void {}
}
