import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HSLColor } from "Models/hslcolor/HSLColor";
import { ColorizedNode } from "Models/tree/ColorizedTree";
import { findNode } from "@angular/compiler";
import { CustomTextareaComponent } from "Components/textedit/components/customtextarea.component";
import { Document, Segment } from "Models/document/document";
import { DocumentService } from "Services/document/DocumentService";

@Component({
  selector: "doctt-tag",
  templateUrl: "./tag.component.html",
  styleUrls: ["./tag.component.scss"]
})
export class TagComponent implements OnInit {
  private element: Node;
  private tagNode: ColorizedNode;
  private tooltip: string;
  private document : Document;

  private og_el: Node = null;
  @ViewChild("tag") tag: ElementRef | undefined;
  @ViewChild("tagInner") content: ElementRef | undefined;

  constructor(private documentService : DocumentService) { }

  ngOnInit(): void { }

  onClick(event: MouseEvent) {
    event.preventDefault();
    let path: any = event.composedPath();
    let path_els: Element[] = path;
    let tagInner: Element = null;
    let spanContainer: Element = null;
    let doctttag: Element = null;
    let p = document.createElement("p");
    p.innerText = "";
    let span = document.createElement("span");
    span.innerHTML = "";
    let finalspan = document.createElement("span");
    finalspan.innerHTML = "";
    for (let el of path_els) {
      if (el.className == "tag-inner" && tagInner == null) {
        tagInner = el;
      } 
      if (el.className == "segment-container" && spanContainer == null) {
        spanContainer = el;
      }
      if (el.tagName == "DOCTT-TAG" && doctttag == null) {
        doctttag = el;
      }
    }

    let target: Element = path_els[0];
    if (target.className == "tag")
      tagInner = target.children[0];

    let father = spanContainer.parentElement;

    let docFragment = document.createDocumentFragment();
    let appendToDocFragment : ChildNode[] = [];

    spanContainer.childNodes.forEach((e, k, p) => {
      let child: any = e;
      let tmp: Element = child;

      if (tmp.tagName == "SPAN") {
        appendToDocFragment.push(tmp);
      } else {
        tagInner.childNodes.forEach((e, k, p) => {
          appendToDocFragment.push(e);
        });
      }
    });

    for(let el of appendToDocFragment){
      docFragment.append(el);
    }

    let id = Number.parseInt(spanContainer.getAttribute("data-segment-id"));
    //CustomTextareaComponent.removeFeaturesBySegmentId(this.document, id);
    CustomTextareaComponent.removeFeaturesFromSegmentID(id, this.documentService, this.document);

    if(father != null){
      father.insertBefore(docFragment, spanContainer);
      father.removeChild(spanContainer);
    }
  }

  onMouseOver(event: MouseEvent) {
    //console.log("Mouse over tag", event);
  }

  setContent(element: Node) {
    if (this.og_el == null)
      this.og_el = element;
    if (this.content != undefined) {
      let nativeElement: HTMLElement = this.content.nativeElement;
      nativeElement.appendChild(element);
      this.element = element;
    }
  }

  private setColor(color: HSLColor) {
    this.tag.nativeElement.style.backgroundColor = color.toCSS();
  }

  setDocument(document : Document){
    this.document = document;
  }

  setTag(tag: ColorizedNode) {
    this.setColor(tag.color);
    this.tagNode = tag;
    this.tooltip = tag.name;
  }


  getContent(): Node {
    return this.og_el;
  }
}
