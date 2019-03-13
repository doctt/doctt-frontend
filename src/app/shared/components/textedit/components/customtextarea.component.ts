import { Component, OnInit, HostListener, ViewChild, ElementRef } from "@angular/core";
import { TagService } from "../../../../services/tag/TagService";
import { MatChip, MatChipBase } from "@angular/material";
import { elementClassProp } from "@angular/core/src/render3";

@Component({
  selector: "custom-textarea",
  templateUrl: "./customtextarea.component.html",
  styleUrls: ["./customtextarea.component.scss"]
})
export class CustomTextareaComponent implements OnInit {
	@ViewChild("editorInner") editor: ElementRef;
	
	private lastSelection : any;
	constructor(private tagService: TagService) {}

  ngOnInit() {}

	@HostListener("document:selectionchange", ["$event.target"]) 
	selectionChanged(event: Event) {
		let sel = document.getSelection().getRangeAt(0);
		console.log(this.editor.nativeElement);

		let element : HTMLElement = this.editor.nativeElement;

		if(this.editor.nativeElement.contains(sel.startContainer)){
			console.log(sel.startContainer);
			this.lastSelection = sel;
			console.log("This: ", this);
			console.log("Last Selection (from selChanged)", this.lastSelection);
			console.log(element);
		}
	}

	select(v : Number) : void {
		console.log("V is ", v);
		console.log("This2: ", this);
		console.log("Last Selection: ", this.lastSelection);
	}
}
