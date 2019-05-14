import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { TreeFile } from 'Models/tree/Tree';
import { TreeService } from 'Services/tree/Tree';
import { TreeColorizer } from 'Services/tree/TreeColorizer';
import { ColorizedNode } from 'Models/tree/ColorizedTree';
import { IconColorDirective } from 'Directives/iconcolor/iconcolor.directive'
import { Tag } from 'Models/tag/Tag';


@Component({
    selector: 'doctt-floatingtagchooser',
    templateUrl: './floatingtagchooser.component.html',
    styleUrls: ['./floatingtagchooser.component.scss'],
    providers: [IconColorDirective]
})
export class FloatingTagChooserComponent implements OnInit {
    @ViewChild("ftc")
    private ftc : ElementRef<HTMLElement>;

    @Output() tagSelection = new EventEmitter<Tag>();
    
    private currentNode: ColorizedNode;
    
    constructor(private treeService: TreeService) {
        if (treeService.getActualTree() == null) {
            console.warn("Tree not loaded!");
        } else {
            this.load(treeService.getActualTree());
        }
    }

    private getFeatures(node: ColorizedNode) : string[] {
        let features : string[] = [];
        
        if(node == null){
            return features;
        }

        features.push(node.name);
        features.push(...this.getFeatures(node.parent));

        return features.reverse();
    }

    private selectNode(node: ColorizedNode){
        if(node.children == null || this.currentNode == node){
            // Leaf
            node.parent = this.currentNode.parent;
            this.tagSelection.emit({
                name: node.name,
                color: node.color,
                features: this.getFeatures(node)
            })
            return;
        }

        if(this.currentNode.parent == node){
            // Going Up
            this.currentNode = node;
        } else {
            // Going Down
            node.parent = this.currentNode;
            this.currentNode = node;
        }
    }

    private load(tree: TreeFile){
        this.currentNode = TreeColorizer.colorize(tree.data.root)[0];
    }

    public moveTo(x: number, y: number){
        this.ftc.nativeElement.style.top = y + "px";
        this.ftc.nativeElement.style.left = x + "px";
        this.ftc.nativeElement.style.position = 'absolute';
    }

    ngOnInit(): void { }
}
