import { GodRay } from "./core.js"

// const floatFloatType = new FunctionType([Type.FLOAT], Type.FLOAT)
// const floatFloatFloatType = new FunctionType(
//   [Type.FLOAT, Type.FLOAT],
//   Type.FLOAT
// )
// const stringToIntsType = new FunctionType(
//   [Type.STRING],
//   new ArrayType(Type.INT)
// )

export const contents = Object.freeze({
  joolean: GodRay.joolean,
  JOOLEAN: GodRay.JOOLEAN,
  string: GodRay.string,
  STRING: GodRay.STRING,
  number: GodRay.number,
  NUMBER: GodRay.NUMBER,
  //   π: new Variable("π", true, Type.FLOAT),
  //   print: new Function("print", new FunctionType([Type.ANY], Type.VOID)),
  //   sin: new Function("sin", floatFloatType),
  //   cos: new Function("cos", floatFloatType),
  //   exp: 
  new Function("exp", floatFloatType),
  //   ln: new Function("ln", floatFloatType),
  //   hypot: new Function("hypot", floatFloatFloatType),
  //   bytes: new Function("bytes", stringToIntsType),
  //   codepoints: new Function("codepoints", stringToIntsType),
})
