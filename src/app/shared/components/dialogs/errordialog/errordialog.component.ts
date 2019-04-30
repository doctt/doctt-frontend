import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorDialogData } from 'Models/dialogs/ErrorDialogData';

@Component({
    selector: 'doctt-errordialog',
    templateUrl: './errordialog.component.html',
    styleUrls: ['./errordialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<ErrorDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData ) { }

    ngOnInit(): void { }

    onOkClick() : void {
        this.dialogRef.close();
    }
}
