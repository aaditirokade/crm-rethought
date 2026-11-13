/* The rules the whole design rests on, checked in code: nothing reaches the record without a person's approval,
   record fixes save the moment they are approved, and anything drafted from Ask waits in Review. */
import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { actions, entryOf, getState, isGated, pending, tasks } from "@/components/proto/store";
import { SUGGESTIONS } from "@/content/prototype";

const status = (id: string) => entryOf(getState(), id).status;

beforeEach(() => actions.reset());

test("every log line starts pending, and saving with nothing approved saves nothing", () => {
  const logs = SUGGESTIONS.filter((s) => s.kind === "log");
  assert.ok(logs.length > 0);
  actions.save();
  for (const l of logs) assert.equal(status(l.id), "pending");
  assert.match(getState().message, /Saved 0 lines/);
});

test("approving a log line does not save it; Save does", () => {
  actions.approve("l1");
  assert.equal(status("l1"), "approved");
  actions.save();
  assert.equal(status("l1"), "saved");
  assert.equal(status("l2"), "pending", "lines nobody approved stay out of the record");
});

test("a record fix saves as soon as it is approved", () => {
  actions.approve("fx1");
  assert.equal(status("fx1"), "saved");
});

test("an edit counts as an approval and keeps the person's words", () => {
  actions.edit("l2", "Price the 12 new stores separately.");
  assert.equal(status("l2"), "approved");
  assert.equal(entryOf(getState(), "l2").text, "Price the 12 new stores separately.");
});

test("dismiss, then undo, puts a line back where it was", () => {
  actions.dismiss("l3");
  assert.equal(status("l3"), "dismissed");
  actions.undo("l3");
  assert.equal(status("l3"), "pending");
});

test("a draft from Ask waits in Review until someone approves it, and can be taken back", () => {
  actions.draftFromAsk({ id: "a1", title: "Draft a note to Priya", detail: "Introduce yourself before Thursday" }, "fernhill", ["bounce"]);
  const draft = getState().custom.find((c) => c.id === "ask-a1");
  assert.ok(draft);
  assert.ok(isGated(draft), "Ask drafts are always gated");
  assert.ok(pending(getState()).some((p) => p.id === "ask-a1"));
  assert.equal(draft.text, "A note to Priya: introduce yourself before Thursday");
  actions.undraftFromAsk("a1");
  assert.ok(!getState().custom.some((c) => c.id === "ask-a1"));
});

test("a task from Ask goes to the top of Your tasks, once", () => {
  actions.addTaskFromAsk({ id: "t1", title: "Call Priya" }, "fernhill");
  actions.addTaskFromAsk({ id: "t1", title: "Call Priya" }, "fernhill");
  const list = tasks(getState());
  assert.equal(list[0].text, "Call Priya");
  assert.equal(list[0].due, "This week");
  assert.equal(list.filter((t) => t.askId === "t1").length, 1);
  actions.removeTaskFromAsk("t1");
  assert.ok(!tasks(getState()).some((t) => t.askId === "t1"));
});
