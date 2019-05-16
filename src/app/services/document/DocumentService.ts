import { Injectable } from '@angular/core';
import { Document, File } from 'Models/document/document';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private static LS_TAG = 'documents';
    private documents: Document[];
    private lastId  = -1;

    public loadDocuments(): Document[] {
        let docs = [];

        if (localStorage.getItem(DocumentService.LS_TAG) !== '') {
            docs = JSON.parse(localStorage.getItem(DocumentService.LS_TAG));
            if (docs == null) {
                return [];
            }
        }

        for (let i = 0; i < docs.length; i++) {
            docs[i].header.id = i;
        }

        this.lastId = docs.length;
        this.documents = docs;

        return docs;
    }

    public storeDocuments(docs: Document[]) {
        localStorage.setItem(DocumentService.LS_TAG, JSON.stringify(docs));
    }

    public getDocument(id: number): Document {
        if (this.documents === undefined) {
            this.loadDocuments();
        }

        for (const doc of this.documents) {
            if (doc.header.id === id) {
                return doc;
            }
        }

        return null;
    }

    /*
        Stores the given file, returns its id
    */
    public storeFile(file: File): number {
        if (file.version !== 1) {
            console.error('DocTT', 'Invalid file version, refusing to store.');
            return;
        }

        // Get document
        this.documents = this.loadDocuments();
        file.data.header.id = this.lastId;
        this.lastId++;

        this.documents.push(file.data);
        this.storeDocuments(this.documents);
        return file.data.header.id;
    }

    public removeAll() {
        localStorage.removeItem(DocumentService.LS_TAG);
    }

    public removeDocument(id: number) {
        this.documents = this.loadDocuments();
        let idx = -1;
        for (const d of this.documents) {
            if (d.header.id === id) {
                idx = this.documents.indexOf(d);
            }
        }

        if (idx !== -1) {
            this.documents.splice(idx, 1);
        }

        this.storeDocuments(this.documents);
    }
}
