import fs = require('fs');
import { TreeParserService } from "Services/parser/tree/TreeParser";
import { TreeService } from './Tree';

test('getTree', () => {
  let treeParser : TreeParserService = new TreeParserService;
  let treeService : TreeService = new TreeService(treeParser);
  let xmlfile = fs.readFileSync("resources/test/xml/layer1.xml").toString();

  let doc: Document = (new DOMParser()).parseFromString(
      xmlfile,
      "application/xml"
  );
  let parsedTree = treeParser.parseXML(doc);    

  expect(parsedTree.version).toBe(1);
  expect(parsedTree.data.root.id).toBe("clauses");
  expect(parsedTree.data.root.children.length).toBe(3);
  expect(parsedTree.data.root.children[0].id).toBe("CLAUSES-TYPE");
  expect(parsedTree.data.root.children[1].id).toBe("CLAUSES-TYPE2");
  expect(parsedTree.data.root.children[2].id).toBe("CLAUSES-TYPE3");
  expect(parsedTree.data.root.children[0].realisations).toBe(null);
  expect(parsedTree.data.root.children[0].children.length).toBe(5);
  
  localStorage.setItem("tree", JSON.stringify({tree : parsedTree}));

  expect(treeService.getActualTree()).toEqual(JSON.parse(JSON.stringify(parsedTree)));
});