import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentFactory,
  Injector
} from "@angular/core";
import { TagService } from "../../../../services/tag/TagService";
import { MatChip, MatChipBase } from "@angular/material";
import { TagComponent } from "../../tag/tag.component";
import { ComponentPortal, Portal } from "@angular/cdk/portal";
import { registerNgModuleType } from "@angular/core/src/linker/ng_module_factory_loader";

@Component({
  selector: "custom-textarea",
  templateUrl: "./customtextarea.component.html",
  styleUrls: ["./customtextarea.component.scss"]
})
export class CustomTextareaComponent implements OnInit {
  @ViewChild("editorInner") editor: ElementRef;

  private lastSelection: Range;
  //constructor(private tagService: TagService) {}
  private componentFactory: ComponentFactory<TagComponent>;

  constructor(
    private viewContainerRef: ViewContainerRef,
	private resolver: ComponentFactoryResolver,
	private injector: Injector) {
    this.componentFactory = this.resolver.resolveComponentFactory(TagComponent);
    console.log(this.viewContainerRef);
  }

  ngOnInit() {}

  @HostListener("document:selectionchange", ["$event.target"])
  selectionChanged(event: Event) {
    let sel = document.getSelection().getRangeAt(0);
    let element: HTMLElement = this.editor.nativeElement;

    if (this.editor.nativeElement.contains(sel.startContainer)) {
      this.lastSelection = sel;
    }
  }

  select(v: Number): void {
    let common = this.lastSelection.commonAncestorContainer;
    if (common === this.editor.nativeElement) {
      console.log("Multi line selection");
    }
	console.log(v, this.lastSelection);
	let componentRef = this.componentFactory.create(this.injector);
	console.log(componentRef);

	let div = document.createElement("div");
	div.style.backgroundColor = 'red';
	div.innerText = "Hello :)";
	let editorEl : HTMLElement = this.editor.nativeElement;
	
	let node = this.lastSelection.startContainer;

	if(node.nodeType == Node.TEXT_NODE){
		// Split
		let text = node.textContent;

		let span_container = document.createElement("div");
		span_container.className = "span-container";
		span_container.style.backgroundColor = "#00897B";

		if(this.lastSelection.startContainer == this.lastSelection.endContainer){
			// Same container, 3 spans!
			let text1 = text.substr(0, this.lastSelection.startOffset);
			let text2 = text.substr(this.lastSelection.startOffset, this.lastSelection.endOffset - this.lastSelection.startOffset);
			let text3 = text.substr(this.lastSelection.endOffset);
			
			let t1_span = document.createElement("span");
			let t2_span = document.createElement("span");

			t2_span.style.backgroundColor = "#FFEB3B";

			let t3_span = document.createElement("span");

			t1_span.textContent = text1;
			t2_span.textContent = text2;
			t3_span.textContent = text3;

			span_container.appendChild(t1_span);
			span_container.appendChild(t2_span);
			span_container.appendChild(t3_span);

			console.log(text1, " == ", text2, " == ", text3);
		} else {

			// Multi line selection

			// Start container
			let sc = this.lastSelection.startContainer;
			let ec = this.lastSelection.endContainer;

			let frag = this.lastSelection.extractContents();

			span_container.style.backgroundColor = "#FFEB3B";

			//span_container.append(t1_span, t2_span);
		}
		node.parentNode.replaceChild(span_container, node);
		node = span_container;
	} else {
		console.log("Node isn't Node.TEXT_NODE. Got " + node.nodeType + " instead.");
	}

	return;

	while(node.nodeType != Node.ELEMENT_NODE) {
		node = node.parentNode;
	}

	let placeholder = document.createElement("span");
	placeholder.textContent = "I'm a placeholder";
	placeholder.style.backgroundColor = '#FF0';
	placeholder.style.width = '100px';
	placeholder.style.height = '20px';
	
	editorEl.insertBefore(placeholder, node);
	/*let frag = this.lastSelection.extractContents();
	
	div.appendChild(frag);

	placeholder.appendChild(div);*/

	// Only works within the same node:
	/*editorEl.appendChild(div);
	this.lastSelection.surroundContents(div);*/

//	portal.attach(componentRef.instance);
  }
}
