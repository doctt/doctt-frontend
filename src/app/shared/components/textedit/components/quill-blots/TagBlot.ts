import Quill from 'quill';
import { MatChip } from '@angular/material';
import { ComponentFactoryResolver, ViewChild, ElementRef, ApplicationRef, NgZone, Injector } from '@angular/core';
import { ComponentRef } from '@angular/core/src/render3';
import { InjectorTypeWithProviders } from '@angular/core/src/di/defs';

const Inline = Quill.import('blots/inline');

class TagBlot extends Inline {
    @ViewChild('tag') tag : ElementRef;
    compRef: ComponentRef<MatChip>;


    private value : String;

    constructor(private injector: Injector,
        private resolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private zone: NgZone){
            super();
            console.log(injector);
        }

    static create(value : any) {
        let node = super.create();

        if(value === true){
            console.log(value);
        }

        
        const compFactory = this.resolver.resolveComponentFactory(MatChip);
        this.compRef = compFactory.create(this.injector);
        this.appRef.attachView(this.compRef.hostView);

        node.appendChild(this.compRef.location.nativeElement);

        // Sanitize url value if desired
        node.setAttribute('href', value);
        // Okay to set other non-format related attributes
        // These are invisible to Parchment so must be static
        node.setAttribute('target', '_blank');
        return node;
    }

    static formats(node : any) {
        // We will only be called with a node already
        // determined to be a Link blot, so we do
        // not need to check ourselves
        return node.getAttribute('href');
    }
}

TagBlot.blotName = 'tag';
TagBlot.className = 'tag-element';
TagBlot.tagName = 'tag';

export default TagBlot;