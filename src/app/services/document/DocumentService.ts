import { Injectable } from '@angular/core';
import { Document, File } from 'Models/document/document';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private documents: Document[];
    private static LS_TAG = 'documents';

    public loadDocuments() : Document[] {
        let docs = [];

        if(localStorage.getItem(DocumentService.LS_TAG) != ""){
            docs = JSON.parse(localStorage.getItem(DocumentService.LS_TAG));
            if(docs == null){
                return [];
            }
        }

        for(let i=0; i<docs; i++){
            docs[i].header.id = i;
        }

        return docs;
    }

    public storeDocuments(docs : Document[]){
        localStorage.setItem(DocumentService.LS_TAG, JSON.stringify(docs));
    }

    public storeFile(file: File){
        if(file.version != 1){
            console.error('DocTT', 'Invalid file version, refusing to store.');
            return;
        }

        // Get document
        this.documents = this.loadDocuments();
        this.documents.push(file.data);
        this.storeDocuments(this.documents);
    }

    public removeAll(){
        localStorage.removeItem(DocumentService.LS_TAG);
    }
}