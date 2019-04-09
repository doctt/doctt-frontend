import { Injectable } from '@angular/core';
import { TreeParserService } from '../parser/tree/TreeParser';
import { TreeFile, TreeNode } from 'Models/tree/Tree';
import { ColorizedNode } from 'Models/tree/ColorizedTree';
import { TreeColorizer } from './TreeColorizer';

@Injectable({
  providedIn: "root"
})
export class TreeService {
  private debug: boolean = false;

  constructor(private treeParserService: TreeParserService) {}

  getActualTree() : TreeFile {
    let tree = localStorage.getItem("tree");
    if (tree == null){
        return null;
    }
    if(this.debug){
        console.log("Got document ", JSON.parse(tree).tree);
    }
    
    return JSON.parse(tree).tree;
  }

  colorizeTree(tree: TreeNode) : ColorizedNode[] {
    return TreeColorizer.colorize(tree);
  }
}
