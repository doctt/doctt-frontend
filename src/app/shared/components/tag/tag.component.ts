import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HSLColor } from "Models/hslcolor/HSLColor";
import { ColorizedNode } from "Models/tree/ColorizedTree";
import { findNode } from "@angular/compiler";

@Component({
  selector: "doctt-tag",
  templateUrl: "./tag.component.html",
  styleUrls: ["./tag.component.scss"]
})
export class TagComponent implements OnInit {
  private element: Node;
  private tagNode: ColorizedNode;

  private og_el : Node = null;
  @ViewChild("tag") tag: ElementRef | undefined;
  @ViewChild("tagInner") content: ElementRef | undefined;

  constructor() {}

  ngOnInit(): void {}

  onClick(event: MouseEvent){
    event.preventDefault();
    console.log("event target ",event.target);
    let multiline : boolean = false;
    let path : any = event.composedPath();
    let path_els : Element[] = path;
    let tagInner : Element = null;
    let spanContainer : Element = null;
    let doctttag : Element = null;
    let p = document.createElement("p");
    p.innerText = "";
    let span = document.createElement("span");
    span.innerHTML = "";
    let finalspan = document.createElement("span");
    finalspan.innerHTML = "";
    for(let el  of path_els){
      if(el.className == "tag-inner" && tagInner == null){
        tagInner = el;
        console.log(el);
        console.log("tagname ", el.tagName);
        if(el.children.length == 1){
          console.log("single line");
        }else{
          multiline = true;
          console.log("multi line");
        }
      }
      if(el.className == "span-container" && spanContainer == null){
        spanContainer = el;
      } 
      if(el.tagName =="DOCTT-TAG" && doctttag == null){
        doctttag = el;
      } 
    }

    /*
    if(!multiline){
      console.log("span con sibilings ", spanContainer.parentElement.children[0].tagName);
      for(let k = 0; k < spanContainer.parentElement.children.length; k++){
        if(spanContainer.parentElement.children[k].tagName == "SPAN"){
          p.innerText += spanContainer.parentElement.children[k].innerHTML;
          console.log("sibiling of span con -> ", spanContainer.parentElement.children[k].innerHTML);
        }else{
          let spanContChildren = spanContainer.children;
          for (let i = 0; i < spanContChildren.length; i++){
            let child = spanContChildren[i];
            if(child.tagName == "SPAN"){
              p.innerText += child.innerHTML;
              console.log("span -> ", child.innerHTML);
            }else{
              for(let j = 0; j < tagInner.children.length; j++){
                p.innerText += tagInner.children[j].innerHTML;
                console.log("not span ->", child.innerHTML);
              }
            }
          }
        }
      }
    }else{   
      console.log("span con sibilings ", spanContainer.parentElement.children[0].tagName);
      for(let k = 0; k < spanContainer.parentElement.children.length; k++){
        if(spanContainer.parentElement.children[k].tagName == "SPAN"){
          p.innerText += spanContainer.parentElement.children[k].innerHTML;
          console.log("sibiling of span con -> ", spanContainer.parentElement.children[k].innerHTML);
        }else{
          let spanContChildren = spanContainer.children;
          for (let i = 0; i < spanContChildren.length; i++){
            let child = spanContChildren[i];
            if(child.tagName == "SPAN"){
              p.innerText += child.innerHTML;
              console.log("span -> ", child.innerHTML);
            }else{
              for(let j = 0; j < tagInner.children.length; j++){
                p.innerText += tagInner.children[j].innerHTML;
                console.log("not span ->", child.innerHTML);
              }
            }
          }
        }
      }
    }
    */
   let target : Element = path_els[0]; 
   if(target.className == "tag")
    tagInner = target.children[0];

    let father;
    father = spanContainer.parentElement;
    let spanContLength = spanContainer.children.length;
    console.log("span cont children");
    for(let k = 0; k < spanContainer.children.length; k++){
      let child = spanContainer.children[k];
      console.log(child);
    }

    console.log("dio ", spanContainer.children);

    for(let k = 0; k < spanContLength; k++){
      let child = spanContainer.children[0];
      console.log("span cont child ", child);

      if(child.tagName == "SPAN"){
        father.append(child);
        console.log("append normal span");
      }else{
        console.log("tagInner cicle");
        let tagInnerLength = tagInner.children.length;
        for(let i = 0; i < tagInnerLength; i++){
          let a = tagInner.children[0];
          console.log("tagInner child ", a);
          father.append(a);
          console.log("append tag inner child");
        }
        spanContainer.removeChild(child);
      }
    }
    
    
    
    father.removeChild(spanContainer);

    console.log("path ",path);
    console.log("taginner ",tagInner);
    console.log("spancontainer ",spanContainer);
    console.log("full text ", finalspan.innerHTML);

    //if(path[1])
  }

  onMouseOver(event: MouseEvent){
    //console.log("Mouse over tag", event);
  }

  setContent(element: Node) {
    if(this.og_el == null)
        this.og_el = element;
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

  
  getContent() : Node{
    return this.og_el;
  }
}
