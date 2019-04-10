import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DocumentUploadDialogData } from 'Models/dialogs/document-upload/DocumentUploadDialogData';

@Component({
    selector: 'doctt-document-upload-title-dialog',
    templateUrl: './document-upload-title-dialog.component.html',
    styleUrls: ['./document-upload-title-dialog.component.scss']
})
export class DocumentUploadTitleDialogComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<DocumentUploadTitleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DocumentUploadDialogData) { }

    ngOnInit(): void { }
}
