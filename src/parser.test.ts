var assert = require("chai").assert;
import { parse } from "./parser";

suite("Parser", function() {
  test("Should parse some basic info", function() {
    var data = `
		<html><body><div class="note DEFAULT"><div class="heading">
		21 Jun 2016, 22:39:47</div>
		<div class="title">Ll</div>
		<div class="content">Hearts of darkness<br>Water ship down<br>The Dubliners<br><br></div>
		<div class="labels"><span class="label">Reading List</span><span class="label">Another Tag</span></div>
		</div></body></html>
		`;

    console.log(parse);
    var note = parse(data);
    assert.deepEqual(note.title, "Ll");
    // FIXME: Is the extra space really required?
    assert.deepEqual(
      note.content,
      "Hearts of darkness  \nWater ship down  \nThe Dubliners"
    );
    assert.deepEqual(note.tags, ["Reading List", "Another Tag"]);
    assert.notOk(note.archived);
    assert.deepEqual(note.date, "2016-06-21T20:39:47.000Z");
  });
});
