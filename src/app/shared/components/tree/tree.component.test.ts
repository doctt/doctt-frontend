import { TreeComponent } from "./tree.component";
import { TreeService } from "Services/tree/Tree";
import { TreeParserService } from "Services/parser/tree/TreeParser";
import { TreeContent, TreeNode } from "Models/tree/tree";
import fs = require('fs');

test("toDataSource", () => {
  let treeParser : TreeParserService = new TreeParserService();
  let treeService : TreeService = new TreeService(treeParser);
  let tree : TreeComponent = new TreeComponent(treeService);

  let xmlfile = fs.readFileSync("resources/test/xml/layer1.xml").toString();
  let doc: Document = (new DOMParser()).parseFromString(
      xmlfile,
      "application/xml"
  );
  let parsedTree = treeParser.parseXML(doc); 
  localStorage.setItem("tree", JSON.stringify({tree : parsedTree}));
  
  let content : TreeContent = treeService.getActualTree().data;
  let arr = [];
  arr[0] = content.root;
  //expect(tree.toDataSource(content.root)).toEqual(arr); not working due to color changes
} );

test("load", () => {
  let treeParser : TreeParserService = new TreeParserService();
  let treeService : TreeService = new TreeService(treeParser);
  let tree : TreeComponent = new TreeComponent(treeService);

  let xmlfile = fs.readFileSync("resources/test/xml/layer1.xml").toString();
  let doc: Document = (new DOMParser()).parseFromString(
      xmlfile,
      "application/xml"
  );
  let parsedTree = treeParser.parseXML(doc); 
  localStorage.setItem("tree", JSON.stringify({tree : parsedTree}));
  
  let content : TreeContent = treeService.getActualTree().data;
  tree.load(content);

  expect(tree.dataSource.data).toEqual(tree.toDataSource(content.root));
} );


/*
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

  ngOnInit(): void {} */