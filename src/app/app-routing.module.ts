import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './shared/components/home/home.component';
import { TextEditComponent} from './shared/components/textedit/textedit.component';
import { XmlUploadComponent} from './shared/components/xmlupload/xmlupload.component';
import { TreeComponent } from './shared/components/tree/tree.component';
import { DocumentUploadComponent } from './shared/components/documentupload/documentupload.component';

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "menu", loadChildren: "./modules/menu/menu.module#MenuModule" },
  { path: "editor", component: TextEditComponent },
  { path: "documents/upload", component: DocumentUploadComponent },
  { path: "tree", component: TreeComponent }
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