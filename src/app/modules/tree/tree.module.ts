import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../../shared/components/pagenotfound/pagenotfound.component';
import { TreeUploadComponent } from './components/treeupload/treeupload.component';
import { TreeViewComponent } from './components/treeview/treeview.component';
import { TreeComponent } from 'Components/tree/tree.component';
import { TreeStoringComponent } from './components/unused_treestoring/treestoring.component';
import { XmlUploadComponent } from 'Modules/xml/components/xmlupload/xmlupload.component';
import { XMLModule } from 'Modules/xml/xml.module';
import { MatTreeModule, MatIconModule, MatIcon, MatButtonModule, MatTreeNodeToggle, MatCommonModule, MatFormFieldModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocTTCommonModule } from 'Modules/doctt_common/doctt_common.module';

const treeRoutes: Routes = [
    { path: "tree", component: TreeViewComponent },
    { path: "tree/upload", component: TreeUploadComponent }
];

@NgModule({
    declarations: [
        TreeViewComponent,
        TreeUploadComponent,
        TreeComponent,
    ],
    imports: [
        RouterModule.forRoot(treeRoutes),
        XMLModule,
        MatTreeModule,
        DocTTCommonModule
    ],
    exports: [RouterModule],
    providers: [
    ],
})
export class TreeModule {

}