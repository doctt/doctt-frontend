import { Injectable } from '@angular/core';

import {
  TreeFile,
  TreeContent,
  TreeNode
} from "Models/tree/tree";

interface Realisation {
  op: string;
  args: string;
}

interface Feature {
  name: string;
  // state
  realisations: Realisation[],
}

interface System {
  name: string;
  ec: string;
  features: Feature[]
}

@Injectable({
  providedIn: "root"
})
export class TreeParserService {
  private debug: boolean = false;

  
  feat2Child(features: Feature[]) : TreeNode[] {

  }


  parseRealisations(node: Element) : Realisation[] {
    let r : Array<Realisation> = [];

    let realisationNodes = node.querySelectorAll("REALISATION");
    realisationNodes.forEach((n)=>{
      r.push({
        op: n.querySelector("OP").textContent,
        args: n.querySelector("ARGS").textContent
      });
    });
    return r;
  }

  parseFeatures(node: Element) : Feature[] {
    let f : Array<Feature> = [];

    let featuresNodes = node.querySelectorAll("FEATURE");

    featuresNodes.forEach((n)=>{
      let realisations = n.querySelector("REALISATIONS");

      f.push({
        name: n.querySelector("NAME").textContent,
        realisations: (realisations !== null ? 
          this.parseRealisations(realisations) : [])
      })
    });


    return f;
  }

  parseSystem(node : Element) : System {
    return {
      name: node.querySelector("NAME").textContent,
      ec: node.querySelector("EC").textContent,
      features: this.parseFeatures(node.querySelector("FEATURES"))
    }
  }

  parseXML(doc: Document): TreeFile {
    let network = doc.querySelector("NETWORK");

    if (network.getAttribute("VERSION") != "1.1") {
      // TODO: Support more versions
      console.warn("Unsupported Tree Version!");
      return null;
    }

    let root = doc.querySelector("ROOT");
    let root_feature = root.querySelector("FEATURE");

    let rootNode: TreeNode = {
      id: root_feature.querySelector("NAME").textContent,
      name: null,
      children: []
    };

    let systems = doc.querySelector("SYSTEMS");

    let hm: Map<String, System> = new Map<String, System>();


    systems.querySelectorAll("SYSTEM").forEach((n)=>{
      let system = this.parseSystem(n);
      console.log(system);
      hm.set(system.ec, system);
    });

    let rootSystem = hm.get(rootNode.id);
    rootNode.name = rootSystem.name;

    rootNode.children = this.feat2Child(rootSystem.features);


    let tc: TreeContent = {
      root: rootNode
    };

    let treeOutput = new TreeFile(1, tc);

    console.log(hm);
    return null;
  }
}
