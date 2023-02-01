import assert from "assert"
import { add } from "../src/gullienne.js"

describe("The Compiler", function () {
  it("gives the correct values for the add function", () => {
    assert.equal(add(5, 8), 13)
    assert.equal(add(5, -8), -3)
  })
})
