import { Component, OnInit } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
    selector: 'custom-textarea',
    templateUrl: './customtextarea.component.html',
    styleUrls: ['./customtextarea.component.scss'],
})

export class CustomTextareaComponent extends QuillEditorComponent implements OnInit {
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    }

    doTest(): void {
        console.log("Hello world");
    }
}