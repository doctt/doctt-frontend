import { Injectable } from '@angular/core';
import { Document, File } from 'Models/document/document';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private documents: Document[];
    private static LS_TAG = 'documents';
    private last_id : number  = -1;

    public loadDocuments() : Document[] {
        let docs = [];

        if(localStorage.getItem(DocumentService.LS_TAG) != ""){
            docs = JSON.parse(localStorage.getItem(DocumentService.LS_TAG));
            if(docs == null){
                return [];
            }
        }

        for(let i=0; i<docs.length; i++){
            docs[i].header.id = i;
        }

        this.last_id = docs.length;
        this.documents = docs;

        return docs;
    }

    public storeDocuments(docs : Document[]){
        localStorage.setItem(DocumentService.LS_TAG, JSON.stringify(docs));
    }

    public getDocument(id: number): Document {
        if(this.documents == null){
            this.loadDocuments();
        }

        for(let doc of this.documents){
            if(doc.header.id == id){
                return doc;
            } 
        }

        return null;
    }

    /*
        Stores the given file, returns its id
    */
    public storeFile(file: File) : Number {
        if(file.version != 1){
            console.error('DocTT', 'Invalid file version, refusing to store.');
            return;
        }

        // Get document
        this.documents = this.loadDocuments();
        file.data.header.id = this.last_id;
        this.last_id++;

        this.documents.push(file.data);
        this.storeDocuments(this.documents);
    }

    public removeAll(){
        localStorage.removeItem(DocumentService.LS_TAG);
    }
}