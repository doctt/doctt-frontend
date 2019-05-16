import { Component, OnInit } from '@angular/core';
import { Document } from 'Models/document/document';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { DocumentService } from 'Services/document/DocumentService';

@Component({
    selector: 'doctt-document-delete',
    templateUrl: './documentdelete.component.html',
    styleUrls: ['./documentdelete.component.scss']
})
export class DocumentDeleteComponent implements OnInit {

    public document: Document;
    private id: number;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private documentService: DocumentService) {
    }

    ngOnInit(): void {
        const routeSnapshot: ActivatedRouteSnapshot = this.route.snapshot;

        if (routeSnapshot.params.id !== undefined) {
            this.id = parseInt(routeSnapshot.params.id, 10);
            this.document = this.documentService.getDocument(this.id);
        }
    }

    doDelete(): void {
        console.log('Removing document...');
        this.documentService.removeDocument(this.id);
        this.router.navigateByUrl(`/`);
    }

    goBack(): void {
        this.router.navigateByUrl(`/`);
    }
}
