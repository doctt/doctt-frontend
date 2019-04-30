import { Injectable } from '@angular/core';

import {
  Segment,
  Body,
  File,
  Header,
  Document as DocTTDocument
} from "Models/document/document";
import { getInjectorIndex } from '@angular/core/src/render3/di';

@Injectable({
  providedIn: "root"
})
export class DocumentParserService {
  private debug: boolean = false;

  createSegment(features: string[], id: number, state: string, content: Node[], children: Segment[]): Segment {
    let newSegment: Segment = {
      features: [""], id: -1, state: "active", text: "",
      children: []
    };
    if (features !== null) {
      newSegment.features = features;
    }
    if (id !== null) {
      newSegment.id = id;
    }
    if (state !== null) {
      newSegment.state = state;
    }

    let df : HTMLElement = document.createElement("div");
    for(let n of content){
      df.appendChild(n);
    }

    if (content !== null) {
      newSegment.text = df.innerHTML;
    }

    if(children != null){
      newSegment.children = children;
    }

    return newSegment;
  }

  private createSegmentFromNode(node : HTMLElement) : Segment {
    let my_children: Segment[] = [];
    let content : Node[] = [];

    node.childNodes.forEach((c, k, p) => {
      if (c.nodeType == Node.ELEMENT_NODE) {
        if (c.nodeName.toUpperCase() == 'SEGMENT') {
          my_children.push(this.createSegmentFromNode(<HTMLElement> c));
        } else {
          content.push(c);
        }
      } else {
        content.push(c);
      }
    });

    let features = (node.getAttribute("features") !== null ? node.getAttribute("features").split(";") : []);
    features.map((v, i, out) => {
    out[i] = v.trim();
    });
    
    return this.createSegment(
      features,
      parseInt(node.getAttribute("id")),
      "active",
      content,
      my_children
    );
  }

  private findMax(segments: Segment[]) : number {
    let max = -1;
    for(let s of segments){
      if(s.id > max){
        max = s.id;
      }
    
      let m = this.findMax(s.children);
      if(m > max){
        max = m;
      }
    }

    return max;
  }

  private genId(segments: Segment[], currentId: number) : number {
    let newId = currentId;

    for(let s of segments){
      if(isNaN(s.id)){
        newId++;
        s.id = newId;
      }

      newId = this.genId(s.children, newId);
    }

    return newId;
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
        return a;
      }
    );

    let i = segmentsArray.length;
    let segments: Segment[] = [];

    for (let segment of segmentsArray) {
      segments.push(this.createSegmentFromNode(segment));
    }

    let maxId = this.findMax(segments);
    maxId = this.genId(segments, maxId);

    let headerArray = doc.querySelector("header").children;
    let header: Header = {
      textfile: headerArray[0].textContent,
      title: "",
      lang: headerArray[1].textContent,
      id: -1,
      created_on: new Date(),
    };

    let body: Body = { segments };
    let output_doc: DocTTDocument = { header, body };
    let file: File = new File(1, output_doc);

    return file;
  }
}
