import { Component } from "@angular/core";
import { HtmlParser } from "@angular/compiler";
import { parse } from "url";

@Component({
  selector: "xmlexport",
  templateUrl: "./xmlexport.component.html",
  styleUrls: ["./xmlexport.component.scss"]
})
export class XmlExportComponent {
  text : string;
 ngOnInit(){
  this.text = document.querySelector(".txt").innerHTML;
 }

 export(){
   console.log(this.text);
 }

 updateText(){
  this.text = document.querySelector(".txt").innerHTML;
 }
}
