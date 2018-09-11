import { serialize } from "./serializer";
import { Note } from "./types";

describe("Serializer", function() {
  test("Should serialize a simple note", function() {
    var note: Note = {
      content: "Test",
      title: "The Title"
    } as Note;

    var expected = `---
title: The Title
---

Test`;

    var files = serialize(note);
    expect(files.length).toBe(1);
    expect(files[0].content).toBe(expected);
  });
});
