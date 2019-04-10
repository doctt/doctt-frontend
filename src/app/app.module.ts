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
  MatTreeModule,
  MatDialog,
  MatDialogModule,
  MatInputModule,
  MatCardModule
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
import { TagComponent } from "./shared/components/tag/tag.component";
import { XmlUploadComponent } from "./shared/components/xmlupload/xmlupload.component";
import { TreeComponent } from "./shared/components/tree/tree.component";
import { DocumentUploadComponent } from "./shared/components/documentupload/documentupload.component";
import { TreeStoringComponent } from "./shared/components/treestoring/treestoring.component";
import { TreeUploadComponent } from "./shared/components/treeupload/treeupload.component";
import { FloatingTagChooserComponent } from "./shared/components/floatintagchooser/floatingtagchooser.component";
import { IconColorDirective } from "./directives/iconcolor/iconcolor.directive";
import { DocumentComponent } from "./shared/components/document/document.component";
import { DocumentPreviewComponent } from "./shared/components/documentpreview/document-preview.component";
import { PageNotFoundComponent } from "./shared/components/pagenotfound/pagenotfound.component";
import { DocumentUploadTitleDialogComponent } from "./shared/components/documentupload/components/document-upload-title-dialog.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    TextEditComponent,
    CustomTextareaComponent,
    MatChipFactory,
    IconColorDirective,
    TagComponent,
    XmlUploadComponent,
    TreeComponent,
    DocumentUploadComponent,
    TreeStoringComponent,
    TreeUploadComponent,
    FloatingTagChooserComponent,
    DocumentComponent,
    DocumentPreviewComponent,
    PageNotFoundComponent,
    DocumentUploadTitleDialogComponent
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
    PortalModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [TagComponent, DocumentUploadTitleDialogComponent]
})
export class AppModule {}
