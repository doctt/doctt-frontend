import fs = require('fs');
import { DocumentUploadComponent } from './documentupload.component';
import { DocumentParserService } from 'Services/parser/document/DocumentParser';

test("upload", () =>{
  let docUpload : DocumentUploadComponent = new DocumentUploadComponent(new DocumentParserService);
  
});