import { Component, OnInit, AfterContentInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { DocumentPreviewComponent } from '../documentpreview/document-preview.component';
import { DocumentService } from 'Services/document/DocumentService';
import { Document } from 'Models/document/document';

@Component({
    selector: 'home-page',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [
        DocumentPreviewComponent
    ],
    changeDetection: ChangeDetectionStrategy.Default
})

export class HomeComponent  implements OnInit, AfterContentInit {
    private documents : Document[] = [];

    constructor(private documentService: DocumentService){
    }

    ngAfterContentInit(): void {
        this.documents = this.documentService.loadDocuments();
    }

    ngOnInit(): void {
        
    }
}