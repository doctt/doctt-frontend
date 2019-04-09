import { TagComponent } from "./tag.component";
import { ElementRef } from "@angular/core";


test("setContent", () => {
  let tag : TagComponent = new TagComponent();
  let content = document.createElement("p");
  tag.content = new ElementRef(document.createElement("div"));
  content.innerHTML = "test node";
  tag.setContent(content);
  let natEl : HTMLElement = tag.content.nativeElement;
  expect(natEl.children[0]).toBe(content);
  content.innerHTML = "test 2";
  expect(natEl.children[0]).toBe(content);
  expect(natEl.children[0].innerHTML).toBe(content.innerHTML);
});

test("setType", () => {
  let tag : TagComponent = new TagComponent();
  let inner = document.createElement("p");
  tag.tag = new ElementRef(document.createElement("div"));
  let natEl : HTMLElement = tag.tag.nativeElement;
  tag.setType(1);
  expect(natEl.style.backgroundColor).toBe("rgb(216, 27, 96)");  // #D81B60 Hex -> 216, 27, 96 RGB
  tag.setType(2);
  expect(natEl.style.backgroundColor).toBe("rgb(251, 140, 0)"); // #FB8C00 Hex -> 251, 140, 0 RGB
});