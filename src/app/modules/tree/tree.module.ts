import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeUploadComponent } from './components/treeupload/treeupload.component';
import { TreeViewComponent } from './components/treeview/treeview.component';
import { XMLModule } from 'Modules/xml/xml.module';
import { MatTreeModule } from '@angular/material';
import { DocTTCommonModule } from 'Modules/doctt_common/doctt_common.module';
import { TreeComponent } from 'Components/tree/tree.component';

const treeRoutes: Routes = [
    { path: 'tree', component: TreeViewComponent },
    { path: 'tree/upload', component: TreeUploadComponent }
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
