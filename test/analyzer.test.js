import assert from "assert"
import ast from "../src/ast.js"
import analyze from "../src/analyzer.js"
import * as core from "../src/core.js"

// Programs that are semantically correct
const semanticChecks = [
  ["variable declarations", "x:number @ 5;"],
  ["can use existing variable", "x:number @ 5;y:number @ x;"],
]

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  [
    "using an undeclared variable",
    "x @ 5;",
    /I don't know who x is, you haven't introduced us yet./,
  ],
  [
    "constants reassignment",
    `x:NUMBER @ 5;
    x @ 2 ;`,
    /Did you just try to reassign to a constant variable\? Nah that ain't chiefin' out./,
  ],
]

// Test cases for expected semantic graphs after processing the AST. In general
// this suite of cases should have a test for each kind of node, including
// nodes that get rewritten as well as those that are just "passed through"
// by the analyzer. For now, we're just testing the various rewrites only.

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(ast(source)))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      //   analyze(ast(source))
      assert.throws(() => analyze(ast(source)), errorMessagePattern)
    })
  }
})
