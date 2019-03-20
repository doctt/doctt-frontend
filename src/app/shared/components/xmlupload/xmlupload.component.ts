import { Component, ViewChild, ElementRef } from "@angular/core";
import { HtmlParser } from "@angular/compiler";
import { parse } from "url";

import {
  Body,
  Document,
  Segment,
  Header,
  File
} from "Models/document/document";
import { MatProgressBar } from "@angular/material";

function createSegment(features: string[], id: number, state: string) {
  let newSegment = { features: [""], id: -1, state: "active" };
  if (features) {
    newSegment.features = features;
  }
  if (id) {
    newSegment.id = id;
  }
  if (state) {
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
  private debug: boolean = true;

  @ViewChild("progressBar") progressBar: MatProgressBar;
  private progress : number;

  ngOnInit(): void {
    this.progressBar._elementRef.nativeElement.style.display = 'hidden';
    console.log(this.progressBar);
  }

  load(files: FileList) : Promise<File> {
    let fileReader = new FileReader();
    this.progressBar._elementRef.nativeElement.style.display = "block";
    fileReader.readAsText(files[0]);

    let promise = new Promise<File>((resolve, reject)=>{
      this.progress = 0; 
      fileReader.onloadend = (e) => {
        if (this.debug) {
          console.log(e);
          console.log(fileReader.readyState);
          console.log(fileReader.result.toString());
        }
        let parser = new DOMParser().parseFromString(
          fileReader.result.toString(),
          "text/xml"
        );

        this.progress = 10;

        let segmentsArray: Array<HTMLElement> = Array.prototype.map.call(
          parser.querySelector("body").childNodes,
          (a: Node, i: Number) => {
            if (a.nodeType === Node.TEXT_NODE) {
              let d = document.createElement("segment");
              d.innerHTML = a.textContent;
              a = d;
            }

            (<HTMLElement>a).setAttribute("id", i.toString());
            return a;
          }
        );

        this.progress = 40;

        if (this.debug) {
          console.log(segmentsArray[0].textContent.split("\n"));
          console.log(segmentsArray);
        }

        let segments: Segment[] = [];
        for (let i in segmentsArray) {
          let features_str: string;
          features_str = segmentsArray[i].getAttribute("features");
          let features: string[];
          if (features_str) features = features_str.split(";");
          segments.push(
            createSegment(features, parseInt(segmentsArray[i].getAttribute("id")), "active")
          );
        }

        this.progress = 75;

        if (this.debug) {
          for (let segment of segments) {
            console.log(segment.features);
          }
        }

        let headerArray = parser.querySelector("header").children;
        let header: Header = {
          textfile: headerArray[0].textContent,
          lang: headerArray[1].textContent
        };

        let body: Body = {segments};

        let doc: Document = { header, body };

        let file: File = new File(1, doc);
        this.progress = 100;
        resolve(file);
      };
    });

    return promise;
  }
}
