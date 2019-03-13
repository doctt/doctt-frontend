import { Component } from "@angular/core";
import { HtmlParser } from "@angular/compiler";

let debug = 1;

interface FileInfo {
  version: String;
  encoding: String;
}

interface Header {
  textfile: String;
  lang: String;
}

interface Segment {
  features: String[];
  id: BigInteger;
  state: String;
}

interface Body {
  segments: Segment[];
}

interface Document {
  header: Header;
  body: Body;
}

interface File {
  info: FileInfo;
  data: Document;
}

@Component({
  selector: "xmlupload",
  templateUrl: "./xmlupload.component.html",
  styleUrls: ["./xmlupload.component.scss"]
})
export class XmlUploadComponent {
  ngOnInit(): void {}

  load(files: FileList) {
    let fileReader = new FileReader();
    fileReader.readAsText(files[0]);

    fileReader.onloadend = e => {
      if (debug) {
        console.log(e);
        console.log(fileReader.readyState);
        console.log(fileReader.result.toString());
        let v = new DOMParser().parseFromString(
          fileReader.result.toString(),
          "text/xml"
        );
        
        let r = Array.prototype.map.call(
          v.querySelector("body").childNodes,
          (a: Node, i : Number) => {
            if (a.nodeType === Node.TEXT_NODE) {
               let d = document.createElement("segment");
               d.innerHTML = a.textContent;
               a = d;
            }
            
            (<HTMLElement> a).setAttribute("id", i.toString());
            return a;
          }
        );

        console.log(r[0].textContent.split('\n'));
        debugger;

        console.log(r);
      }
    };

  }
}
