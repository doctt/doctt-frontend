import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HSLColor } from "Models/hslcolor/HSLColor";
import { ColorizedNode } from "Models/tree/ColorizedTree";

@Component({
  selector: "doctt-tag",
  templateUrl: "./tag.component.html",
  styleUrls: ["./tag.component.scss"]
})
export class TagComponent implements OnInit {
  private element: Node;
  private tagNode: ColorizedNode;

  @ViewChild("tag") tag: ElementRef | undefined;
  @ViewChild("tagInner") content: ElementRef | undefined;

  constructor() {}

  ngOnInit(): void {}

  onClick(event: MouseEvent){
    event.preventDefault();
  }

  onMouseOver(event: MouseEvent){
    console.log("Mouse over tag", event);
  }

  setContent(element: Node) {
    if (this.content != undefined) {
      let nativeElement: HTMLElement = this.content.nativeElement;
      nativeElement.appendChild(element);
      this.element = element;
    }
  }

  private setColor(color: HSLColor){
    this.tag.nativeElement.style.backgroundColor = color.toCSS();
  }

  setTag(tag: ColorizedNode) {
    this.setColor(tag.color);
    this.tagNode = tag;  
  }

  
}
