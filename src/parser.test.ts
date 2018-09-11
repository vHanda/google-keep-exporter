import { parse } from "./parser";
import * as fs from "fs";

describe("Parser", function() {
  test("Should parse some basic info", function() {
    var data = `
		<html><body><div class="note DEFAULT"><div class="heading">
		21 Jun 2016, 22:39:47</div>
		<div class="title">Ll</div>
		<div class="content">Hearts of darkness<br>Water ship down<br>The Dubliners<br><br></div>
		<div class="labels"><span class="label">Reading List</span><span class="label">Another Tag</span></div>
		</div></body></html>
		`;

    var note = parse(data);
    expect(note.title).toBe("Ll");
    expect(note.content).toBe(
      "Hearts of darkness\nWater ship down\nThe Dubliners"
    );
    expect(note.tags).toEqual(["Reading List", "Another Tag"]);
    expect(note.archived).toBe(false);
    expect(note.date).toBe("2016-06-21T22:39:47.000Z");
  });

  test("Should parse lists", function() {
    var data = fs.readFileSync(__dirname + "/test_data/lists.html").toString();
    var note = parse(data);

    expect(note.title).toBe("Problems");
    expect(note.content).toBe(
      "* How. It's like.\n" + "* So so tired.\n" + "* Wake up in water"
    );
    expect(note.archived).toBe(true);
  });

  test("Should parse todo lists", function() {
    var data = fs
      .readFileSync(__dirname + "/test_data/lists_todo.html")
      .toString();
    var note = parse(data);

    expect(note.content).toBe("[ ] Localization\n" + "[x] Tablets screeshots");
  });
});
