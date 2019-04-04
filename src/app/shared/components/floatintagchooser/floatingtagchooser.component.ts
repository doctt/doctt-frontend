import { Component, OnInit } from '@angular/core';
import { TreeFile, TreeNode } from 'Models/tree/tree';
import { TreeService } from 'Services/tree/Tree';

interface IDataSource {
    data: TreeFile
}

@Component({
    selector: 'doctt-floatingtagchooser',
    templateUrl: './floatingtagchooser.component.html',
    styleUrls: ['./floatingtagchooser.component.scss']
})
export class FloatingTagChooserComponent implements OnInit {
    
    private currentNode: TreeNode;
    
    constructor(private treeService: TreeService) {
        if (treeService.getActualTree() == null) {
            console.warn("Tree not loaded!");
        } else {
            this.load(treeService.getActualTree());
        }
    }

    private selectNode(node: TreeNode){

        if(node == this.currentNode.parent){
            this.currentNode = node;    
        } else {

            if(node.children != null &&
                 node.children.length == 1 &&
                 node.children[0].id == node.id){
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
        this.currentNode = tree.data.root;
    }

    ngOnInit(): void { }
}
