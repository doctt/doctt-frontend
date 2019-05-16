import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Document, File, Header } from 'Models/document/document';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { DocumentService } from 'Services/document/DocumentService';
import { ExportService } from 'Services/document/ExportService';
import { Observable } from 'rxjs';
import { CustomTextareaComponent } from '../textedit/components/customtextarea.component';
import { ColorizedTree } from 'Models/tree/ColorizedTree';
import { TreeService } from 'Services/tree/Tree';
import { TreeFile } from 'Models/tree/Tree';
import { debug } from 'util';


interface KV {
    key: string;
    val: string;
}

@Component({
    selector: 'doctt-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, AfterViewInit {
    public document: Document = null;

    private id: number;
    private tree: TreeFile;

    private displayedColumns: string[] = [
        'key', 'val'
    ];

    @ViewChild(CustomTextareaComponent) private editText: CustomTextareaComponent;

    private data: Array<KV> = [];
    private dataSource: Observable<Array<KV>> = new Observable(observer => {
        observer.next(this.data);
    });

    constructor(private route: ActivatedRoute,
                private documentService: DocumentService,
                private exportService: ExportService,
                private treeService: TreeService) {
            this.tree = treeService.getActualTree();
    }

    private getColumn(key: string): string {
        switch (key) {
            case 'textfile':
                return 'Text File';
            case 'title':
                return 'Title';
            case 'lang':
                return 'Language';
            case 'id':
                return 'ID';
        }

        return key;
    }

    export(document: Document) {
        const file: File = {
            version: 1.0,
            data : this.documentService.getDocument(document.header.id)
        };
        console.log('exporting this -> ', file.data);
        this.exportService.export(file);
    }

    ngOnInit(): void {
        const routeSnapshot: ActivatedRouteSnapshot = this.route.snapshot;

        if (routeSnapshot.params.id !== undefined) {
            this.loadDocumentById(parseInt(routeSnapshot.params.id, 10));
        } else {
            this.route.params.subscribe(params => {
                if (params.id !== undefined) {
                    this.loadDocumentById(parseInt(params.id, 10));
                }
            });
        }
    }

    loadDocumentById(id: number) {
        this.id = id;
        this.document = this.documentService.getDocument(this.id);

        for (const k of Object.keys(this.document.header)) {
            this.data.push({
                key: k,
                val: this.document.header[k]
            });
        }
    }

    ngAfterViewInit(): void {
        // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        // Add 'implements AfterViewInit' to the class.
        this.editText.load(this.document, this.tree);
    }
}
