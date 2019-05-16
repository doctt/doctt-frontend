import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatProgressBar } from '@angular/material';
import { FileInputComponent, FileInput } from 'ngx-material-file-input';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: "doctt-xmlupload",
  templateUrl: './xmlupload.component.html',
  styleUrls: ['./xmlupload.component.scss'],
  providers: [
    FileInputComponent
  ]
})
export class XmlUploadComponent {
  public myFormGroup: FormGroup = new FormGroup({
    xmlFileUpload: new FormControl()
  });

  private files: FileInput = null;

  private debug = false;

  @ViewChild('progressBar') progressBar: MatProgressBar;
  public progress: number;

  @Output()
  private fileUploaded: EventEmitter<Document> = new EventEmitter<Document>();

  private fileUploadEvent(e: FileInput) {
    this.files = e;
  }


  ngOnInit(): void {
    this.progressBar._elementRef.nativeElement.style.display = 'hidden';
    this.myFormGroup.get('xmlFileUpload').valueChanges.subscribe(this.fileUploadEvent.bind(this));
  }

  load(): Promise<Document> {
    if (this.files == null) {
      return null;
    }

    const fileReader = new FileReader();
    this.progressBar._elementRef.nativeElement.style.display = 'block';
    fileReader.readAsText(this.files.files[0]);

    const promise = new Promise<Document>((resolve, reject) => {
      this.progress = 0;
      fileReader.onloadend = e => {
        if (this.debug) {
          console.log(e);
          console.log(fileReader.readyState);
          console.log(fileReader.result.toString());
        }

        const document = new DOMParser().parseFromString(
          fileReader.result.toString(),
          'text/xml'
        );

        this.fileUploaded.emit(document);
        resolve(document);
      };
    });

    return promise;
  }
}
