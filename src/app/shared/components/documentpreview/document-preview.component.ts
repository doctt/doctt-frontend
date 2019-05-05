import { Component, OnInit, Input } from '@angular/core';
import { Document as DocTTDocument, Segment } from 'Models/document/document';

@Component({
    selector: 'doctt-document-preview',
    templateUrl: './document-preview.component.html',
    styleUrls: ['./document-preview.component.scss'],
})
export class DocumentPreviewComponent implements OnInit {
    @Input() 
    private doc: DocTTDocument;
    private segments : Segment[];

    @Input()
    private showButtons : boolean = true;
    
    constructor() { 
    }

    ngOnInit(): void {
        let c = 0; 
        let segments = [];
        for(let s of this.doc.body.segments){
            if(c == 5){
                break;
            }
            if(s.text.trim() != ""){
                segments.push(s);
                c++;
            }
        }

        this.segments = segments;
    }

    parseDate(date: string) : string {
        if(date == undefined){
            return "";
        }

        let d = new Date(date);
        return `${d.getFullYear()}-${('0' + d.getMonth()).substr(-2)}-${('0' + d.getDate()).substr(-2)}`;
    }

    visitDocument(){
        
    }
}
