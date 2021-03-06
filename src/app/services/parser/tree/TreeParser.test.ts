const fs = require('fs');
import { TreeParserService } from 'Services/parser/tree/TreeParser';

test('parseTree', () => {
  const treeParser: TreeParserService = new TreeParserService();
  const xmlfile = fs.readFileSync('resources/test/xml/layer1.xml').toString();

  const doc: Document = (new DOMParser()).parseFromString(
      xmlfile,
      'application/xml'
  );
  const tree = treeParser.parseXML(doc);

  expect(tree.version).toBe(1);
  expect(tree.data.root.id).toBe('clauses');
  expect(tree.data.root.children.length).toBe(3);
  expect(tree.data.root.children[0].id).toBe('CLAUSES-TYPE');
  expect(tree.data.root.children[1].id).toBe('CLAUSES-TYPE2');
  expect(tree.data.root.children[2].id).toBe('CLAUSES-TYPE3');
  expect(tree.data.root.children[0].realisations).toBe(null);
  expect(tree.data.root.children[0].children.length).toBe(5);

});
