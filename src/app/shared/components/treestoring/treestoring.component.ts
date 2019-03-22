import { Component, ViewChild, Output, EventEmitter, OnInit } from "@angular/core";
import { MatProgressBar } from "@angular/material";
import { TreeService } from "Services/tree/Tree";

@Component({
  selector: "treestoring",
  templateUrl: "./treestoring.component.html",
  styleUrls: ["./treestoring.component.scss"]
})
export class TreeStoringComponent implements OnInit {
  private debug: boolean = true;

  constructor(private treeService : TreeService) {}

  @ViewChild("progressBar") progressBar: MatProgressBar;
  private progress: number;
  
  @Output('fileUploaded')
  private fileUploaded: EventEmitter<Document> = new EventEmitter<Document>();
  

  ngOnInit(): void {
    this.progressBar._elementRef.nativeElement.style.display = "hidden";
    console.log(this.progressBar);
  }

  printTree(){
    let tree = this.treeService.getActualTree();
    if(tree == null){
      console.log("Tree not inizialized");
    }else{
      console.log(tree);
    }
  }

  load(files: FileList): Promise<Document> {
    let fileReader = new FileReader();
    this.progressBar._elementRef.nativeElement.style.display = "block";
    fileReader.readAsText(files[0]);

    let promise = new Promise<Document>((resolve, reject) => {
      this.progress = 0;
      fileReader.onloadend = e => {
        if (this.debug) {
          console.log(e);
          console.log(fileReader.readyState);
          console.log(fileReader.result.toString());
        }

        let document = new DOMParser().parseFromString(
          fileReader.result.toString(),
          "text/xml"
        );

        this.fileUploaded.emit(document);
        localStorage.setItem('tree', JSON.stringify({
          tree : fileReader.result
        }))
        console.log("stored");
        resolve(document);
      };
    });
    
    return promise;
  }
}
