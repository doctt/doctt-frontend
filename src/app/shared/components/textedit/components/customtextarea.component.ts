import { Component, OnInit, HostListener, ViewChild, ElementRef } from "@angular/core";
import { TagService } from "../../../../services/tag/TagService";
import { MatChip, MatChipBase } from "@angular/material";

@Component({
  selector: "custom-textarea",
  templateUrl: "./customtextarea.component.html",
  styleUrls: ["./customtextarea.component.scss"]
})
export class CustomTextareaComponent implements OnInit {
  @ViewChild("editor") editor: ElementRef;
	constructor(private tagService: TagService) {}

  ngOnInit() {}

	@HostListener("document:selectionchange", ["$event.target"]) 
	selectionChanged(event: Event) {
		let sel = document.getSelection();
		if (this.editor.nativeElement.contains(sel.anchorNode)){
			console.log(sel);
		}
  }
}
