import {
  Injectable,
  ApplicationRef,
  Injector,
  ComponentFactoryResolver
} from "@angular/core";

import { ComponentPortal, DomPortalHost } from "@angular/cdk/portal";
import { MatChipFactory } from "../../shared/components/matchipfactory/matchipfactory.component";

@Injectable({
  providedIn: "root"
})
export class TagService {
  public revealed: boolean = false;

  // 1. Reference to our portal
  private tagPortal: ComponentPortal<MatChipFactory>;

  // 2. Reference to our Portal Host
  private portalHost: DomPortalHost;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    // 4. Create a Portal based on the MatChip component
    this.tagPortal = new ComponentPortal(MatChipFactory);

    // 5. Create a PortalHost with a custom anchor element
    /*this.portalHost = new DomPortalHost(
      document.body,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );*/
  }

  reveal() {
		// 6. Attach the Portal to the PortalHost
		if(!this.revealed){
			this.portalHost.attach(this.tagPortal);
			this.revealed = true;
		}
  }

  hide() {
    // 7. Detach the Portal from the PortalHost
    if(this.revealed){
			this.tagPortal.detach();
			this.revealed = false;
		}
  }

  setPortalHost(element: Element) {
		console.log("Setting portal host...");
		this.revealed = false;
    this.portalHost = new DomPortalHost(
      element,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );
	}
	
	add(){
		
	}
}
