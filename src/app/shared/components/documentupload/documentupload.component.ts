import { Component, OnInit, ViewChild, Input, ElementRef, ViewEncapsulation } from '@angular/core';
import { XmlUploadComponent } from '../xmlupload/xmlupload.component';
import { DocumentParserService } from 'Services/parser/document/DocumentParser';
import { File } from 'Models/document/document';

@Component({
  selector: "doctt-documentupload",
  templateUrl: "./documentupload.component.html",
  styleUrls: ["./documentupload.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DocumentUploadComponent implements OnInit {
  constructor(private documentService: DocumentParserService) {}

  @ViewChild("xmlUpload") xmlUpload: XmlUploadComponent;
  @ViewChild("resultBox") resultBox: ElementRef;

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
    console.log("Got document ", document);
    let file: File = this.documentService.parseXML(document);

    this.resultBox.nativeElement.innerHTML = this.jsHighlight(
      JSON.stringify(file, null, 2)
    );
  }
}