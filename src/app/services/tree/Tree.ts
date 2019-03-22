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
        console.log("Got document ", new DOMParser().parseFromString(JSON.parse(tree).tree, "text/xml"));
    }
    
    return this.treeParserService.parseXML(new DOMParser().parseFromString(JSON.parse(tree).tree, "text/xml"));
  }
}
