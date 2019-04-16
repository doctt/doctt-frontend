import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmlUploadComponent } from 'Modules/xml/components/xmlupload/xmlupload.component';
import { XmlExportComponent } from 'Modules/xml/components/xmlexport/xmlexport.component';
import { MatProgressBarModule, MatIconModule, MatFormFieldModule, MatTreeModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialFileInputModule, FileInputComponent } from 'ngx-material-file-input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocTTCommonModule } from 'Modules/doctt_common/doctt_common.module';

@NgModule({
    declarations: [
        XmlUploadComponent,
        XmlExportComponent,
    ],
    imports: [ 
        CommonModule,
        MatProgressBarModule,
        MaterialFileInputModule,
        DocTTCommonModule
    ],
    exports: [ 
        XmlUploadComponent,
        XmlExportComponent
    ],
    providers: [],
})
export class XMLModule {}