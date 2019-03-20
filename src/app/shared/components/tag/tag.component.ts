import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "doctt-tag",
  templateUrl: "./tag.component.html",
  styleUrls: ["./tag.component.scss"]
})
export class TagComponent implements OnInit {
  private element: HTMLElement;
  @ViewChild("tag") tag : ElementRef | undefined;
  @ViewChild("tagInner") content: ElementRef | undefined;

  private colors: Array<string> = ["1E88E5", "8E24AA", "D81B60"];

  constructor() {
    
  }

  randomColor(): string {
    return this.colors[
      Math.ceil(Math.random() * this.colors.length) % this.colors.length
    ];
  }

  ngOnInit(): void {
    this.tag.nativeElement.style.backgroundColor = "#" + this.randomColor();
  }

  setContent(element: Node) {
    if (this.content != undefined) {
      let nativeElement: HTMLElement = this.content.nativeElement;
      nativeElement.appendChild(element);
    }
  }
}
