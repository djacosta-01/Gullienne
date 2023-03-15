import ast from "./ast.js"
import optimize from "./optimizer.js"
import generate from "./generator.js"

export default function compile(source, outputType) {
  const program = ast(source)
  if (outputType === "ast") return program
  const optimized = optimize(analyzed)
  if (outputType === "optimized") return optimized
  if (outputType == "js") {
    return generate(optimized)
  }
  throw new Error("Unknown output type")
}
