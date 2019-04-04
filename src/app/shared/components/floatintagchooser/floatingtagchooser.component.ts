import { Component, OnInit } from '@angular/core';
import { TreeFile, TreeNode } from 'Models/tree/Tree';
import { TreeService } from 'Services/tree/Tree';
import { TreeColorizer } from 'Services/tree/TreeColorizer';
import { ColorizedNode } from 'Models/tree/ColorizedTree';
import { IconColorDirective } from 'Directives/iconcolor/iconcolor.directive'


@Component({
    selector: 'doctt-floatingtagchooser',
    templateUrl: './floatingtagchooser.component.html',
    styleUrls: ['./floatingtagchooser.component.scss'],
    providers: [IconColorDirective]
})
export class FloatingTagChooserComponent implements OnInit {
    
    private currentNode: ColorizedNode;
    
    constructor(private treeService: TreeService) {
        if (treeService.getActualTree() == null) {
            console.warn("Tree not loaded!");
        } else {
            this.load(treeService.getActualTree());
        }
    }

    private selectNode(node: ColorizedNode){

        if(node == this.currentNode.parent){
            this.currentNode = node;    
        } else {
            if(node.children != null &&
                 node.children.length == 1 &&
                 node.children[0].name == node.name){
                node.parent = this.currentNode;
                node.children[0].parent = this.currentNode;
                this.currentNode = node.children[0];
                return;
            }
            
            node.parent = this.currentNode;
            this.currentNode = node;
        }

        if(this.currentNode.children == null){
            // LEAF :)
        }
    }

    private load(tree: TreeFile){
        this.currentNode = TreeColorizer.colorize(tree.data.root)[0];
    }

    ngOnInit(): void { }
}
