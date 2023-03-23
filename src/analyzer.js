import fs from "fs"
import * as ohm from "ohm-js"
import * as core from "./core.js"
import * as stdlib from "./stdlib.js"

const grammar = ohm.grammar(fs.readFileSync("src/gullienne.ohm"))

function megaCheck(condition, message, entity) {
  if (!condition) error(message, entity)
}

function checkInFunction(context) {
  megaCheck(
    context.isFunction,
    `you ain't in a function big dawg, your a🍑🍑 can't howItBe here`
  )
}

function checkInLoop(context) {
  megaCheck(context.isLoop, `You ain't in a loop big dawg`)
}

function checkIfObj(context) {
  megaCheck(context.isObj, `Not an obj`)
}

function checkIsDeclared(context, id) {
  megaCheck(
    context.checkExistence(id),
    `I don’t know who ${id} is, you haven’t introduced us yet.`
  )
}

// // change
// const INT = core.Type.INT
// const FLOAT = core.Type.FLOAT
// const STRING = core.Type.STRING
// const BOOLEAN = core.Type.BOOLEAN
// const ANY = core.Type.ANY
// const VOID = core.Type.VOID

class Context {
  constructor({
    parent = null,
    localVars = new Map(),
    isLoop = false,
    isFunction = false,
    isObj = false,
  }) {
    Object.assign(this, {
      parent,
      localVars,
      isLoop,
      isFunction,
      isObj,
    })
  }

  checkExistence(id) {
    return this.localVars.has(id) || this.parent?.checkExistence(id)
  }

  addToScope(id, value) {
    this.localVars.set(id, value)
  }

  getVar(id) {
    let varInContext = this.localVars.get(id)
    if (varInContext) {
      return varInContext
    } else if (parent) {
      return parent.getVar(id)
    }
    error(`Dawg, ima level wit you, there ain't no delcaration for ${id}`)
  }

  makeChildContext(props) {
    return new Context({
      ...this,
      ...props,
      parent: this,
      localVars: new Map(),
    })
  }

  analyze(node) {
    return this[node.constructor.name](node)
  }

  Program(p) {
    this.analyze(p.statements)
  }

  ExpressionStatement(e) {
    this.analyze(e.expression)
  }

  IncDecStatement(i) {
    this.analyze(i.id)
  }

  VariableDeclaration(v) {
    this.analyze(v.id)
    this.analyze(v.type)
    this.analyze(v.initializer)
  }

  ReassignmentStatement(r) {
    checkIsDeclared(this, r.id)
    this.analyze(r.id)
    this.analyze(r.source)
  }

  ReassignmentMyStatement(r) {
    this.analyze(r.id)
    this.analyze(r.source)
  }

  FunctionDeclaration(f) {
    this.analyze(f.id)
    let newContext = this.makeChildContext({ isFunction: true })
    newContext.analyze(f.params)
    newContext.analyze(f.funcBlock)
  }

  FunctionBlock(f) {
    this.analyze(f.base)
    //Analyzed in newContext in FunctionDeclaration:
    //Does analyzing these put them into localvars?
    this.analyze(f.statements)
  }

  ConditionIf(c) {
    //Should we add isConditional?
    this.analyze(c.testExp)
    //Check if testExp is bool
    let newContext = this.makeChildContext()
    newContext.analyze(c.genBlock)
    this.analyze(c.listOfButs)
    this.analyze(c.otherwise)
  }

  ConditionElseIf(c) {
    this.analyze(c.testExp)
    let newContext = this.makeChildContext()
    newContext.analyze(c.genBlock)
  }

  ConditionElse(c) {
    let newContext = this.makeChildContext()
    newContext.analyze(c.genBlock)
  }

  ForLoop(f) {
    let newContext = this.makeChildContext({ isLoop: true })
    newContext.analyze(f.id)
    newContext.analyze(f.expression)
    newContext.analyze(f.genBlock)
  }

  WhileLoop(w) {
    this.analyze(w.expression)
    // check if expression is boolean
    let newContext = this.makeChildContext({ isLoop: true })
    newContext.analyze(w.genBlock)
  }

  Return(r) {
    this.analyze(r.expression)
  }

  Break(b) {
    checkInLoop(this)
  }

  Continue(c) {
    checkInLoop(this)
  }

  ObjectHeader(o) {
    this.analyze(o.id)
    this.analyze(o.params)
    this.analyze(o.ObjectBlock)
  }

  ConstructDeclaration(c) {
    this.analyze(c.params)
    let newContext = this.makeChildContext()
    newContext.analyze(c.genBlock)
  }

  ObjectBlock(o) {
    this.analyze(o.base)
    this.analyze(o.construcDec)
    this.analyze(o.methodDec)
  }

  MethodDeclaration(m) {
    this.analyze(m.id)
    this.analyze(m.params)
    this.analyze(m.returnType)
    this.analyze(m.funcBlock)
  }

  Base(b) {
    this.analyze(b.id)
    this.analyze(b.expression)
  }

  GeneralBlock(g) {
    this.analyze(g.statements)
  }

  RealParameter(r) {
    this.analyze(r.id)
    this.analyze(r.type)
  }

  DeclarationParameter(d) {
    //! check for string here
    this.analyze(d.params)
  }

  CallArgument(c) {
    this.analyze(c.id)
    this.analyze(c.expression)
  }

  ListLiteral(l) {
    this.analyze(l.expression)
  }

  SetLiteral(s) {
    this.analyze(s.expression)
  }

  MapLiteral(m) {
    this.analyze(m.keyValue)
  }

  KeyValue(k) {
    this.analyze(k.expression1)
    this.analyze(k.expression2)
  }

  BinaryExpression(b) {
    this.analyze(b.left)
    this.analyze(b.right)
  }

  UnaryExpression(u) {
    this.analyze(u.right)
  }

  SubscriptExpression(s) {
    this.analyze(s.subscriptee)
    this.analyze(s.argument)
  }

  Call(c) {
    this.analyze(c.expression)
    this.analyze(c.argument)
  }

  FieldExpression(f) {
    this.analyze(f.expression)
    this.analyze(f.id)
  }

  MethodExpression(m) {
    this.analyze(m.expression)
    this.analyze(m.id)
    this.analyze(m.argument)
  }

  MakeExpression(m) {
    this.analyze(m.type)
    this.analyze(m.argument)
  }

  Expression(e) {
    this.analyze(e.expression)
  }

  Type(t) {
    this.analyze(t.type)
  }

  TypeSum(t) {
    this.analyze(t.type1)
    this.analyze(t.type2)
  }

  TypeList(t) {
    this.analyze(t.type)
  }

  TypeSet(t) {
    this.analyze(t.type)
  }

  TypeMap(t) {
    this.analyze(t.keyType)
    this.analyze(t.valueType)
  }
  Array(a) {
    a.forEach((item) => this.analyze(item))
  }
}
