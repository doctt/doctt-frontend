import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './shared/components/home/home.component';
import { TextEditComponent} from './shared/components/textedit/textedit.component';
import { TreeComponent } from './shared/components/tree/tree.component';
import { DocumentUploadComponent } from './shared/components/documentupload/documentupload.component';
import { TreeUploadComponent } from './modules/tree/components/treeupload/treeupload.component';
import { DocumentComponent } from './shared/components/document/document.component';
import { PageNotFoundComponent } from './shared/components/pagenotfound/pagenotfound.component';
import { DocumentDeleteComponent } from './shared/components/documentdelete/documentdelete.component';
import { TreeModule } from 'Modules/tree/tree.module';
import { FloatingTagChooserComponent } from 'Components/floatintagchooser/floatingtagchooser.component';

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "editor", component: TextEditComponent },
  { path: "documents/upload", component: DocumentUploadComponent },
  { path: "documents/view/:id", component: DocumentComponent },
  { path: "documents/delete/:id", component: DocumentDeleteComponent },
  { path: "dev/ftc", component: FloatingTagChooserComponent },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
        TreeModule
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }