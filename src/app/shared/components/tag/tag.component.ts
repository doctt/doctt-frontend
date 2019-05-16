import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HSLColor } from 'Models/hslcolor/HSLColor';
import { ColorizedNode, ColorizedUtilities } from 'Models/tree/ColorizedTree';
import { CustomTextareaComponent } from 'Components/textedit/components/customtextarea.component';
import { Document } from 'Models/document/document';
import { DocumentService } from 'Services/document/DocumentService';
import { Tag } from 'Models/tag/Tag';

@Component({
  selector: "doctt-tag",
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  public tooltip: string;

  private element: Node;
  private tagNode: Tag;
  private document: Document;

  private og_el: Node = null;
  @ViewChild('tag') tag: ElementRef | undefined;
  @ViewChild('tagInner') content: ElementRef | undefined;

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void { }

  onClick(event: MouseEvent) {
    event.preventDefault();
    const path: any = event.composedPath();
    let path_els: Element[] = path;
    let tagInner: Element = null;
    let spanContainer: Element = null;
    let doctttag: Element = null;
    const p = document.createElement('p');
    p.innerText = '';
    const span = document.createElement('span');
    span.innerHTML = '';
    const finalspan = document.createElement('span');
    finalspan.innerHTML = '';
    for (const el of path_els) {
      if (el.className == 'tag-inner' && tagInner == null) {
        tagInner = el;
      }
      if (el.className == 'segment-container' && spanContainer == null) {
        spanContainer = el;
      }
      if (el.tagName == 'DOCTT-TAG' && doctttag == null) {
        doctttag = el;
      }
    }

    const target: Element = path_els[0];
    if (target.className == 'tag') {
      tagInner = target.children[0];
    }

    const father = spanContainer.parentElement;

    const docFragment = document.createDocumentFragment();
    const appendToDocFragment: ChildNode[] = [];

    spanContainer.childNodes.forEach((e, k, p) => {
      const child: any = e;
      const tmp: Element = child;

      if (tmp.tagName == 'SPAN') {
        appendToDocFragment.push(tmp);
      } else {
        tagInner.childNodes.forEach((e, k, p) => {
          appendToDocFragment.push(e);
        });
      }
    });

    for (const el of appendToDocFragment) {
      docFragment.append(el);
    }

    const id = Number.parseInt(spanContainer.getAttribute('data-segment-id'));
    console.log('removing id ', id);
    // CustomTextareaComponent.removeFeaturesBySegmentId(this.document, id);
    CustomTextareaComponent.removeFeaturesFromSegmentID(id, this.documentService, this.document);

    if (father != null) {
      const finalDocFragment = document.createDocumentFragment();
      father.childNodes.forEach((v, k, p) => {
        if (v !== spanContainer) {
          const child: HTMLElement = v as HTMLElement;
          const arrayToAppend: ChildNode[] = [];
          child.childNodes.forEach((i, j, k) => {
            arrayToAppend.push(i);
            // debugger;
          });
          for (const e of arrayToAppend) {
            finalDocFragment.append(e);
          }
        } else {
          finalDocFragment.append(document.createElement('br'));
          finalDocFragment.append(docFragment.children[0]);
        }
      });
      father.childNodes.forEach((v, k, p) => {
        father.removeChild(v);
      });
      father.append(finalDocFragment);
      father.removeChild(spanContainer);
    }
  }

  onMouseOver(event: MouseEvent) {
    // console.log("Mouse over tag", event);
    console.log(this.tagNode);
  }

  setContent(element: Node) {
    if (this.og_el == null) {
      this.og_el = element;
    }
    if (this.content !== undefined) {
      const nativeElement: HTMLElement = this.content.nativeElement;
      nativeElement.appendChild(element);
      this.element = element;
    }
  }

  setColor(color: HSLColor) {
    this.tag.nativeElement.style.backgroundColor = color.toCSS();
  }

  setDocument(document: Document) {
    this.document = document;
  }

  setTag(tag: Tag) {
    this.setColor(tag.color);
    this.tagNode = tag;
    this.tooltip = tag.name;
  }


  getContent(): Node {
    return this.og_el;
  }
}
