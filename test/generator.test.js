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
        y:joolean @ !ideal;
        y @ 1;
      `,
    expected: dedent`
        let x = 1 + 1
        let y = !true
        y = 1
      `,
  },
  // {
  //   name: "if",
  //   source: `
  //       x:number @ 0;
  //       so (x = 0) {overheard(\`1\`);}
  //       so (x = 0) {overheard(\`1\`);} otherwise {overheard(2);}
  //       so (x = 0) {overheard(\`1\`);} but (x = 2) {overheard(3);}
  //       so (x = 0) {overheard(\`1\`);} but (x = 2) {overheard(3);} otherwise {overheard(4);}
  //     `,
  //   expected: dedent`
  //       let x = 0;
  //       if ((x === 0)) {
  //         console.log("1");
  //       }
  //       if ((x === 0)) {
  //         console.log(1);
  //       } else {
  //         console.log(2);
  //       }
  //       if ((x === 0)) {
  //         console.log(1);
  //       } else {
  //         if ((x === 2)) {
  //           console.log(3);
  //         }
  //       }
  //       if ((x === 0)) {
  //         console.log(1);
  //       } else
  //         if ((x === 2)) {
  //           console.log(3);
  //         } else {
  //           console.log(4);
  //         }
  //     `,
  // },
  // {
  //   name: "while",
  //   source: `
  //       x:number @ 0;
  //       noCap (x < 5) {
  //        y:number @ 0;
  //        noCap(y < 5){
  //           overheard(x*y);
  //            y @ y + 1;
  //            frogOut;
  //        }
  //        x @ x+ 1;
  //       }
  //     `,
  //   expected: dedent`
  //       let x_1 = 0;
  //       while ((x_1 < 5)) {
  //         let y_2 = 0;
  //         while ((y_2 < 5)) {
  //           console.log((x_1 * y_2));
  //           y_2 = (y_2 + 1);
  //           break;
  //         }
  //         x_1 = (x_1 + 1);
  //       }
  //     `,
  // },
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
