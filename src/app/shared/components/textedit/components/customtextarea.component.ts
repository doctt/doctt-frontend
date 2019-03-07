import { Component, OnInit } from "@angular/core";
import {
  QuillEditorComponent,
  QuillModules,
  QuillModule,
  Range
} from "ngx-quill";

import Quill from "quill";


class SelectionChangedEvent {
  public editor: Quill;
  public range : Range;
  public oldRange: Range;
  public source: String;
}

@Component({
  selector: "custom-textarea",
  templateUrl: "./customtextarea.component.html",
  styleUrls: ["./customtextarea.component.scss"]
})
export class CustomTextareaComponent implements OnInit{
  modules = {toolbar: [
    ['test_custom'],        // Added custom toolbar
]};


  ngOnInit() {
    const BlockEmbed = Quill.import('blots/block/embed');
    BlockEmbed.blotName = 'test_custom_b';
    BlockEmbed.tagName = 'span';
    Quill.register(BlockEmbed);
  }


  addBindingCreated(quill: Quill) {
    quill.keyboard.addBinding(
      {
        key: "ctrl+b"
      },
      (range: Range, context: any) => {
        console.log("KEYBINDING CTRL + B", range, context);
        //return true;
      }
    );
  }

  selectionChanged(event: SelectionChangedEvent){
    // Selection Changed Event
    let quill = event.editor;
    quill.formatText(event.range.index, event.range.length, {
      'bold': true,
      'background': '#F00'
    }, 'api');
  }

  doTest(): void {
    console.log("Hello world");
  }
}
