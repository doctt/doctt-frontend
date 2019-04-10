import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './shared/components/home/home.component';
import { TextEditComponent} from './shared/components/textedit/textedit.component';
import { TreeComponent } from './shared/components/tree/tree.component';
import { DocumentUploadComponent } from './shared/components/documentupload/documentupload.component';
import { TreeStoringComponent } from './shared/components/treestoring/treestoring.component';
import { TreeUploadComponent } from './shared/components/treeupload/treeupload.component';
import { FloatingTagChooserComponent } from './shared/components/floatintagchooser/floatingtagchooser.component';
import { DocumentComponent } from './shared/components/document/document.component';
import { PageNotFoundComponent } from './shared/components/pagenotfound/pagenotfound.component';

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "editor", component: TextEditComponent },
  { path: "documents/upload", component: DocumentUploadComponent },
  { path: "documents/:id", component: DocumentComponent },
  { path: "ftc", component: FloatingTagChooserComponent },
  { path: "tree", component: TreeComponent },
  { path: "treestoring", component: TreeStoringComponent },
  { path: "trees/upload", component: TreeUploadComponent },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }