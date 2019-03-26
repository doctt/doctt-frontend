import { Injectable } from '@angular/core';
import { TreeParserService } from '../parser/tree/TreeParser';

@Injectable({
  providedIn: "root"
})
export class TreeService {
  private debug: boolean = false;

  constructor(private treeParserService: TreeParserService) {}

  getActualTree(){
    let tree = localStorage.getItem("tree");
    if (tree == null){
        return null;
    }
    if(this.debug){
        console.log("Got document ", JSON.parse(tree).tree);
    }
    
    return JSON.parse(tree).tree;
  }
}
