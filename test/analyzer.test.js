import assert from "assert"
import ast from "../src/ast.js"
import analyze from "../src/analyzer.js"
import * as core from "../src/core.js"

// Programs that are semantically correct
const semanticChecks = [
  ["variable declarations", "x:number @ 5;"],
  ["can use existing variable", "x:number @ 5;y:number @ x;"],
  ["variable reassignment", "x:number @ 5; x @ 6;"],
  ["list literal declaration", "x:[joolean] @ [ideal, !ideal, ideal];"],
  ["plus operator", "x:number @ 5+5;"],
  ["minus operator", "x:number @ 3-2;"],
  ["negative assignment", "x:number @ 2-3;"],
  ["list reassignment", "x:[string] @ [`hello`,`toal`]; x @ [`goodbye`];"],
  ["sum type list declaration", "x:[number|string] @ [`hello`,3];"],
  ["sum type list reassignment", "x:[number|string] @ [`hello`,3]; x @ [3,4];"],
  [
    "sum type list reassignment 2",
    "x:[number|string] @ [`hello`,3]; x @ [3,`string`];",
  ],
  [
    "sum type list reassignment 3",
    "x:[number|string] @ [`hello`,3]; x @ [`hello`,`string`];",
  ],
  [
    "sum type list reassignment 4",
    "x:[number|string] @ [`hello`,3]; x @ [1,2,3];",
  ],
  ["joolean type declaration", "x:joolean @ ideal;"],
  ["joolean type reassignment", "x:joolean @ ideal; x @ !ideal;"],
  ["number type declaration", "x:number @ 12312312123488448948948948948948;"],
  ["number type reassignment", "x:number @ 5; x @ 3;"],
  ["string type declaration", "x:string @ `heeeeey`;"],
  [
    "string type reassignment",
    "x:string @ `heeeeey`; x @ `sorry, that was a lot`;",
  ],
  ["sum types", "x:[number|joolean|string] @ [5];x@[!ideal];"],
  ["sum types 2", "x:[number|joolean|string] @ [ideal];x@[4,5,34,`hi`];"],
  ["sum types 3", "x:[number|joolean|string] @ [`hi`];x@[ideal];"],
  ["sum types 4", "x:[number|joolean|string] @ [ideal];x@[!ideal];"],
  ["sum types 5", "x:[number|joolean|string] @ [1,3,2];x@[`hiya`];"],
  ["addition to variable reassignment", "x:number @ 5;y:number @ x+5;"],
  ["nested variable reassignment", "x:number @ 5;y:number @ x; z:number @ y;"],
  [
    "big nested variable reassignment",
    "x:number @ 5;y:number @ x; z:number @ y; w:number @ z;",
  ],
  ["addition of variables", "x:number @ 5; y:number @ x; z:number @ x+y;"],
  ["self reassignment", "x:number @ 5; x @ x+5;"],
  [
    "self reassignment with variable addition",
    "x:number @ 5; y:number @ x; x @ x+y;",
  ],
  ["adding strings", "x:string @ `hi`+`hello`;"],
]

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  [
    "using an undeclared variable",
    "x @ 5;",
    /I don't know who x is, you haven't introduced us yet./,
  ],
  //   [
  //     "constants reassignment",
  //     `x:NUMBER @ 5;
  //       x @ 2 ;`,
  //     /Did you just try to reassign to a constant variable\? Nah that ain't chiefin' out./,
  //   ],
  [
    "wrong type 1",
    "x:number @ 5; x @ ideal;",
    /What\? Wait, that's not the right type, the hell are you on right now\?/,
  ],
  [
    "wrong type 2",
    "x:number @ 5; x @ `hi`;",
    /What\? Wait, that's not the right type, the hell are you on right now\?/,
  ],
  [
    "wrong type 3",
    "x:string @ `hi`; x @ ideal;",
    /What\? Wait, that's not the right type, the hell are you on right now\?/,
  ],
  [
    "wrong type 4",
    "x:string @ `hi`; x @ 5;",
    /What\? Wait, that's not the right type, the hell are you on right now\?/,
  ],
  [
    "wrong type 5",
    "x:joolean @ ideal; x @ 5;",
    /What\? Wait, that's not the right type, the hell are you on right now\?/,
  ],
  [
    "wrong type 5",
    "x:joolean @ ideal; x @ `hi`;",
    /What\? Wait, that's not the right type, the hell are you on right now\?/,
  ],
  //   [
  //     "return not in function",
  //     "howItBe 5;",
  //     /you ain't in a function big dawg, your a🍑🍑 can't ask howItBe here/,
  //   ],
  //   ["continue not in loop", "frogIn;", /You ain't in a loop big dawg/],
  //   ["break not in loop", "frogOut;", /You ain't in a loop big dawg/],
  [
    "Wrong type with sum type 1",
    "x:[joolean|string] @ [ideal]; x @ [5];",
    /What\? Wait, that's not the right type, the hell are you on right now\?/,
  ],
  [
    "Wrong type with sum type 2",
    "x:[joolean|number] @ [ideal]; x @ [`hi`];",
    /What\? Wait, that's not the right type, the hell are you on right now\?/,
  ],
  [
    "Wrong type with sum type 3",
    "x:[number|string] @ [5]; x @ [ideal];",
    /What\? Wait, that's not the right type, the hell are you on right now\?/,
  ],
  [
    "Wrong type with sum type 4",
    "x:[number|joolean] @ [5]; x @ [`string`];",
    /What\? Wait, that's not the right type, the hell are you on right now\?/,
  ],
  //   [
  //     "declaring wrong type number",
  //     "x:number @ `hi`;",
  //     /What\? Wait, that's not the right type, the hell are you on right now\?/,
  //   ],
  //   [
  //     "declaring wrong type joolean",
  //     "x:joolean @ `hi`;",
  //     /What\? Wait, that's not the right type, the hell are you on right now\?/,
  //   ],
  //   [
  //     "declaring wrong type string",
  //     "x:string @ 5;",
  //     /What\? Wait, that's not the right type, the hell are you on right now\?/,
  //   ],
  //   [
  //     "declaring with incorrect type 1",
  //     "x:dog @ 5;",
  //     /DuuuuuuUUUUDE! What even IS type dog\?!/,
  //   ],
  //   [
  //     "declaring with incorrect type 2",
  //     "x:hello @ 5;",
  //     /DuuuuuuUUUUDE! What even IS type hello\?!/,
  //   ],
  //   [
  //     "declaring with incorrect type 3",
  //     "x:iwantthistoend @ 5;",
  //     /DuuuuuuUUUUDE! What even IS type iwantthistoend\?!/,
  //   ],
]

const unimplementedFeatureErrors = [
  [
    "ExpressionStatement",
    "overheard(`oops`);",
    /I have some bad news... expression statements are unimplemented./,
  ],
  [
    "FunctionDeclaration",
    "do thisFails(bob:number) -> number {}",
    /I have some bad news... function declarations are unimplemented./,
  ],
  [
    "ConditionIf",
    "so (ideal) {overheard(`true`);}",
    /I have some bad news... if \(so\) statements are unimplemented./,
  ],
  [
    "ForLoop",
    "cap(hotChocolates in debt){}",
    /I have some bad news... for \(cap\) loops are unimplemented./,
  ],
  [
    "WhileLoop",
    "hotChocolates:joolean @ ideal; \n noCap(hotChocolates){}",
    /I have some bad news... while \(noCap\) loops are unimplemented./,
  ],
  [
    "ObjectHeader",
    "object Julian (hat:string, jacket:string) {}",
    /I have some bad news... objects are unimplemented./,
  ],
  [
    "SetLiteral",
    "oops:<number> @ <1,2,3>;",
    /I have some bad news... sets are unimplemented./,
  ],
  [
    "MapLiteral",
    "oops:<<number :: string>> @ <<1::`a`, 2::`b`>>;",
    /I have some bad news... maps are unimplemented./,
  ],
  [
    "Subscripting",
    "oops:number @ uhOh[0];",
    /I have some bad news... subscripts are unimplemented./,
  ],
  [
    "Call",
    "oops:number @ uhOh();",
    /I have some bad news... function calls are unimplemented./,
  ],
  [
    "FieldExpression",
    "oops:number @ uhOh.welp;",
    /I have some bad news... object fields are unimplemented./,
  ],
  [
    "MethodExpression",
    "oops:number @ uhOh.welp();",
    /I have some bad news... object methods are unimplemented./,
  ],
  [
    "MethodExpression",
    "oops:Julian @ imagine Julian();",
    /I have some bad news... object constructors are unimplemented./,
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
  for (const [
    scenario,
    source,
    errorMessagePattern,
  ] of unimplementedFeatureErrors) {
    it(`throws unimplemented for ${scenario}`, () => {
      //   analyze(ast(source))
      assert.throws(() => analyze(ast(source)), errorMessagePattern)
    })
  }
})
