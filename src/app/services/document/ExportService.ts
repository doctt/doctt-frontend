import { Injectable } from '@angular/core';
import { Document, File, Header, Body, Segment } from 'Models/document/document';

@Injectable({
    providedIn: 'root'
})

export class ExportService {
    private FileSaver = require('file-saver');

    export( fileToExport : File){
        let docToExport = this.parseToXML(fileToExport.data);
        let xmlSerializer = new XMLSerializer();
        
        console.log(xmlSerializer.serializeToString(docToExport));
        var blob = new Blob([xmlSerializer.serializeToString(docToExport)], {type: "text/xml;charset=utf-8"});
        this.FileSaver.saveAs(blob, fileToExport.data.header.title+".xml");
    }

    private parseToXML(doc : Document) : any {
        let docToExport = document.implementation.createDocument("", "", null);
        let header : Header = doc.header;
        let actualDoc = docToExport.createElement("document");

        let actualHeader = docToExport.createElement("header");
        const headerKeys = Object.keys(header);
        headerKeys.forEach((v, i, a) => {
            let headChild = docToExport.createElement(v);
            headChild.append(header[v]);
            actualHeader.appendChild(headChild);
        });

        let segments : Segment[]  = doc.body.segments;
        let actualBody = docToExport.createElement("body");
        segments.forEach((v, i, a) => {
            if(v.features == null)
                actualBody.append(v.text);
            else{
                actualBody.appendChild(this.recursiveSegmentIterator(v));
            }
            
        });
        actualDoc.appendChild(actualHeader);
        actualDoc.appendChild(actualBody);
        actualDoc.removeAttributeNS("http://www.w3.org/1999/xhtml", "xmlns")
        //this.namespaceRemoval(actualDoc);
        return actualDoc;
    }

    private namespaceRemoval(doc : any) : HTMLElement {
        doc.removeAttributeNS("xmlns");
        let children = doc.children;
        for(let i = 0; i < children.length; i++){
            let child : HTMLElement = children[i];
            this.namespaceRemoval(child);
        }
        return doc;
    }

    private recursiveSegmentIterator(segment : Segment) : Node{
        let segNode = document.createElement("segment");
        let feats = "";
        if(segment.features != null)
        segment.features.forEach((v, i, a) => {
            if(feats != "")
                feats += ";";
            feats += v;
        });

        segNode.setAttribute("features", feats);
        segNode.setAttribute("id", ""+segment.id);
        segNode.setAttribute("state", segment.state);
        segNode.append(segment.text);

        let children = segment.children;
        if(children != null){
            children.forEach((v, i, a) => {
                segNode.appendChild(this.recursiveSegmentIterator(v));
            });
        }
        return segNode;
    }
}