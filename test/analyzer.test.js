import assert from "assert"
import util from "util"
import analyze from "../src/analyzer.js"

let source = `
x : [ number | joolean | number | number | number ] @ 12; 
x : << number|string :: joolean>> @ 12;
`

describe("The AST generator", () => {
  it("produces a correct AST", () => {
    console.log(analyze(source))
  })
})
