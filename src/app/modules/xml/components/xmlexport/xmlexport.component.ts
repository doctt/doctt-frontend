import { Component } from '@angular/core';

@Component({
  selector: 'xmlexport',
  templateUrl: './xmlexport.component.html',
  styleUrls: ['./xmlexport.component.scss']
})
export class XmlExportComponent {
  text: string;
  FileSaver = require('file-saver');
// tslint:disable-next-line: use-life-cycle-interface
 ngOnInit() {
  this.text = document.querySelector('.txt').innerHTML;
 }

 export() {
   console.log(this.text);
   const blob = new Blob([this.text], {type: 'text/xml;charset=utf-8'});
   this.FileSaver.saveAs(blob, 'filename.xml');

 }

 updateText() {
  this.text = document.querySelector('.txt').innerHTML;
 }
}
