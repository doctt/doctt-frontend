import { Component, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from "@angular/core";
import { MatChip, MatChipBase } from "@angular/material";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: "factory-component",
  template: "<button (click)=\"addItem()\">Add</button>",
  entryComponents: [FooterComponent]
})
export class MatChipFactory {
    private componentFactory: ComponentFactory<any>;
  constructor(
    private viewContainerRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) {
      this.componentFactory = this.resolver.resolveComponentFactory(FooterComponent);
      this.addItem();

      console.log(this.viewContainerRef);
  }

  addItem() {
      console.log("Creating component...");
      this.viewContainerRef.createComponent(this.componentFactory, 0);
  }
}
