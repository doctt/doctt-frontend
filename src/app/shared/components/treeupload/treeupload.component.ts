import { Component, OnInit, ViewChild, Input, ElementRef, ViewEncapsulation } from '@angular/core';
import { XmlUploadComponent } from '../xmlupload/xmlupload.component';
import { TreeFile } from 'Models/tree/tree';
import { TreeParserService } from 'Services/parser/tree/TreeParser';
import { TreeComponent } from '../tree/tree.component';

@Component({
  selector: "doctt-treeupload",
  templateUrl: "./treeupload.component.html",
  styleUrls: ["./treeupload.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TreeUploadComponent implements OnInit {
  constructor(private treeService: TreeParserService) {}

  @ViewChild("xmlUpload") xmlUpload: XmlUploadComponent;
  @ViewChild("resultBox") resultBox: ElementRef;
  @ViewChild("tree") treeComponent: TreeComponent;

  ngOnInit(): void {}

  jsHighlight(json: string): string {
    // From: https://stackoverflow.com/a/7220510/2560279
    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function(match) {
        var cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  }

  onUpload(document: Document) {
    console.log("Got Tree ", document);
    let file: TreeFile = this.treeService.parseXML(document);
    // Show the tree w/ the TreeComponent
    this.treeComponent.load(file.data);

    this.resultBox.nativeElement.innerHTML = this.jsHighlight(
      JSON.stringify(file, null, 2)
    );
  }
}
