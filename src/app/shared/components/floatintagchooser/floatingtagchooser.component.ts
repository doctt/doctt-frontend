import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { TreeFile } from 'Models/tree/Tree';
import { TreeService } from 'Services/tree/Tree';
import { TreeColorizer } from 'Services/tree/TreeColorizer';
import { ColorizedNode, ColorizedUtilities } from 'Models/tree/ColorizedTree';
import { IconColorDirective } from 'Directives/iconcolor/iconcolor.directive';
import { Tag } from 'Models/tag/Tag';


@Component({
    selector: 'doctt-floatingtagchooser',
    templateUrl: './floatingtagchooser.component.html',
    styleUrls: ['./floatingtagchooser.component.scss'],
    providers: [IconColorDirective]
})
export class FloatingTagChooserComponent implements OnInit {
    @ViewChild('ftc')
    private ftc: ElementRef<HTMLElement>;

    @Output() tagSelection = new EventEmitter<Tag>();

    public currentNode: ColorizedNode;

    constructor(private treeService: TreeService) {
        if (treeService.getActualTree() == null) {
            console.warn('Tree not loaded!');
        } else {
            this.load(treeService.getActualTree());
        }
    }

    private selectNode(node: ColorizedNode) {
        const features = ColorizedUtilities.getFeatures(this.currentNode);
        if (node.children == null || this.currentNode == node) {
            // Leaf
            node.parent = this.currentNode.parent;

            if (this.currentNode === node) {
                // Clicked a non leaf node, won't add himself again
            } else {
                features.push(node.name);
            }


            debugger;

            this.tagSelection.emit({
                name: node.name,
                color: node.color,
                features
            });
            return;
        }

        if (this.currentNode.parent == node) {
            // Going Up
            this.currentNode = node;
        } else {
            // Going Down
            node.parent = this.currentNode;
            this.currentNode = node;
        }
    }

    private load(tree: TreeFile) {
        this.currentNode = TreeColorizer.colorize(tree.data.root)[0];
    }

    public moveTo(x: number, y: number) {
        this.ftc.nativeElement.style.top = y + 'px';
        this.ftc.nativeElement.style.left = x + 'px';
        this.ftc.nativeElement.style.position = 'absolute';
    }

    ngOnInit(): void { }
}
