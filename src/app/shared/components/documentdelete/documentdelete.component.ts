import { Component, OnInit } from '@angular/core';
import { Document } from 'Models/document/document';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from 'Services/document/DocumentService';

@Component({
    selector: 'doctt-document-delete',
    templateUrl: './documentdelete.component.html',
    styleUrls: ['./documentdelete.component.scss']
})
export class DocumentDeleteComponent implements OnInit {

    private document : Document;
    private id: number;


    constructor(private route: ActivatedRoute,
        private router: Router,
        private documentService: DocumentService) {
    }

    ngOnInit(): void { 
        this.route.params.subscribe(params => {
            this.id = params.id;
            this.document = this.documentService.getDocument(this.id);
        });
    }

    doDelete(): void {
        console.log("Removing document...");
        this.documentService.removeDocument(this.id);
        this.router.navigateByUrl(`/`);
    }

    goBack(): void {
        this.router.navigateByUrl(`/`);
    }
}
