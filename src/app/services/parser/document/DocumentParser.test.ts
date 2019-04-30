import { DocumentParserService } from "./DocumentParser";
import { Segment, Document as DocTTDocument } from "Models/document/document";

import fs = require('fs');

test('createSegment', ()=>{
    let doc : DocumentParserService = new DocumentParserService();
    let seg : Segment = {
        id: 1,
        features: ["feat1", "feat2"],
        state: "active",
        text: "",
        children: [],
    };

    expect(doc.createSegment(["feat1", "feat2"], 1, "active", [], []))
    .toEqual(seg);
});

test('parseXML', ()=>{
    let dps: DocumentParserService = new DocumentParserService();
    let xml = fs.readFileSync("resources/test/xml/document1.xml").toString();

    let doc: Document = (new DOMParser()).parseFromString(
      xml,
      "application/xml"
    );
    
    let file = dps.parseXML(doc);
    expect(file.version).toBe(1);
    expect(file.data).toBeDefined();
    expect(file.data.header.textfile).toBe("msft/msft-1.txt");
    expect(file.data.header.lang).toBe("english");
    expect(file.data.body.segments.length).toBe(3);
    expect(file.data.body.segments[1].features)
        .toEqual(["clauses","verbal"]);
    expect(file.data.body.segments[1].state).toBe("active");
    expect(file.data.body.segments[1].text).toEqual(
      "Greetings, and welcome to the Microsoft Fiscal Year 2019 First Quarter Earnings Conference Call. As a reminder, this conference is being recorded. It is now my pleasure to introduce your host, Mike Spencer, General Manager, Investor Relations. Thank you. You may begin."
    );
});

test('parseXML2', () => {
    let dps: DocumentParserService = new DocumentParserService();
    let xml = fs.readFileSync("resources/test/xml/document2.xml").toString();

    let doc: Document = (new DOMParser()).parseFromString(xml,"application/xml"
    );

    let file = dps.parseXML(doc);
    expect(file.version).toBe(1);
    expect(file.data).toBeDefined();
    expect(file.data.header.textfile).toBe("msft/msft-1.txt");
    expect(file.data.header.lang).toBe("english");
    expect(file.data.body.segments.length).toBe(3);
    expect(file.data.body.segments[1].features)
        .toEqual(["clauses", "verbal"]);
    expect(file.data.body.segments[1].state).toBe("active");
    expect(file.data.body.segments[1].text).toEqual(
        "Greetings, and welcome to the Microsoft Fiscal Year 2019 First Quarter Earnings Conference Call. As a reminder, this conference is being recorded. It is now my pleasure to introduce your host, Mike Spencer, General Manager, Investor Relations. Thank you. You may begin."
    );
});

test('parseXML3', () => {
    let dps: DocumentParserService = new DocumentParserService();
    let xml = fs.readFileSync("resources/test/xml/document3.xml").toString();

    let doc: Document = (new DOMParser()).parseFromString(
        xml,
        "application/xml"
    );

    let file = dps.parseXML(doc);
    expect(file.version).toBe(1);
    expect(file.data).toBeDefined();
    expect(file.data.header.textfile).toBe("filename.txt");
    expect(file.data.header.lang).toBe("italian");
    expect(file.data.body.segments.length).toBe(3);
    expect(file.data.body.segments[1].children.length).toBe(3);
});
