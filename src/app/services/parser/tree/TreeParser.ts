import { Injectable } from '@angular/core';

import {
  TreeFile,
  TreeContent,
  TreeNode,
  Realisation
} from "Models/tree/tree";

interface Feature {
  name: string;
  // state
  realisations: Realisation[],
}

interface System {
  name: string;
  parent: string;
  features: Feature[]
}

@Injectable({
  providedIn: "root"
})
export class TreeParserService {
  private hm: Map<String, Array<System>>;

  hasChildrens(id: string): boolean {
    return this.hm.get(id) != undefined && this.hm.get(id).length > 0;
  }

  parseRootChildren(parent: System[]) : TreeNode[] {
    let treeNodes : TreeNode[] = [];

    for(let childSystem of parent){
      treeNodes.push(this.parseChild(childSystem));
    }

    return treeNodes;
  }

  parseChild(childSystem : System) : TreeNode {
    return {
      id: childSystem.name,
      realisations: null,
      children: this.parseChildren(childSystem)
    };
  }

  parseFeatureChildren(feature : Feature) : TreeNode[] {
    let treeNodes : TreeNode[] = [];
    if(this.hm.has(feature.name)) {
      treeNodes = this.parseRootChildren(this.hm.get(feature.name));
    }
    return treeNodes;
  }

  parseChildren(parent: System): TreeNode[] {
    let childNodes: TreeNode[] = [];

    if(this.hm.has(parent.name)){
      childNodes.push(this.parseChild(parent));
    }

    for (let feature of parent.features) {
      let children : TreeNode[];
      if(this.hm.has(feature.name)){
        children = this.parseFeatureChildren(feature);
      }

      childNodes.push({
        id: feature.name,
        realisations: feature.realisations,
        children
      });
    }

    return childNodes;
  }

  parseRealisations(node: Element): Realisation[] {
    let r: Array<Realisation> = [];

    let realisationNodes = node.querySelectorAll("REALISATION");
    realisationNodes.forEach(n => {
      r.push({
        op: n.querySelector("OP").textContent,
        args: n.querySelector("ARGS").textContent
      });
    });
    return r;
  }

  parseFeatures(node: Element): Feature[] {
    let f: Array<Feature> = [];

    let featuresNodes = node.querySelectorAll("FEATURE");

    featuresNodes.forEach(n => {
      let realisations = n.querySelector("REALISATIONS");

      f.push({
        name: n.querySelector("NAME").textContent,
        realisations:
          realisations !== null ? this.parseRealisations(realisations) : []
      });
    });

    return f;
  }

  parseSystem(node: Element): System {
    return {
      name: node.querySelector("NAME").textContent,
      parent: node.querySelector("EC").textContent,
      features: this.parseFeatures(node.querySelector("FEATURES"))
    };
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
      realisations: null,
      children: []
    };

    let systems = doc.querySelector("SYSTEMS");

    this.hm = new Map<String, Array<System>>();

    systems.querySelectorAll("SYSTEM").forEach(n => {
      let system = this.parseSystem(n);

      if (this.hm.get(system.parent) == null) {
        this.hm.set(system.parent, []);
      }
      this.hm.get(system.parent).push(system);
    });

    rootNode.children = this.parseRootChildren(this.hm.get(rootNode.id));

    let tc: TreeContent = {
      root: rootNode
    };

    let treeOutput = new TreeFile(1, tc);

    return treeOutput;
  }
}
