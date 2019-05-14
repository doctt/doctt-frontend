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
  ComponentRef,
  Input
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
import { Document, Segment } from "Models/document/document";
import { TreeContent, TreeFile, TreeNode } from "Models/tree/Tree";
import { ColorizedNode, ColorizedTree } from "Models/tree/ColorizedTree";
import { TreeService } from "Services/tree/Tree";
import { isFulfilled } from "q";
import { DialogService } from "Services/userfeedback/DialogService";
import { DocumentService } from "Services/document/DocumentService";

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

  private document : Document;
  private tree : TreeFile;
  private lastSegmentId = 0;


  constructor(
    private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private treeService: TreeService,
    private dialogService: DialogService,
    private documentService: DocumentService
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

  tagSelectionHandler(tag: Tag) {
    // Close FTC, apply tag

    if (this.ftcPortalHost != null) {
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

    let sel_so = this.lastSelection.startOffset;
    let sel_sc = this.lastSelection.startContainer;

    let sel_eo = this.lastSelection.endOffset;
    let sel_ec = this.lastSelection.endContainer;

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

      console.log(span_container, tag);

      let whatevs = this.addSegToStructure(span_container,
        sel_so,
        sel_eo,
        sel_sc,
        sel_ec,
        tag);
      //console.log(seg);
      //console.log("start sel ", this.lastSelection.startOffset);
      //console.log("end sel ", this.lastSelection.startOffset);

    } else {
      console.log(
        "Node isn't Node.TEXT_NODE. Got " + node.nodeType + " instead."
      );
    }
  }

  private getNewIdFromSegmentArray(segments : Segment[], currentID : number) : number{
    let id : number = currentID;
    segments.forEach((v, i, a) => {
       if(v.id > id){
        id = v.id;
       }
       //console.log(v.id);
       if(v.children != null){
          let innerID :number = this.getNewIdFromSegmentArray(v.children, id); 
       }
    });
    return id + 1;
  }

  private addSegToStructure(span_container : HTMLElement,
      startOffset: number,
      endOffset: number,
      startContainer: Node,
      endContainer: Node,
      tag : Tag) : any {
    console.log("Tag features: ", tag.features);

      let documents = this.documentService.loadDocuments();
      let id = this.document.header.id;
      let actualDoc : Document = this.document;
      
      let tagText = "";
      let inners : any = span_container.getElementsByClassName("tag-inner");
      inners = inners[0]; 
      let tagInner : HTMLElement = inners; 
      let children : Segment[];

      tagInner.childNodes.forEach((v, k, p)=> {
        let iHateTS : any = v;
        let child : HTMLElement = iHateTS;
        if(child.tagName != "DIV"){
          tagText += v.textContent;
        }
        if(child.className == "span-container"){
          children.push(this.addSegToStructure(span_container,
            startOffset,
            endOffset,
            startContainer,
            endContainer,
            tag));
        }
      });

      //console.log(actualDoc.body.segments);


      this.lastSegmentId++;
      let segment : Segment = {
        features : tag.features,
        state : "active",
        id: this.lastSegmentId,
        children : [],
        text : tagText
      }

      debugger;
      let segmentID = Number.parseInt(span_container.parentElement.getAttribute("data-segment-id"));
      
      console.log("docseg ", segmentID);

      this.lastSegmentId++;
      segment = this.addSegmentIntoText(
        this.findSegmentById(this.document.body.segments, segmentID),
        startOffset,
        endOffset,
        this.lastSegmentId,
        segment);

      console.log("docseg children", segment.children);

      actualDoc = this.replaceSegmentInDocument(actualDoc, segment);

      console.log("actual doc ", actualDoc);

      documents[id] = actualDoc;

      this.documentService.storeDocuments(documents);
    return true;
  }

  private findSegmentById(segments: Segment[], id : number) : Segment {
    if(segments.length == 0){
      return null;
    }

    for(let s of segments){
      if(s.id == id){
        return s;
      }

      let cfind = this.findSegmentById(s.children, id);
      if(cfind != null){
        return cfind;
      }
    }

    return null;
  }

  private replaceSegmentInDocument(doc : Document, segment : Segment) : Document{
    doc.body.segments = this.recursiveReplaceSegments(doc.body.segments, segment);
    return doc;
  }

  private recursiveReplaceSegments(segments : Segment[], segment : Segment) : Segment[]{
    for(let i = 0; i < segments.length; i++){
      if(segments[i].id = segment.id){
        segments[i] = segment;
        break;
      }
      if(segments[i].children != null){
        let new_children =  this.recursiveReplaceSegments(segments[i].children, segment);
        if(segments[i].children == new_children)
          break;
      }
    }
    return segments;
  }

  private addSegmentIntoText(segmentParent : Segment, offsetStart: number, offsetEnd: number, nextID : number, segment : Segment) : Segment{
    let before = segmentParent.text.substr(0, offsetStart);
    let middle = segmentParent.text.substr(offsetStart, offsetEnd - offsetStart);
    let end = segmentParent.text.substr(offsetEnd, segmentParent.text.length);

    let segBefore : Segment= {
      children : [],
      id : nextID,
      text: before,
      state : "active",
      features : []
    };

    let segAfter : Segment = {
      children : [],
      id : nextID+1,
      text : end,
      state : "active",
      features : []
    }
    segmentParent.children.push(segBefore, segment, segAfter);
    segmentParent.text = "";
    return segmentParent;
  }

  private findSegmentByText(segments : Segment[], text : string) : Segment{
    let seg : Segment = null;
    segments.forEach((v, i, a) => {
      //console.log(v.text);
      //console.log(text);
      //console.log(v);
      if(v.text.indexOf(text) != -1){
        seg = v;
      }
      if(v.children.length == 0){
        let childSeg : Segment = this.findSegmentByText(v.children, text);
        if(childSeg != null)
          seg = childSeg;
      }
   });
    return seg;
  }

  private findTagByFeatures(n: ColorizedNode, features: string[]): ColorizedNode {
    if (n.name.toUpperCase() == n.name) {

      if (features == undefined || features.length == 0) {
        return null;
      }

      // Looks like a -TYPE node, skip it
      let node = null;
      for (let c of n.children) {
        if (c.name == features[0]) {
          return this.findTagByFeatures(c, features);
        }
      }

      if (node == null) {
        return null;
      }
    }

    if (n.name != features[0]) {
      return null;
    }

    if (features.length == 1) {
      return n;
    }

    if (n.children != null) {
      for (let c of n.children) {
        let lastN = this.findTagByFeatures(c, features.splice(1));
        if (lastN != null) {
          return lastN;
        }
      }
    }
  }

  load(d: Document, t: TreeFile) {
    this.document = d;
    this.tree = t;
    console.log('Editor: Loading...');

    if (t == null) {
      console.error("Cannot load a document without a corresponding TreeFile");
      this.dialogService.error("Unable to open this document",
        "In order to open this document, you need to select / upload a tree first!");
      return;
    }

    if (t.version != 1) {
      console.error('Invalid Tree version');
      return;
    }

    let ct = this.treeService.colorizeTree(t.data.root)[0];

    let el: HTMLElement = this.editor.nativeElement;

    for (let s of d.body.segments) {
      this.parseSegment(ct, el, s);
    }
  }

  parseSegment(ct : ColorizedNode, el: HTMLElement, s: Segment){
    let divSegment = document.createElement('div');
    divSegment.className = "segment-container";
    divSegment.setAttribute("data-segment-id", s.id.toString())

    this.lastSegmentId = Math.max(this.lastSegmentId, s.id);

    if (s.features.length == 0) {
      divSegment.innerHTML = s.text.replace(/\n/g, '<br/>');
    } else {
      let content;
      if(s.children.length == 0){
        content = document.createElement('span');
        content.innerText = s.text;
      } else {
        content = document.createElement('div');
        content.className = 'segment-container';

        for (let segment of s.children) {
          this.parseSegment(ct, content, segment);
        }
      }

      let portal = new ComponentPortal(TagComponent);
      let portalHost = new DomPortalHost(
        divSegment,
        this.resolver,
        this.appRef,
        this.injector
      );

      let ref = portalHost.attachComponentPortal(portal);
      let tag = this.findTagByFeatures(ct, s.features);

      if (tag == null) {
        console.error("Invalid tag!");
        return;
      }

      console.log("Setting tag to ", tag);

      let element: ComponentRef<TagComponent> = ref;
      element.instance.setContent(content);
      element.instance.setTag(tag);
    }

    el.appendChild(divSegment);
  }
}
