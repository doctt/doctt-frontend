import { Component, OnInit, Input } from '@angular/core';
import { Document as DocTTDocument } from 'Models/document/document';

@Component({
    selector: 'doctt-document-preview',
    templateUrl: './document-preview.component.html',
    styleUrls: ['./document-preview.component.scss'],
})
export class DocumentPreviewComponent implements OnInit {
    @Input() 
    private document: DocTTDocument;
    
    constructor() { 
    }

    ngOnInit(): void { 
        console.log(this.document);
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
