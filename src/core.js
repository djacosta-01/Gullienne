import util from "util"

export class TOALken {
  constructor(gType, lexeme) {
    Object.assign(this, { gType, lexeme })
  }
}
export class Program {
  constructor(statements) {
    Object.assign(this, { statements })
  }
}

export class ExpressionStatement {
  constructor(expression) {
    Object.assign(this, { expression })
  }
}

export class IncDecStatement {
  constructor(id, operator) {
    Object.assign(this, { id, operator })
  }
}

export class VariableDeclaration {
  constructor(id, type, initializer) {
    Object.assign(this, { id, type, initializer })
  }
}

export class VariableObj {
  constructor(id, type) {
    Object.assign(this, { id, type })
  }
}

export class ObjectType {
  constructor(id, fields, methods, constructs) {
    Object.assign(this, { id, fields, methods, constructs })
  }
}

export class ReassignmentStatement {
  constructor(id, source) {
    Object.assign(this, { id, source })
  }
}

export class ReassignmentMyStatement {
  constructor(fieldId, source) {
    Object.assign(this, { fieldId, source })
  }
}

export class FunctionDeclaration {
  constructor(id, params, returnType, funcBlock) {
    Object.assign(this, { id, params, returnType, funcBlock })
  }
}

export class FunctionObject {
  constructor(params, returnType, block) {
    Object.assign(this, { params, returnType, block })
  }
}

export class FunctionBlock {
  constructor(base, statements) {
    Object.assign(this, { base, statements })
  }
}

export class ConditionIf {
  constructor(testExp, genBlock, listOfButs, otherwise) {
    Object.assign(this, { testExp, genBlock, listOfButs, otherwise })
  }
}

export class ConditionElseIf {
  constructor(testExp, genBlock) {
    Object.assign(this, { testExp, genBlock })
  }
}

export class ConditionElse {
  constructor(genBlock) {
    Object.assign(this, { genBlock })
  }
}

export class ForLoop {
  constructor(id, expression, genBlock) {
    Object.assign(this, { id, expression, genBlock })
  }
}

export class WhileLoop {
  constructor(expression, genBlock) {
    Object.assign(this, { expression, genBlock })
  }
}

export class ReturnStatement {
  constructor(expression) {
    Object.assign(this, { expression })
  }
}

export class EmptyReturnStatement {
  constructor() {
    Object.assign(this, {})
  }
}

export class BreakStatement {
  constructor() {
    Object.assign(this, {})
  }
}

export class ContinueStatement {
  constructor() {
    Object.assign(this, {})
  }
}

export class ObjectHeader {
  constructor(id, params, objectBlock) {
    Object.assign(this, { id, params, objectBlock })
  }
}

export class ConstructDeclaration {
  constructor(params, genBlock) {
    Object.assign(this, { params, genBlock })
  }
}

export class ObjectBlock {
  constructor(base, construcDec, methodDec) {
    Object.assign(this, { base, construcDec, methodDec })
  }
}

export class MethodDeclaration {
  constructor(id, isPrivate, params, returnType, funcBlock) {
    Object.assign(this, { id, isPrivate, params, returnType, funcBlock })
  }
}

export class MethodBlock {
  constructor(base, statements) {
    Object.assign(this, { base, statements })
  }
}

export class ObjectObject {
  constructor(id, fields, constructors, methods) {
    Object.assign(this, { id, fields, constructors, methods })
  }
}
export class Base {
  constructor(id, expression) {
    Object.assign(this, { id, expression })
  }
}

export class GeneralBlock {
  constructor(statements) {
    Object.assign(this, { statements })
  }
}

export class RealParameter {
  constructor(id, type) {
    Object.assign(this, { id, type })
  }
}

export class DeclarationParameter {
  constructor(params) {
    Object.assign(this, { params })
  }
}

export class CallArgument {
  constructor(id, expression) {
    Object.assign(this, { id, expression })
  }
}

export class ListLiteral {
  constructor(expression) {
    Object.assign(this, { expression })
  }
}

export class SetLiteral {
  constructor(expression) {
    Object.assign(this, { expression })
  }
}

export class MapLiteral {
  constructor(keyValue) {
    Object.assign(this, { keyValue })
  }
}

export class KeyValue {
  constructor(expression1, expression2) {
    Object.assign(this, { expression1, expression2 })
  }
}

export class BinaryExpression {
  constructor(left, op, right) {
    Object.assign(this, { left, op, right })
  }
}

export class UnaryExpression {
  constructor(op, right) {
    Object.assign(this, { op, right })
  }
}

export class SubscriptExpression {
  constructor(subscriptee, argument) {
    Object.assign(this, { subscriptee, argument })
  }
}

export class Call {
  constructor(expression, argument) {
    Object.assign(this, { expression, argument })
  }
}

export class FieldExpression {
  constructor(expression, id) {
    Object.assign(this, { expression, id })
  }
}

export class MethodExpression {
  constructor(expression, id, argument) {
    Object.assign(this, { expression, id, argument })
  }
}

export class MakeExpression {
  constructor(type, argument) {
    Object.assign(this, { type, argument })
  }
}

export class Expression {
  constructor(expression) {
    Object.assign(this, { expression })
  }
}

//Supertype
export class GodRay {
  static joolean = new GodRay("joolean", false)
  static JOOLEAN = new GodRay("joolean", true)
  static string = new GodRay("string", false)
  static STRING = new GodRay("string", true)
  static number = new GodRay("number", false)
  static NUMBER = new GodRay("number", true)
  static void = new GodRay("void", true)

  constructor(typeName, readOnly) {
    Object.assign(this, { typeName, readOnly })
  }
}

export class Type {
  constructor(type) {
    Object.assign(this, { type, name: "Type" })
  }
}

export class TypeSum {
  constructor(typeList) {
    Object.assign(this, { typeList, name: "TypeSum" })
  }
}

export class TypeList {
  constructor(type) {
    Object.assign(this, { type, name: "TypeList" })
  }
}

export class TypeSet {
  constructor(type) {
    Object.assign(this, { type, name: "TypeSet" })
  }
}

export class TypeMap {
  constructor(keyType, valueType) {
    Object.assign(this, { keyType, valueType, name: "TypeMap" })
  }
}

export function error(message, entity) {
  if (entity) {
    let prefix = ""
    if (entity.source && entity.source.getLineAndColumnMessage) {
      prefix = entity.source.getLineAndColumnMessage()
    }
    throw new Error(`${prefix}${message}`)
  }
  throw new Error(message)
}

// Return a compact and pretty string representation of the node graph,
// taking care of cycles. Written here from scratch because the built-in
// inspect function, while nice, isn't nice enough. Defined properly in
// the root class prototype so that it automatically runs on console.log.
Program.prototype[util.inspect.custom] = function () {
  const tags = new Map()

  // Attach a unique integer tag to every node
  function tag(node) {
    if (tags.has(node) || typeof node !== "object" || node === null) return
    tags.set(node, tags.size + 1)
    for (const child of Object.values(node)) {
      Array.isArray(child) ? child.forEach(tag) : tag(child)
    }
  }

  function* lines() {
    function view(e) {
      if (tags.has(e)) return `#${tags.get(e)}`
      if (Array.isArray(e)) return `[${e.map(view)}]`
      return util.inspect(e)
    }
    for (let [node, id] of [...tags.entries()].sort((a, b) => a[1] - b[1])) {
      let type = node.constructor.name
      let props = Object.entries(node).map(([k, v]) => `${k}=${view(v)}`)
      yield `${String(id).padStart(4, " ")} | ${type} ${props.join(" ")}`
    }
  }

  tag(this)
  return [...lines()].join("\n")
}
