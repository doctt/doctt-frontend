import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: "doctt-tag",
  templateUrl: "./tag.component.html",
  styleUrls: ["./tag.component.scss"]
})
export class TagComponent implements OnInit {
  private element: HTMLElement;
  @ViewChild("content") content: ElementRef;

  constructor() {
    console.log("Creating component");
  }

  ngOnInit(): void {}

  setContent(element: HTMLElement) {
      let nativeElement : HTMLElement = this.content.nativeElement;
      nativeElement.appendChild(element);
  }
}
