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
  MatDialogModule,
  MatInputModule,
  MatCardModule,
  MatTableModule,
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
import { DocumentUploadComponent } from "./shared/components/documentupload/documentupload.component";
import { FloatingTagChooserComponent } from "./shared/components/floatintagchooser/floatingtagchooser.component";
import { IconColorDirective } from "./directives/iconcolor/iconcolor.directive";
import { DocumentComponent } from "./shared/components/document/document.component";
import { DocumentPreviewComponent } from "./shared/components/documentpreview/document-preview.component";
import { PageNotFoundComponent } from "./shared/components/pagenotfound/pagenotfound.component";
import { DocumentUploadTitleDialogComponent } from "./shared/components/documentupload/components/document-upload-title-dialog.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DocumentDeleteComponent } from "./shared/components/documentdelete/documentdelete.component";
import { CdkColumnDef } from "@angular/cdk/table";
import { TreeModule } from "Modules/tree/tree.module";
import { XMLModule } from "Modules/xml/xml.module";
import { DocTTCommonModule } from "Modules/doctt_common/doctt_common.module";
import { ErrorDialogComponent } from "Components/dialogs/errordialog/errordialog.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    TextEditComponent,
    CustomTextareaComponent,
    MatChipFactory,
    IconColorDirective,
    DocumentUploadComponent,
    TagComponent,
    FloatingTagChooserComponent,
    DocumentComponent,
    DocumentPreviewComponent,
    PageNotFoundComponent,
    DocumentUploadTitleDialogComponent,
    DocumentDeleteComponent,
    ErrorDialogComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatTreeModule,
    MatTableModule,
    MatChipsModule,
    PortalModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    TreeModule,
    XMLModule,
    DocTTCommonModule
  ],
  providers: [CdkColumnDef],
  bootstrap: [AppComponent],
  entryComponents: [TagComponent, DocumentUploadTitleDialogComponent,
    FloatingTagChooserComponent, ErrorDialogComponent
  ]
})
export class AppModule {}
