import { Component, OnInit } from "@angular/core";
import { QuillEditorComponent, QuillModules, QuillModule, Range } from "ngx-quill";

@Component({
  selector: "custom-textarea",
  templateUrl: "./customtextarea.component.html",
  styleUrls: ["./customtextarea.component.scss"]
})
export class CustomTextareaComponent {
  modules = {};
    addBindingCreated(quill: any) {
    quill.keyboard.addBinding(
      {
        key: "b"
      },
      (range : Range, context : any) => {
        console.log("KEYBINDING B", range, context);
        //return true;
      }
    );
  }

  doTest(): void {
    console.log("Hello world");
  }
}
