import { test } from "node:test";
import assert from "node:assert/strict";
import { parseRoster, parseClass, parseSection, generateStudentPassword, studentCode } from "@/lib/students/roster";

test("reads the headings people actually use", () => {
  const { entries, problems } = parseRoster([
    { "Student Name": " Aarav  Sharma ", "E-mail": "Aarav@School.org", Std: "Class 6", Div: "a" },
    { Name: "Diya Patel", Email: "diya@school.org", Grade: "VII", Section: "Sec B", Password: "secret99" },
  ]);
  assert.equal(problems.length, 0);
  assert.deepEqual(entries[0], { row: 2, name: "Aarav Sharma", email: "aarav@school.org", grade: 6, section: "A" });
  assert.equal(entries[1].grade, 7);
  assert.equal(entries[1].section, "B");
  assert.equal(entries[1].password, "secret99");
});

test("every bad row is reported with its row number", () => {
  const { entries, problems } = parseRoster([
    { Name: "Ok Student", Email: "ok@school.org", Class: 6, Section: "A" },
    { Name: "", Email: "noname@school.org", Class: 6, Section: "A" },
    { Name: "Bad Email", Email: "not-an-email", Class: 6, Section: "A" },
    { Name: "Bad Class", Email: "c@school.org", Class: 14, Section: "A" },
    { Name: "Dup", Email: "OK@school.org", Class: 6, Section: "A" },
    { Name: "Short Pw", Email: "pw@school.org", Class: 6, Section: "A", Password: "123" },
  ]);
  assert.equal(entries.length, 1);
  assert.deepEqual(problems.map((p) => p.row), [3, 4, 5, 6, 7]);
  assert.match(problems[3].message, /same email as row 2/);
});

test("blank lines are ignored", () => {
  const { entries, problems } = parseRoster([{ Name: "", Email: "", Class: "" }, { Name: "A", Email: "a@b.co", Class: 6 }]);
  assert.equal(entries.length, 1);
  assert.equal(problems.length, 0);
});

test("class and section parsing", () => {
  assert.equal(parseClass("6th"), 6);
  assert.equal(parseClass("XII"), 12);
  assert.equal(parseClass("Grade 8"), 8);
  assert.equal(parseClass("13"), null);
  assert.equal(parseSection("6-C"), "C");
  assert.equal(parseSection(""), "");
  assert.equal(parseSection("Section Rose Garden"), null);
});

test("generated passwords are long enough and avoid look-alike characters", () => {
  for (let i = 0; i < 200; i++) {
    const pw = generateStudentPassword();
    assert.ok(pw.length >= 9);
    assert.doesNotMatch(pw, /[0O1lI]/);
  }
});

test("student IDs carry class and section", () => {
  assert.equal(studentCode({ id: "KTou4bjGXZgUe2EH", grade: 6, section: "b" }), "C6B-KTOU4B");
  assert.equal(studentCode({ id: "abc", grade: 7 }), "C7-ABC");
});
