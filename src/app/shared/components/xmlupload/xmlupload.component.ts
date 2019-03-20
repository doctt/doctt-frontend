import { Component, ViewChild, Output, EventEmitter } from "@angular/core";
import { MatProgressBar } from "@angular/material";

@Component({
  selector: "doctt-xmlupload",
  templateUrl: "./xmlupload.component.html",
  styleUrls: ["./xmlupload.component.scss"]
})
export class XmlUploadComponent {
  private debug: boolean = true;

  @ViewChild("progressBar") progressBar: MatProgressBar;
  private progress: number;
  
  @Output('fileUploaded')
  private fileUploaded: EventEmitter<Document> = new EventEmitter<Document>();
  

  ngOnInit(): void {
    this.progressBar._elementRef.nativeElement.style.display = "hidden";
    console.log(this.progressBar);
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
        resolve(document);
      };
    });

    return promise;
  }
}
