import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule, MatFormFieldModule, MatIconModule, MatCardModule, MatTooltipModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [],
    imports: [ CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatButtonModule,
        FormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatCardModule,
        MatTooltipModule
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatButtonModule,
        FormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatCardModule,
        MatTooltipModule
    ],
    providers: [],
})
export class DocTTCommonModule {}