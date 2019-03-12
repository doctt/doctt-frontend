import { Component, ElementRef, Directive, HostListener, Input, OnInit } from "@angular/core";

@Directive({
    selector: '[sentence]'
})
export class SentenceDirective implements OnInit {
    @Input() highlightColor : string;
    
    constructor(private el: ElementRef) {}
    
    ngOnInit(): void {
        this.highlight(this.highlightColor);
    }

    @HostListener('mouseenter') onMouseEnter(){
        this.highlight(null);
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.highlight(this.highlightColor);
    }

    private highlight(color : String){
        if(color == null){
            this.el.nativeElement.style.backgroundColor = 'transparent';
        } else {
            this.el.nativeElement.style.backgroundColor = color;
        }
    }
}