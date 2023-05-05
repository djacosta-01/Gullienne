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
  // {
  //   name: "variable declaration",
  //   source: `
  //     x:number @ 1;
  //   `,
  //   expected: dedent`
  //     let x = 1
  //   `,
  // },
  // {
  //   name: "addition",
  //   source: `
  //       x:number @ 1 + 1;
  //     `,
  //   expected: dedent`
  //       let x = 1 + 1
  //     `,
  // },
  // {
  //   name: "addition variables",
  //   source: `
  //       x:number @ 2;
  //       y:number @ 3;
  //       z:number @ x + y;
  //     `,
  //   expected: dedent`
  //       let x = 2
  //       let y = 3
  //       let z = x + y
  //     `,
  // },
  // {
  //   name: "lookup",
  //   source: `
  //       x:number @ 1;
  //       y:number @ x;
  //     `,
  //   expected: dedent`
  //       let x = 1
  //       let y = x
  //     `,
  // },
  // {
  //   name: "subtraction",
  //   source: `
  //       x:number @ 3 - 1;
  //     `,
  //   expected: dedent`
  //       let x = 3 - 1
  //     `,
  // },
  // {
  //   name: "multiplication",
  //   source: `
  //       x:number @ 6 * 6;
  //     `,
  //   expected: dedent`
  //       let x = 6 * 6
  //     `,
  // },
  // {
  //   name: "division",
  //   source: `
  //       x:number @ 10 / 2;
  //     `,
  //   expected: dedent`
  //       let x = 10 / 2
  //     `,
  // },
  // {
  //   name: "mod",
  //   source: `
  //       x:number @ 10 % 2;
  //     `,
  //   expected: dedent`
  //       let x = 10 % 2
  //     `,
  // },
  // {
  //   name: "power",
  //   source: `
  //       x:number @ 2 ^ 3;
  //     `,
  //   expected: dedent`
  //       let x = 2 ** 3
  //     `,
  // },
  // {
  //   name: "lessThan",
  //   source: `
  //       x:joolean @ 1 < 2;
  //     `,
  //   expected: dedent`
  //       let x = 1 < 2
  //     `,
  // },
  // {
  //   name: "greaterThanOrEqual",
  //   source: `
  //       x:joolean @ 1 >= 2;
  //     `,
  //   expected: dedent`
  //       let x = 1 >= 2
  //     `,
  // },
  // {
  //   name: "lessThanOrEqual",
  //   source: `
  //       x:joolean @ 1 <= 2;
  //     `,
  //   expected: dedent`
  //       let x = 1 <= 2
  //     `,
  // },
  // {
  //   name: "greaterThan",
  //   source: `
  //       x:joolean @ 3 > 2;
  //     `,
  //   expected: dedent`
  //       let x = 3 > 2
  //     `,
  // },
  {
    name: "equals",
    source: `
        x:joolean @ 2 = 2;
      `,
    expected: dedent`
        let x = 2 === 2
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
