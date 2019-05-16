import { Injectable } from '@angular/core';
import { Document, File, Header, Body, Segment } from 'Models/document/document';

@Injectable({
    providedIn: 'root'
})

export class ExportService {
    private FileSaver = require('file-saver');

    export( fileToExport: File) {
        const docToExport = this.parseToXML(fileToExport.data);
        const xmlSerializer = new XMLSerializer();

        console.log(xmlSerializer.serializeToString(docToExport));
        let blob = new Blob([xmlSerializer.serializeToString(docToExport)], {type: 'text/xml;charset=utf-8'});
        this.FileSaver.saveAs(blob, fileToExport.data.header.title +'.xml');
    }

    private parseToXML(doc: Document): any {
        const docToExport = document.implementation.createDocument('', '', null);
        const header: Header = doc.header;
        const actualDoc = docToExport.createElement('document');

        const actualHeader = docToExport.createElement('header');
        const headerKeys = Object.keys(header);
        headerKeys.forEach((v, i, a) => {
            const headChild = docToExport.createElement(v);
            headChild.append(header[v]);
            actualHeader.appendChild(headChild);
        });

        const segments: Segment[]  = doc.body.segments;
        const actualBody = docToExport.createElement('body');
        segments.forEach((v, i, a) => {
            if (v.features == null) {
                actualBody.append(v.text);
            }
            else {
                actualBody.appendChild(this.recursiveSegmentIterator(v));
            }

        });
        actualDoc.appendChild(actualHeader);
        actualDoc.appendChild(actualBody);
        actualDoc.removeAttributeNS('http://www.w3.org/1999/xhtml', 'xmlns');
        // this.namespaceRemoval(actualDoc);
        return actualDoc;
    }

    private namespaceRemoval(doc: any): HTMLElement {
        doc.removeAttributeNS('xmlns');
        const children = doc.children;
        for (let i = 0; i < children.length; i++) {
            const child: HTMLElement = children[i];
            this.namespaceRemoval(child);
        }
        return doc;
    }

    private recursiveSegmentIterator(segment: Segment): Node {
        const segNode = document.createElement('segment');
        let feats = '';
        if (segment.features != null) {
        segment.features.forEach((v, i, a) => {
            if(feats != "")
                feats += ";";
            feats += v;
        });
        }

        segNode.setAttribute('features', feats);
        segNode.setAttribute('id', ''+ segment.id);
        segNode.setAttribute('state', segment.state);
        segNode.append(segment.text);

        const children = segment.children;
        if (children != null) {
            children.forEach((v, i, a) => {
                segNode.appendChild(this.recursiveSegmentIterator(v));
            });
        }
        return segNode;
    }
}
