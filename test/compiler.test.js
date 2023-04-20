import assert from "assert"
import util from "util"
import ast from "../src/ast.js"
import { error } from "../src/core.js"

const semanticChecks = [
  [
    "sum types",
    `x : number | string | joolean | [number | string | joolean] | <number | string | joolean> | <<number | string | joolean::number | string | joolean>>;`,
  ],
  [
    "objects",
    `object Julian (hat:string, jacket:string) {
    ~ Object default (bayesline) values, if "empty" versions are unacceptable ~
    bayes hat @ \`the classic Julian LMU cap\`;
    bayes jacket @ \`the classic Julian black and orange\`;

    ~optional constructor - ask Julian how~
    constructor (hat:string, jacket:string) {
        my.hat @ hat;
        my.jacket @ jacket;
    }

    ~methods~
    do tutor (subject:string) -> joolean {
        so (subject = \`plang\`) {
            howItBe ideal;
        } otherwise {
            howItBe !ideal;
        }
    }

    do #stopOnTime() -> joolean {
        howItBe !ideal;
    }
}

~Object instantiating with "imagine"~
winterJulian:Julian @ imagine Julian (hat:\`red and blue\`, jacket:\`black and orange\`);
j: joolean @ winterJulian.tutor(\`compilers\`);

~Object fields are read-only outside the Object.
    Object methods are public unless marked by #.~
overheard(winterJulian.jacket);
overheard(winterJulian.hat);
`,
  ],
  [
    "functions",
    `do gluStringTogether(bob:string, /, job:number, yob:number) -> string {
    bobble:number @ job + yob;
	howItBe bob + mangle(bobble, string);
}

gluStringTogether(\`No\`, job:4, yob:3);
`,
  ],
  [
    "loops",
    `bob:number @ 0;

noCap(bob < 5) {
	bob++;
    overheard(\`Number of squids on floor: \` + mangle(bob, string));
    so (ideal & (bob >= 4)) {
      frogOut;
    } but(!ideal | bob != 5) {
      frogIn;
    }
}

debt:[number] @ [2, 3, 1, 5, 3];

cap(hotChocolates in debt) {
	overheard(\`I owe you \` +
  hotChocolates +
  \` for this.\`);
}`,
  ],
  ["reassign", "x @ 5;"],
  [
    "Else If",
    `so (job = ideal) {
    overheard(\`true\`);
} but (job = !ideal) {
    overheard(\`false\`);
} otherwise {
    overheard(\`How did we get here?\`);
}`,
  ],
  [
    "Data Structures",
    `x:<<number|string::jool|number>> @ <<1::true, \`2\`::1>>;
  y:<number> @ <5,2,3>;`,
  ],
  [
    "comparators",
    `so (5 <= 2) {overheard(\`1\`);}
  so (5 >= 2) {overheard(\`2\`);}
  so (5 < 2) {overheard(\`3\`);}
  so (5 > 2) {overheard(\`4\`);}`,
  ],
  [
    "operators",
    `x:<number> @ <1,2,3> union <3,4,5>;
  y:<number> @ <1,2,3> intersect <3,4,5>;
  z:number @ 5-2;
  f:number @ 6;
  g:number @ 7;
  z @ f / g;
  z @ f % g;
  z @ f * g;
  z @ f^g * -f;`,
  ],
  [
    "indexing",
    `x:[number] @ [1,2,3,4,5];
  y:<string> @ <\`a\`,\`b\`,\`c\`>;
  z:<<number::joolean>> @ <<1::ideal, 2::!ideal, -3::ideal>>;
  f:number @ [2,3,4,5,6][1];
  overheard(y<x[0]>);
  so (z<<1>>) {overheard(\`true\`);}`,
  ],
]

const semanticErrors = [
  ["just a string", "blah"],
  ["non-letter in an identifier", "ab😭c:number @ 2;"],
  ["malformed number", "x:number @ 2.;"],
  ["missing semicolon", "x:number @ 3 y:number @ 1"],
  ["a missing right operand", "overheard(5 -"],
  ["a non-operator", "overheard(7 * ((2 _ 3)))"],
  ["an expression starting with a )", "x:number @ );"],
  ["a statement starting with expression", "x * 5;"],
  ["an illegal statement on line 2", "overheard(5);\nx * 5;"],
  ["a statement starting with a )", "overheard(5);\n) * 5"],
  ["an expression starting with a *", "x:number @ * 71;"],
]

describe("The AST generator", () => {
  console.log(ast(semanticChecks[0][1]))
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(ast(source))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => ast(source), errorMessagePattern)
    })
  }
})
describe("The core error function", () => {
  it(`Error throws with entity`, () =>
    assert.throws(() => error(`has entity`, 1)))
})
