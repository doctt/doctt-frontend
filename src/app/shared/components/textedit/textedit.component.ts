import { Component, OnInit } from '@angular/core';
import { CustomTextareaComponent } from './components/customtextarea.component';

@Component({
    selector: 'text-editor',
    providers: [CustomTextareaComponent],
    templateUrl: './textedit.component.html',
    styleUrls: ['./textedit.component.scss'],

})

export class TextEditComponent {
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.

    }
}