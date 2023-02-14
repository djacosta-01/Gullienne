import assert from "assert/strict"
import fs from "fs"
import ohm from "ohm-js"

const syntaxChecks = [
  ["all numeric literal forms", "overheard(8 * 89.123);"],
  ["complex expressions", "overheard(83 * ((((-((((13 / 21)))))))) + 1 - 0);"],
  ["all unary operators", "overheard (-3); overheard (!ideal);"],
  ["all binary operators", "overheard (x & y | z * 1 / 2 ^ 3 + 4 < 5);"],
  [
    "all arithmetic operators",
    "x:number @ (!3) * 2 + 4 - (-7.3) * 8 ^ 13 / 1;",
  ],
  ["all relational operators", "x:joolean @ 1<(2<=(3=(4!=(5 >= (6>7)))));"],
  ["all logical operators", "x:joolean @ ideal & !ideal | (!ideal);"],
  ["the conditional operator", "overheard x ? y : z;"],
  ["end of program inside comment", "overheard(0); // yay"],
  ["comments with no text are ok", "overheard(1);//\noverheard(0);//"],
  ["non-Latin letters in identifiers", "コンパイラ = 100;"],
]

const syntaxErrors = [
  ["non-letter in an identifier", "ab😭c = 2", /Line 1, col 3/],
  ["malformed number", "x= 2.", /Line 1, col 6/],
  ["missing semicolon", "x = 3 y = 1", /Line 1, col 7/],
  ["a missing right operand", "overheard(5 -", /Line 1, col 10/],
  ["a non-operator", "overheard(7 * ((2 _ 3)", /Line 1, col 15/],
  ["an expression starting with a )", "x = );", /Line 1, col 5/],
  ["a statement starting with expression", "x * 5;", /Line 1, col 3/],
  ["an illegal statement on line 2", "overheard(5);\nx * 5;", /Line 2, col 3/],
  ["a statement starting with a )", "overheard(5);\n) * 5", /Line 2, col 1/],
  ["an expression starting with a *", "x = * 71;", /Line 1, col 5/],
]

describe("The grammar", () => {
  const grammar = ohm.grammar(fs.readFileSync("src/gullienne.ohm"))
  for (const [scenario, source] of syntaxChecks) {
    it(`properly specifies ${scenario}`, () => {
      assert(grammar.match(source).succeeded())
    })
  }
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    it(`does not permit ${scenario}`, () => {
      const match = grammar.match(source)
      assert(!match.succeeded())
      assert(new RegExp(errorMessagePattern).test(match.message))
    })
  }
})
