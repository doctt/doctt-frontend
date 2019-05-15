import { TagComponent } from "./tag.component";
import { ElementRef } from "@angular/core";

test("setContent", () => {
  let tag : TagComponent = new TagComponent(null);
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