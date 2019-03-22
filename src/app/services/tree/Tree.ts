import { Injectable } from '@angular/core';
import { DocumentParserService } from 'Services/parser/document/DocumentParser';

@Injectable({
  providedIn: "root"
})
export class TreeService {
  private debug: boolean = false;

  constructor(private documentService: DocumentParserService) {}

  getActualTree(){
    let tree = localStorage.getItem("tree");
    if (tree == null){
        return null;
    }
    if(this.debug){
        console.log("Got document ", new DOMParser().parseFromString(JSON.parse(tree).tree, "text/xml"));
    }
    
    return this.documentService.parseXML(new DOMParser().parseFromString(JSON.parse(tree).tree, "text/xml"));
  }
}
