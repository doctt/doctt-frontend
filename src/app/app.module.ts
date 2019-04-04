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
  MatChipsModule,
  MatProgressBarModule,
  MatTreeModule
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
import { TagComponent } from "./shared/components/tag/tag.component";
import { XmlUploadComponent } from "./shared/components/xmlupload/xmlupload.component";
import { TreeComponent } from "./shared/components/tree/tree.component";
import { DocumentUploadComponent } from "./shared/components/documentupload/documentupload.component";
import { TreeStoringComponent } from "./shared/components/treestoring/treestoring.component";
import { TreeUploadComponent } from "./shared/components/treeupload/treeupload.component";
import { FloatingTagChooserComponent } from "./shared/components/floatintagchooser/floatingtagchooser.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    TextEditComponent,
    CustomTextareaComponent,
    MatChipFactory,
    SentenceDirective,
    TagComponent,
    XmlUploadComponent,
    TreeComponent,
    DocumentUploadComponent,
    TreeStoringComponent,
    TreeUploadComponent,
    FloatingTagChooserComponent,
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
    MatProgressBarModule,
    MatSidenavModule,
    MatTreeModule,
    MatChipsModule,
    PortalModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [TagComponent]
})
export class AppModule {}
