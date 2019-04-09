import { Component, ElementRef, Directive, HostListener, Input, OnInit, SimpleChanges } from "@angular/core";
import { HSLColor } from "Models/hslcolor/HSLColor";

@Directive({
    selector: '[iconColor]'
})
export class IconColorDirective implements OnInit {
    @Input() iconColor : HSLColor;
    
    constructor(private el: ElementRef) {}
    
    ngOnInit(): void {
        this.el.nativeElement.style.color = this.iconColor.toCSS();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.el.nativeElement.style.color = this.iconColor.toCSS();
    }
}