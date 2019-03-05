import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule, 
    MatMenuModule,
    MatCheckboxModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './shared/components/home/home.component';
import { TextEditComponent} from './shared/components/textedit/textedit.component';
@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        TextEditComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        //BrowserModule,
        AppRoutingModule,
        MatButtonModule, 
        MatMenuModule,
        MatCheckboxModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule { }