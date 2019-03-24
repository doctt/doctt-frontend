import { Injectable } from '@angular/core';

import {
  Segment,
  Body,
  File,
  Header,
  Document as DocTTDocument
} from "Models/document/document";

@Injectable({
  providedIn: "root"
})
export class DocumentParserService {
  private debug: boolean = false;

  createSegment(features: string[], id: number, state: string, text: string): Segment {
    let newSegment: Segment = { features: [""], id: -1, state: "active", text: "" };
    if (features !== null) {
      newSegment.features = features;
    }
    if (id !== null) {
      newSegment.id = id;
    }
    if (state !== null) {
      newSegment.state = state;
    }

    if(text !== null){
        newSegment.text = text;
    }

    return newSegment;
  }

  parseXML(doc: Document): File {
    let segmentsArray: Array<HTMLElement> = Array.prototype.map.call(
      doc.querySelector("body").childNodes,
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

    let segments: Segment[] = [];
    for (let segment of segmentsArray) {
      let features = (segment.getAttribute("features") !== null ? segment.getAttribute("features").split("; ") : []);
      segments.push(
        this.createSegment(
          features,
          parseInt(segment.getAttribute("id")),
          "active",
          segment.innerHTML
        )
      );
    }

    let headerArray = doc.querySelector("header").children;
    let header: Header = {
      textfile: headerArray[0].textContent,
      lang: headerArray[1].textContent
    };

    let body: Body = { segments };

    let output_doc: DocTTDocument = { header, body };

    let file: File = new File(1, output_doc);

    console.log(file);

    return file;
  }
}