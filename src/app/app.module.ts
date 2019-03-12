import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {
  MatButtonModule,
  MatMenuModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatChipsModule
} from "@angular/material";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./shared/components/home/home.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { TextEditComponent } from "./shared/components/textedit/textedit.component";
import "../styles/theme.scss";

import { AppRoutingModule } from "./app-routing.module";
import { CustomTextareaComponent } from "./shared/components/textedit/components/customtextarea.component";
import { PortalModule } from "@angular/cdk/portal";
import { MatChipFactory } from "./shared/components/matchipfactory/matchipfactory.component";
import { SentenceDirective } from "./directives/sentence/sentence.directive";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    TextEditComponent,
    CustomTextareaComponent,
    MatChipFactory,
    SentenceDirective,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatIconModule,
    MatSidenavModule,
    MatChipsModule,
    PortalModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    MatChipFactory
  ]
})
export class AppModule {}
