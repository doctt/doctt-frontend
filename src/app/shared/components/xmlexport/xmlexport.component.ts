import { Component } from "@angular/core";

@Component({
  selector: "xmlexport",
  templateUrl: "./xmlexport.component.html",
  styleUrls: ["./xmlexport.component.scss"]
})
export class XmlExportComponent {
  text : string;
  FileSaver = require('file-saver');
 ngOnInit(){
  this.text = document.querySelector(".txt").innerHTML;
 }

 export(){
   console.log(this.text);
   var blob = new Blob([this.text], {type: "text/plain;charset=utf-8"});
   this.FileSaver.saveAs(blob, "filename.txt");
   
 }

 updateText(){
  this.text = document.querySelector(".txt").innerHTML;
 }
}
