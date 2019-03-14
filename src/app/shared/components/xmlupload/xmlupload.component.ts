import { Component } from "@angular/core";
import { HtmlParser } from "@angular/compiler";
import { parse } from "url";

let debug = 0;

interface Header {
  textfile: string;
  lang: string;
}

interface Segment {
  features: string[];
  id: number;
  state: string;
}

interface Body {
  segments: Segment[];
}

interface Document {
  header: Header;
  body: Body;
}

interface File {
  version : number;
  data: Document;
}

function createSegment(features: string[], id: number, state: string) {
  let newSegment = { features : [""] , id: -1, state : "active"};
  if (features) {
    newSegment.features = features;
  }
  if(id){
    newSegment.id = id;
  }
  if(state){
    newSegment.state = state;
  }
  return newSegment;
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
      }
      let parser = new DOMParser().parseFromString(
        fileReader.result.toString(),
        "text/xml"
      );
      
      let segmentsArray : Array<HTMLElement> = Array.prototype.map.call(
        parser.querySelector("body").childNodes,
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
    
      if(debug){
        console.log(segmentsArray[0].textContent.split('\n'));
        console.log(segmentsArray);
      }

      let segs : Segment[] = [];
      for(let i in segmentsArray){
        let features_str : string;
        features_str = segmentsArray[i].getAttribute("features");
        let features : string[];
        if(features_str)
          features = features_str.split(";");
          segs.push(createSegment(
          features,
          parseInt(segmentsArray[i].getAttribute("id")),
          "active"
        ));
      }

      if(debug){
        for(let i in segs){
          console.log(i, "\t ",  segs[i].features);
        }
      }

      let headerArray = parser.querySelector("header").children;
      let head : Header = {
        textfile : headerArray[0].textContent, 
        lang : headerArray[1].textContent
      };

      let bod : Body = {
        segments : segs
      }

      let doc : Document = {
        header : head,
        body : bod
      }

      let file : File = {
        version : 1,
        data : doc
      }
    };

  }
}
