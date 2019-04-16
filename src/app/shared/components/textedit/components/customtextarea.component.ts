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
import { Event } from "@angular/router";
import { Tag } from "Models/tag/Tag";
import { Document } from "Models/document/document";
import { TreeContent, TreeFile, TreeNode } from "Models/tree/Tree";
import { ColorizedNode } from "Models/tree/ColorizedTree";
import { TreeService } from "Services/tree/Tree";
import { isFulfilled } from "q";

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
    private appRef: ApplicationRef,
    private treeService: TreeService
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
        if (this.ftcPortalHost != null &&
          this.ftcPortalHost.hasAttached) {
          this.ftcPortalHost.detach();
        }
      } else {
        this.lastSelectionTime = new Date().getTime();
      }
    }
  }

  @HostListener("document:mouseup", ["$event"])
  mouseUp(event: MouseEvent) {
    // TODO: Handle Keyboard Selection (KEY UP?)
    if (this.editor.nativeElement.contains(event.target)) {
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

  tagSelectionHandler(tag: Tag){
    // Close FTC, apply tag

    if(this.ftcPortalHost != null){
      this.ftcPortalHost.detach();
    }

    this.select(tag);
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
    ref.instance.tagSelection.subscribe(this.tagSelectionHandler.bind(this));
  }

  select(tag: Tag): void {
    let common = this.lastSelection.commonAncestorContainer;
    let componentRef = this.componentFactory.create(this.injector);

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
      element.instance.setTag(tag);
    } else {
      console.log(
        "Node isn't Node.TEXT_NODE. Got " + node.nodeType + " instead."
      );
    }
  }

  private findTagByFeatures(n: ColorizedNode, features: string[]) : ColorizedNode {
    if (n.name.toUpperCase() == n.name) {

      if(features.length == 0){
        return null;
      }

      // Looks like a -TYPE node, skip it
      let node = null;
      for(let c of n.children){
        if(c.name == features[0]){
          return this.findTagByFeatures(c, features);
        }
      }
      
      if(node == null){
        return null;
      }
    }
    
    if(n.name != features[0]){
      return null;
    }

    if(features.length == 1){
     return n; 
    }

    for (let c of n.children) {
      let lastN = this.findTagByFeatures(c, features.splice(1));
      if(lastN != null){
        return lastN;
      }
    }
  }

  load(d: Document, t: TreeFile) {
    console.log('Editor: Loading...');

    if(t.version != 1){
      console.error('Invalid Tree version');
      return;
    }

    let ct = this.treeService.colorizeTree(t.data.root)[0];

    let el : HTMLElement = this.editor.nativeElement;
    
    for(let s of d.body.segments){
      let divSegment  = document.createElement('div');
      divSegment.className = "segment-container"; 

      if(s.features.length == 0){
        divSegment.innerHTML = s.text.replace(/\n/g, '<br/>');
      } else {
        let spanEl = document.createElement('span');
        spanEl.innerText = s.text;


        let portal = new ComponentPortal(TagComponent);
        let portalHost = new DomPortalHost(
          divSegment,
          this.resolver,
          this.appRef,
          this.injector
        );
        let ref = portalHost.attachComponentPortal(portal);

        let tag = this.findTagByFeatures(ct, s.features);

        if(tag == null){
          console.error("Invalid tag!");
          return;
        }

        let element: ComponentRef<TagComponent> = ref;
        element.instance.setContent(spanEl);
        element.instance.setTag(tag);
      }

      el.appendChild(divSegment);  
    }
  }
}
