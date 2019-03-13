import { Component } from "@angular/core";

let debug = 0;

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

    load(files : FileList){
        let fileReader = new FileReader();
        fileReader.readAsText(files[0]);

        fileReader.onloadend = (e) => {
            if(debug){
                console.log(e);    
                console.log(fileReader.readyState)
                console.log(fileReader.result.toString())
                document.querySelector(".container").innerHTML = fileReader.result.toString();
            }
            

        }
    }
}