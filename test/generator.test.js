import assert from "node:assert/strict"
//import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
//import optimize from "../src/optimizer.js"
import generate from "../src/generator.js"
import ast from "../src/ast.js"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
  {
    name: "trivial",
    source: `
      x:number @ 1;
    `,
    expected: dedent`
      let x = 1
    `,
  },
  {
    name: "small",
    source: `
        x:number @ 1 + 1;
      `,
    expected: dedent`
        let x = 1 + 1
      `,
  },
  {
    name: "lookup",
    source: `
        x:number @ 1;
        y:number @ x;
      `,
    expected: dedent`
        let x = 1
        let y = x
      `,
  },
  {
    name: "if",
    source: `
        x:number @ 0;
        so (x = 0) {overheard(\`1\`);}
        so (x = 0) {overheard(\`1\`);} otherwise {overheard(2);}
        so (x = 0) {overheard(\`1\`);} but (x = 2) {overheard(3);}
        so (x = 0) {overheard(\`1\`);} but (x = 2) {overheard(3);} otherwise {overheard(4);}
      `,
    expected: dedent`
        let x = 0;
        if ((x === 0)) {
          console.log("1")
        }
        if ((x === 0)) {
          console.log(1)
        } else {
          console.log(2)
        }
        if ((x === 0)) {
          console.log(1)
        } else {
          if ((x === 2)) {
            console.log(3)
          }
        }
        if ((x === 0)) {
          console.log(1)
        } else
          if ((x === 2)) {
            console.log(3)
          } else {
            console.log(4)
          }
      `,
  },
  {
    name: "while",
    source: `
        x:number @ 0;
        noCap (x < 5) {
         y:number @ 0;
         noCap(y < 5){
            overheard(x*y);
             y @ y + 1;
             frogOut;
         }
         x @ x+ 1;
        }
      `,
    expected: dedent`
        let x = 0
        while ((x < 5)) {
          let y = 0
          while ((y < 5)) {
            console.log((x * y));
            y = (y + 1)
            break
          }
          x = (x + 1)
        }
      `,
  },
  {
    name: "nested lookup",
    source: `
        x:number @ 0;
        y:number @ x;
        z:number @ y;
      `,
    expected: dedent`
        let x = 0
        let y = x
        let z = y
      `,
  },
  {
    name: "deeper nested lookup",
    source: `
        x:number @ 0;
        y:number @ x;
        z:number @ y;
        w:number @ z;
      `,
    expected: dedent`
        let x = 0
        let y = x
        let z = y
        let w = z
      `,
  },
  {
    name: "addition assignment",
    source: `
        x:number @ 1 + 2;
      `,
    expected: dedent`
        let x = 1 + 2
      `,
  },
  {
    name: "addition with vars",
    source: `
        x:number @ 2;
        y:number @ x+2;
      `,
    expected: dedent`
        let x = 2
        let y = x + 2
      `,
  },
  {
    name: "full var addition",
    source: `
        x:number @ 2;
        y:number @ 3;
        z:number @ x + y;
      `,
    expected: dedent`
        let x = 2
        let y = 3
        let z = x + y
      `,
  },
  {
    name: "var assignment and addition",
    source: `
        x:number @ 2;
        y:number @ x;
        z:number @ x + y;
      `,
    expected: dedent`
        let x = 2
        let y = x
        let z = x + y
      `,
  },
  {
    name: "string declaration",
    source: `
        x:string @ \`hi\`;
      `,
    expected: dedent`
        let x = "hi"
      `,
  },
  {
    name: "string reassignment",
    source: `
        x:string @ \`hi\`;
        x @ \`hello\`;
      `,
    expected: dedent`
        let x = "hi"
        x = "hello"
      `,
  },
  {
    name: "number declaration",
    source: `
        x:number @ 2;
      `,
    expected: dedent`
        let x = 2
      `,
  },
  {
    name: "number reassignment",
    source: `
        x:number @ 2;
        x @ 5;
      `,
    expected: dedent`
        let x = 2
        x = 5
      `,
  },
  {
    name: "joolean declaration",
    source: `
        x:joolean @ ideal;
      `,
    expected: dedent`
        let x = true
      `,
  },
  {
    name: "joolean reassignment",
    source: `
        x:joolean @ ideal;
        x @ !ideal;
      `,
    expected: dedent`
        let x = true
        x = !true
      `,
  },
  {
    name: "subtraction",
    source: `
        x:number @ 5;
        y:number @ 10;
        z:number @ 10-5;
      `,
    expected: dedent`
        let x = 5
        let y = 10
        let z = 10 - 5
      `,
  },
  {
    name: "subtraction with vars",
    source: `
        x:number @ 5;
        y:number @ 10;
        z:number @ x - y;
      `,
    expected: dedent`
        let x = 5
        let y = 10
        let z = x - y
      `,
  },
  {
    name: "self reassignment",
    source: `
        x:number @ 5;
        y:number @ 10;
        x @ x + y;
      `,
    expected: dedent`
        let x = 5
        let y = 10
        x = x + y
      `,
  },
  {
    name: "operations together",
    source: `
        x:number @ 5;
        y:number @ 10;
        x @ 30 + 20 - 10;
      `,
    expected: dedent`
        let x = 5
        let y = 10
        x = 30 + 20 - 10
      `,
  },
  {
    name: "operations and variable self assignmnet",
    source: `
        x:number @ 5;
        y:number @ 10;
        x @ x + 20 + 30;
      `,
    expected: dedent`
        let x = 5
        let y = 10
        x = x + 20 + 30
      `,
  },
  {
    name: "subtraction and addition",
    source: `
        x:number @ 5;
        y:number @ 10;
        x @ 10 + 20;
        y @ 20 - 10;
      `,
    expected: dedent`
        let x = 5
        let y = 10
        x = 10 + 20
        y = 20 - 10
      `,
  },
  {
    name: "types",
    source: `
        x:number @ 5;
        y:string @ \`hi\`;
        z:joolean @ !ideal;
      `,
    expected: dedent`
        let x = 5
        let y = "hi"
        let z = !true
      `,
  },
  {
    name: "addition and subtraction with variables",
    source: `
        x:number @ 5;
        y:number @ 10;
        z:number @ 12;
        w:number @ x + y - z;
      `,
    expected: dedent`
        let x = 5
        let y = 10
        let z = 12
        let w = x + y - z
      `,
  },
  {
    name: "addition with variables",
    source: `
        x:number @ 5;
        y:number @ 10;
        z:number @ 12;
        w:number @ x + y + z;
      `,
    expected: dedent`
        let x = 5
        let y = 10
        let z = 12
        let w = x + y + z
      `,
  },
  {
    name: "addition and subtraction with variables and self assignment",
    source: `
        x:number @ 5;
        y:number @ 10;
        z:number @ x + y;
        z @ z + x + y + y + y;
      `,
    expected: dedent`
        let x = 5
        let y = 10
        let z = x + y
        z = z + x + y + y + y
      `,
  },
  {
    name: " weird whitespace",
    source: `
        x:   number @ 5;
        y: number @ 10;
        z:number    @ 12;
        w:number @   x +   y -   z;
      `,
    expected: dedent`
        let x = 5
        let y = 10
        let z = 12
        let w = x + y - z
      `,
  },
  {
    name: "big arithmetic operation",
    source: `
        x:number @ 5;
        y:number @ 10;
        z:number @ 12;
        w:number @ x + y - z+x+x+x+x+y-y-y-2+10+y-y+z+z+z+20;
      `,
    expected: dedent`
        let x = 5
        let y = 10
        let z = 12
        let w = x + y - z + x + x + x + x + y - y - y - 2 + 10 + y - y + z + z + z + 20
      `,
  },
  {
    name: "writing hello world to a variable",
    source: `
        x:string @ \`hello world\`;
      `,
    expected: dedent`
        let x = "hello world"
      `,
  },
]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const analyzed = analyze(ast(fixture.source))
      console.log(analyzed)
      const actual = generate(analyzed)
      assert.deepEqual(actual, fixture.expected)
    })
  }
})
