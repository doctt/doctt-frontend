import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentFactory,
  Injector,
  ApplicationRef,
  ComponentRef
} from "@angular/core";
import { TagService } from "../../../../services/tag/TagService";
import { MatChip, MatChipBase, DateAdapter } from "@angular/material";
import { TagComponent } from "../../tag/tag.component";
import {
  ComponentPortal,
  Portal,
  CdkPortalOutlet,
  DomPortalHost,
  PortalHost
} from "@angular/cdk/portal";
import { registerNgModuleType } from "@angular/core/src/linker/ng_module_factory_loader";
import { createComponent } from "@angular/compiler/src/core";
import { flushModuleScopingQueueAsMuchAsPossible } from "@angular/core/src/render3/jit/module";
import { isFakeMousedownFromScreenReader } from "@angular/cdk/a11y";
import { FloatingTagChooserComponent } from "../../floatintagchooser/floatingtagchooser.component";

@Component({
  selector: "custom-textarea",
  templateUrl: "./customtextarea.component.html",
  styleUrls: ["./customtextarea.component.scss"]
})
export class CustomTextareaComponent implements OnInit {
  @ViewChild("editorInner") editor: ElementRef;
  @ViewChild("ftcContainer") ftcContainer: ElementRef;

  private lastMouseDown: number = -1;
  private isUserSelectingText: boolean = false;

  private lastSelection: Range;
  private lastSelectionTime: number = -1;
  //constructor(private tagService: TagService) {}
  private componentFactory: ComponentFactory<TagComponent>;

  private ftcPortalHost: DomPortalHost;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {
    this.componentFactory = this.resolver.resolveComponentFactory(TagComponent);
  }

  ngOnInit() { }

  @HostListener("document:selectionchange", ["$event.target"])
  selectionChanged(event: Event) {
    let sel = document.getSelection().getRangeAt(0);
    let element: HTMLElement = this.editor.nativeElement;

    if (this.editor.nativeElement.contains(sel.startContainer)) {
      this.lastSelection = sel;

      if (sel.startOffset == sel.endOffset
        && sel.startContainer == sel.endContainer) {
        console.log("Selection length is 0");
        if (this.ftcPortalHost != null &&
          this.ftcPortalHost.hasAttached) {
          this.ftcPortalHost.detach();
        }
      } else {
        console.log("Selection changed");
        this.lastSelectionTime = new Date().getTime();
      }
    }
  }

  @HostListener("document:mouseup", ["$event"])
  mouseUp(event: MouseEvent) {
    // TODO: Handle Keyboard Selection (KEY UP?)
    if (this.editor.nativeElement.contains(event.target)) {
      console.log("Mouse up in our texteditor");
      if (this.isUserSelectingText) {
        if (this.lastMouseDown < this.lastSelectionTime) {
          this.isUserSelectingText = false;

          let posX = (event.offsetX + 20);
          let posY = (event.pageY + 10);
          // Bound Fix

          let margin = 300;

          if (posX > window.innerWidth - margin) {
            posX = window.innerWidth - margin;
          }

          if (posX < 0) {
            posX = 0;
          }


          this.showFloatingTagChooser(posX, posY);
        }
      }
    }
  }

  @HostListener("document:mousedown", ["$event.target"])
  mouseDown(target: HTMLElement) {
    if (this.editor.nativeElement.contains(target)) {
      this.isUserSelectingText = true;
      this.lastMouseDown = new Date().getTime();
    }
  }

  showFloatingTagChooser(x: number, y: number) {
    if (this.ftcPortalHost == null) {
      this.ftcPortalHost = new DomPortalHost(
        this.ftcContainer.nativeElement,
        this.resolver,
        this.appRef,
        this.injector
      );
    } else {
      // Another component may already exist
      if (this.ftcPortalHost.hasAttached) {
        this.ftcPortalHost.detach();
      }
    }

    let portal = new ComponentPortal(FloatingTagChooserComponent);

    let ref = this.ftcPortalHost.attachComponentPortal(portal);
    ref.instance.moveTo(x, y);
  }

  select(v: number): void {
    let common = this.lastSelection.commonAncestorContainer;
    if (common === this.editor.nativeElement) {
      console.log("Multi line selection");
    }
    console.log(v, this.lastSelection);
    let componentRef = this.componentFactory.create(this.injector);

    let div = document.createElement("div");
    div.style.backgroundColor = "red";
    div.innerText = "Hello :)";
    let editorEl: HTMLElement = this.editor.nativeElement;

    let node = this.lastSelection.startContainer;

    if (node.nodeType == Node.TEXT_NODE) {
      // Split
      let text = node.textContent;

      let span_container;

      let element_container;
      let content: Node;

      let selectionContainer = document.createElement("div");
      selectionContainer.style.display = "inline-block";

      if (
        this.lastSelection.startContainer == this.lastSelection.endContainer
      ) {
        // Same container, 3 spans!
        span_container = document.createElement("span");
        let text1 = text.substr(0, this.lastSelection.startOffset);
        let text2 = text.substr(
          this.lastSelection.startOffset,
          this.lastSelection.endOffset - this.lastSelection.startOffset
        );
        let text3 = text.substr(this.lastSelection.endOffset);

        let t1_span = document.createElement("span");
        let t2_span = document.createElement("span");
        let t3_span = document.createElement("span");

        t1_span.textContent = text1;
        t2_span.textContent = text2;
        t3_span.textContent = text3;

        span_container.appendChild(t1_span);
        span_container.appendChild(selectionContainer);
        span_container.appendChild(t3_span);

        element_container = selectionContainer;
        content = t2_span;

        console.log(text1, " == ", text2, " == ", text3);
      } else {
        // Multi line selection
        span_container = document.createElement("div");

        // Start container
        let sc = this.lastSelection.startContainer;
        let ec = this.lastSelection.endContainer;

        let span_t = sc.textContent.substr(0, this.lastSelection.startOffset);
        let span = document.createElement("span");
        span.textContent = span_t;

        let frag = this.lastSelection.extractContents();

        node.parentNode.insertBefore(span, node);
        element_container = span_container;
        content = frag;
      }

      span_container.className = "span-container";
      node.parentNode.replaceChild(span_container, node);

      node = span_container;

      let portal = new ComponentPortal(TagComponent);
      let portalHost = new DomPortalHost(
        element_container,
        this.resolver,
        this.appRef,
        this.injector
      );

      let ref = portalHost.attachComponentPortal(portal);

      let element: ComponentRef<TagComponent> = ref;
      element.instance.setContent(content);
      element.instance.setType(v);
    } else {
      console.log(
        "Node isn't Node.TEXT_NODE. Got " + node.nodeType + " instead."
      );
    }
  }
}
