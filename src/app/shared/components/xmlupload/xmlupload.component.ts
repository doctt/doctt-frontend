import { Component } from "@angular/core";

interface FileInfo{
    version : String,
    encoding : String    
}

interface Header{
    textfile : String,
    lang : String 
}

interface Segment{
    features : String[],
    id : BigInteger,
    state : String
}

interface Body{
    segments : Segment[]
}

interface Document{
    header : Header,
    body : Body
}

interface File{
    info : FileInfo,
    data : Document
}



@Component({
    selector: "xmlupload",
    templateUrl: './xmlupload.component.html',
    styleUrls: ['./xmlupload.component.scss']
})

export class XmlUploadComponent {
    
    ngOnInit(): void {
    }

    load(file : FileList){
        console.log(file[0]);
    }
}