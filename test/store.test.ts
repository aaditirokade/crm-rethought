/* The rules the whole design rests on, checked in code: nothing reaches the record without a person's approval,
   record fixes save the moment they are approved, and anything drafted from Ask waits in Review. */
import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { actions, corrections, entryOf, getState, isGated, pending, tasks } from "@/components/proto/store";
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
  actions.draftFromAsk({ id: "a1", title: "Draft a note to Nora", detail: "Introduce yourself before Thursday" }, "fernhill", ["bounce"]);
  const draft = getState().custom.find((c) => c.id === "ask-a1");
  assert.ok(draft);
  assert.ok(isGated(draft), "Ask drafts are always gated");
  assert.ok(pending(getState()).some((p) => p.id === "ask-a1"));
  assert.equal(draft.text, "A note to Nora: introduce yourself before Thursday");
  actions.undraftFromAsk("a1");
  assert.ok(!getState().custom.some((c) => c.id === "ask-a1"));
});

test("a task from Ask goes to the top of Your tasks, once", () => {
  actions.addTaskFromAsk({ id: "t1", title: "Call Nora" }, "fernhill");
  actions.addTaskFromAsk({ id: "t1", title: "Call Nora" }, "fernhill");
  const list = tasks(getState());
  assert.equal(list[0].text, "Call Nora");
  assert.equal(list[0].due, "This week");
  assert.equal(list.filter((t) => t.askId === "t1").length, 1);
  actions.removeTaskFromAsk("t1");
  assert.ok(!tasks(getState()).some((t) => t.askId === "t1"));
});

test("a dismissed line can say why it was wrong, and the team sees it", () => {
  actions.dismiss("l3");
  actions.reason("l3", "Out of date");
  assert.equal(entryOf(getState(), "l3").reason, "Out of date");
  const c = corrections(getState());
  assert.equal(c.byReason.find((r) => r.reason === "Out of date")?.count, 1);
  assert.ok(c.all.some((x) => x.id === "l3"));
});

test("a reason only applies to a dismissed line, and undo clears it", () => {
  actions.reason("l1", "Wrong");
  assert.equal(entryOf(getState(), "l1").reason, undefined, "a pending line can't carry a reason");
  actions.dismiss("l1");
  actions.reason("l1", "Wrong");
  actions.undo("l1");
  assert.equal(entryOf(getState(), "l1").reason, undefined);
  assert.equal(corrections(getState()).all.length, 0);
});

test("a flagged Ask answer reaches the team, and flagging it again takes it back", () => {
  const flag = { id: "fernhill-why", question: "Why is Fernhill slipping?", reason: "Wrong source" as const, sources: ["t4821", "usage"] };
  actions.flagAnswer(flag);
  let c = corrections(getState());
  assert.equal(c.all[0].kind, "answer");
  assert.equal(c.bySource.t4821, 1);
  actions.flagAnswer(flag);
  c = corrections(getState());
  assert.equal(c.all.length, 0);
});
