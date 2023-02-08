import analyze from "./analyzer.js"
import optimize from "./optimizer.js"
import generate from "./generator.js"

export default function compile(source, outputType) {
  if (!["analyzed", "optimized", "js"].includes(outputType)) {
    throw new Error("Unknown output type")
  }
  const analyzed = analyze(source)
  if (outputType === "analyzed") return analyzed
  const optimized = optimize(analyzed)
  if (outputType === "optimized") return optimized
  return generate(optimized)
}
