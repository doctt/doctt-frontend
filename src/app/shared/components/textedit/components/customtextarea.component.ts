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
} from '@angular/core';
import { TagService } from '../../../../services/tag/TagService';
import { MatChip, MatChipBase, DateAdapter } from '@angular/material';
import { TagComponent } from '../../tag/tag.component';
import {
  ComponentPortal,
  Portal,
  CdkPortalOutlet,
  DomPortalHost,
  PortalHost
} from '@angular/cdk/portal';
import { registerNgModuleType } from '@angular/core/src/linker/ng_module_factory_loader';
import { createComponent } from '@angular/compiler/src/core';
import { flushModuleScopingQueueAsMuchAsPossible } from '@angular/core/src/render3/jit/module';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { FloatingTagChooserComponent } from '../../floatintagchooser/floatingtagchooser.component';
import { Event } from '@angular/router';
import { Tag } from 'Models/tag/Tag';
import { Document, Segment } from 'Models/document/document';
import { TreeContent, TreeFile, TreeNode } from 'Models/tree/Tree';
import { ColorizedNode, ColorizedTree } from 'Models/tree/ColorizedTree';
import { TreeService } from 'Services/tree/Tree';
import { isFulfilled } from 'q';
import { DialogService } from 'Services/userfeedback/DialogService';
import { DocumentService } from 'Services/document/DocumentService';

@Component({
  selector: "custom-textarea",
  templateUrl: './customtextarea.component.html',
  styleUrls: ['./customtextarea.component.scss']
})
export class CustomTextareaComponent implements OnInit {


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
  @ViewChild('editorInner') editor: ElementRef;
  @ViewChild('ftcContainer') ftcContainer: ElementRef;

  private lastMouseDown = -1;
  private isUserSelectingText = false;

  private lastSelection: Range;
  private lastSelectionTime = -1;
  // constructor(private tagService: TagService) {}
  private componentFactory: ComponentFactory<TagComponent>;
  private ftcPortalHost: DomPortalHost;

  private document: Document;
  private tree: TreeFile;
  private lastSegmentId = 0;

  public static removeFeaturesFromSegmentID(id: number, documentService: DocumentService, document: Document) {
    const docs: Document[] = documentService.loadDocuments();
    document.body.segments = this.recursiveFeatuersRemoval(document.body.segments, id);
    docs[document.header.id] = document;
    documentService.storeDocuments(docs);
  }

  private static recursiveFeatuersRemoval(segments: Segment[], id: number): Segment[] {
    if (segments.length == 0) {
      return [];
    }

    for (const s of segments) {
      if (s.id == id) {
        s.features = [];
        return segments;
      }
      if (s.children != null && s.children != []) {
        s.children = this.recursiveFeatuersRemoval(s.children, id);
      }
    }
    return segments;
  }

  private static findSegmentById(segments: Segment[], id: number): Segment {
    if (segments.length == 0) {
      return null;
    }

    for (const s of segments) {
      if (s.id == id) {
        return s;
      }

      const cfind = this.findSegmentById(s.children, id);
      if (cfind != null) {
        return cfind;
      }
    }

    return null;
  }

  private static replaceSegmentInDocument(doc: Document, segment: Segment, id: number ): Document {
    doc.body.segments = this.recursiveReplaceSegments(doc.body.segments, segment, id);
    return doc;
  }

  private static recursiveReplaceSegments(segments: Segment[], segment: Segment, id: number): Segment[] {
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].id == id) {
        segments[i] = segment;
        break;
      }
      if (segments[i].children != null) {
        let new_children =  this.recursiveReplaceSegments(segments[i].children, segment, id);
        if (segments[i].children == new_children) {
          break;
        }
      }
    }
    return segments;
  }

  ngOnInit() { }

  @HostListener('document:selectionchange', ['$event.target'])
  selectionChanged(event: Event) {
    const sel = document.getSelection().getRangeAt(0);
    const element: HTMLElement = this.editor.nativeElement;

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

  @HostListener('document:mouseup', ['$event'])
  mouseUp(event: MouseEvent) {
    // TODO: Handle Keyboard Selection (KEY UP?)
    if (this.editor.nativeElement.contains(event.target)) {
      if (this.isUserSelectingText) {
        if (this.lastMouseDown < this.lastSelectionTime) {
          this.isUserSelectingText = false;

          let posX = (event.offsetX + 20);
          const posY = (event.pageY + 10);
          // Bound Fix

          const margin = 300;

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

  @HostListener('document:mousedown', ['$event.target'])
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

    const portal = new ComponentPortal(FloatingTagChooserComponent);

    const ref = this.ftcPortalHost.attachComponentPortal(portal);
    ref.instance.moveTo(x, y);
    ref.instance.tagSelection.subscribe(this.tagSelectionHandler.bind(this));
  }

  select(tag: Tag): void {
    let node = this.lastSelection.startContainer;

    let sel_so = this.lastSelection.startOffset;
    let sel_sc = this.lastSelection.startContainer;

    let sel_eo = this.lastSelection.endOffset;
    let sel_ec = this.lastSelection.endContainer;

    if (node.nodeType == Node.TEXT_NODE) {
      // Split
      const text = node.textContent;
      let span_container;

      let element_container;
      let content: Node;

      const selectionContainer = document.createElement('div');
      selectionContainer.style.display = 'inline-block';

      debugger;

      if (this.lastSelection.startContainer == this.lastSelection.endContainer) {
        // Same container, 3 spans!
        span_container = document.createElement('span');
        const text1 = text.substr(0, this.lastSelection.startOffset);
        const text2 = text.substr(
          this.lastSelection.startOffset,
          this.lastSelection.endOffset - this.lastSelection.startOffset
        );
        const text3 = text.substr(this.lastSelection.endOffset);

        let t1_span = document.createElement('span');
        let t2_span = document.createElement('span');
        let t3_span = document.createElement('span');

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
        span_container = document.createElement('div');

        // Start container
        const sc = this.lastSelection.startContainer;
        const ec = this.lastSelection.endContainer;

        let span_t = sc.textContent.substr(0, this.lastSelection.startOffset);
        const span = document.createElement('span');
        span.textContent = span_t;

        const frag = this.lastSelection.extractContents();

        node.parentNode.insertBefore(span, node);
        element_container = span_container;
        content = frag;
      }

      span_container.className = 'segment-container';

      this.lastSegmentId++;
      span_container.setAttribute('data-segment-id', this.lastSegmentId.toString());

      node.parentNode.replaceChild(span_container, node);

      node = span_container;


      const portal = new ComponentPortal(TagComponent);
      const portalHost = new DomPortalHost(
        element_container,
        this.resolver,
        this.appRef,
        this.injector
      );

      const ref = portalHost.attachComponentPortal(portal);

      const element: ComponentRef<TagComponent> = ref;
      element.instance.setContent(content);
      element.instance.setTag(tag);
      element.instance.setDocument(this.document);

      const whatevs = this.addSegToStructure(span_container,
        sel_so,
        sel_eo,
        sel_sc,
        sel_ec,
        tag);


    } else {
      console.warn(
        'Node isn\'t Node.TEXT_NODE. Got ' + node.nodeType + ' instead.'
      );
    }
  }

  private getNewIdFromSegmentArray(segments: Segment[], currentID: number): number {
    let id: number = currentID;
    segments.forEach((v, i, a) => {
       if (v.id > id) {
        id = v.id;
       }
       if (v.children != null) {
          const innerID: number = this.getNewIdFromSegmentArray(v.children, id);
       }
    });
    return id + 1;
  }

  private addSegToStructure(span_container: HTMLElement,
                            startOffset: number,
                            endOffset: number,
                            startContainer: Node,
                            endContainer: Node,
                            tag: Tag): any {

      const documents = this.documentService.loadDocuments();
      const id = this.document.header.id;
      let actualDoc: Document = this.document;

      let tagText = '';
      let inners: any = span_container.getElementsByClassName('tag-inner');
      inners = inners[0];
      const tagInner: HTMLElement = inners;

      tagInner.childNodes.forEach((v, k, p) => {
        if (v.nodeType == Node.TEXT_NODE) {
          tagText += v.textContent;
        } else {
          const e: HTMLElement = (v as HTMLElement);
          if (e.tagName == 'BR') {
            tagText += '\n';
            return;
          }
          tagText += e.innerText;
        }
      });


      this.lastSegmentId++;
      let segment: Segment = {
        features : tag.features,
        state : 'active',
        id: this.lastSegmentId,
        children : [],
        text : tagText
      };

      //
      let node = span_container;
      while (node.parentElement.getAttribute('data-segment-id') == '') {
        node = node.parentElement;
      }
      const segmentID = Number.parseInt(node.parentElement.getAttribute('data-segment-id'), 10);

      this.lastSegmentId++;
      segment = this.addSegmentIntoText(
        CustomTextareaComponent.findSegmentById(this.document.body.segments, segmentID),
        startOffset,
        endOffset,
        this.lastSegmentId,
        segment,
        span_container);
      this.lastSegmentId += 2;
      actualDoc = CustomTextareaComponent.replaceSegmentInDocument(actualDoc, segment, segmentID);

      documents[id] = actualDoc;

      this.documentService.storeDocuments(documents);
      return true;
  }

  private addSegmentIntoText(
    segmentParent: Segment,
    offsetStart: number,
    offsetEnd: number,
    nextID: number,
    segment: Segment,
    span_container: Node): Segment {
    let parent_childNodes = span_container.parentElement.childNodes;
    let offs = 0;
    let i = 0;
    for (i = 0; i < parent_childNodes.length; i++) {
      const child = parent_childNodes[i] as HTMLElement;
      if (child == span_container) {
        break;
      }
      if (child.tagName == 'BR') {
        offs++;
      }

      if (child.innerText != undefined) {
        offs += child.innerText.length;
      } else {
        offs += child.textContent.length;
      }
    }

    offsetStart += offs;
    offsetEnd += offs;
    const before = segmentParent.text.substring(0, offsetStart);
    // let middle = segmentParent.text.substr(offsetStart, offsetEnd - offsetStart);
    const end = segmentParent.text.substring(segment.text.length + offsetStart, segmentParent.text.length);

    debugger;

    const segBefore: Segment = {
      children : [],
      id : nextID,
      text: before,
      state : 'active',
      features : []
    };

    const segAfter: Segment = {
      children : [],
      id : nextID + 1,
      text : end,
      state : 'active',
      features : []
    };
    segmentParent.children.push(segBefore, segment, segAfter);
    segmentParent.text = '';
    return segmentParent;
  }

  private findSegmentByText(segments: Segment[], text: string): Segment {
    let seg: Segment = null;
    segments.forEach((v, i, a) => {
      if (v.text.indexOf(text) != -1) {
        seg = v;
      }
      if (v.children.length == 0) {
        const childSeg: Segment = this.findSegmentByText(v.children, text);
        if (childSeg != null) {
          seg = childSeg;
        }
      }
   });
    return seg;
  }

  private findTagByFeatures2(n: ColorizedNode, originalFeatures: string[], features: string[]): Tag {
    if (originalFeatures.length == 0) {
      return null;
    }

    if (features.length == 0) {
      console.log('Features is 0 !');
      return {
        color: n.color,
        features: originalFeatures,
        name: n.name
      };
    }

    if (features.length == 1 && originalFeatures.length != 0) {
      if (n.name == features[0]) {
        return {
          color: n.color,
          features: originalFeatures,
          name: n.name
        };
      }
    }

    if (n.name.toUpperCase() == n.name) {

      // Looks like a -TYPE node, skip it
      const node = null;
      for (const c of n.children) {
        if (c.name == features[0]) {
          return this.findTagByFeatures2(c, originalFeatures, features);
        }
      }

      if (node == null) {
        return null;
      }
    }

    if (n.name != features[0]) {
      return null;
    }

    if (n.children != null) {
      for (const c of n.children) {
        let new_feats = features.slice(0);
        const lastN = this.findTagByFeatures2(c, originalFeatures, new_feats.splice(1));
        if (lastN != null) {
          return lastN;
        }
      }
    }
  }

  private findTagByFeatures(n: ColorizedNode, features: string[]): Tag {
    console.log('findTagByFeatures', n.children, features);
    return this.findTagByFeatures2(n, features, features.slice(0));
  }

  load(d: Document, t: TreeFile) {
    this.document = d;
    this.tree = t;

    if (t == null) {
      console.error('Cannot load a document without a corresponding TreeFile');
      this.dialogService.error('Unable to open this document',
        'In order to open this document, you need to select / upload a tree first!');
      return;
    }

    if (t.version != 1) {
      console.error('Invalid Tree version');
      return;
    }

    const ct = this.treeService.colorizeTree(t.data.root)[0];

    const el: HTMLElement = this.editor.nativeElement;

    for (const s of d.body.segments) {
      this.parseSegment(ct, el, s);
    }
  }

  parseSegment(ct: ColorizedNode, el: HTMLElement, s: Segment) {
    const divSegment = document.createElement('div');
    divSegment.className = 'segment-container';
    divSegment.setAttribute('data-segment-id', s.id.toString());

    this.lastSegmentId = Math.max(this.lastSegmentId, s.id);
    let content;
    if (s.children.length == 0) {
      content = document.createElement('span');
      content.innerText = s.text;
    } else {
      content = document.createElement('div');
      content.className = 'segment-container';

      for (const segment of s.children) {
        this.parseSegment(ct, content, segment);
      }
    }

    const portal = new ComponentPortal(TagComponent);
    const portalHost = new DomPortalHost(
      divSegment,
      this.resolver,
      this.appRef,
      this.injector
    );

    const ref = portalHost.attachComponentPortal(portal);
    const tag = this.findTagByFeatures(ct, s.features);

    if (tag == null) {
      content.setAttribute('data-segment-id', s.id.toString());
      el.appendChild(content);
      return;
    }

    console.log('Setting tag to ', tag);

    const element: ComponentRef<TagComponent> = ref;
    element.instance.setContent(content);
    element.instance.setTag(tag);
    element.instance.setDocument(this.document);

    el.appendChild(divSegment);
  }
}
