import { match } from "assert"
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
    `you ain't in a function big dawg, your a🍑🍑 can't ask howItBe here`
  )
}

function checkInLoop(context) {
  megaCheck(context.isLoop, `You ain't in a loop big dawg`)
}

function checkIsObj(context) {
  megaCheck(context.isObj, `Not an obj`)
}

function checkIsDeclared(context, id, notDeclared) {
  megaCheck(
    notDeclared ? !context.checkExistence(id) : context.checkExistence(id),
    `I don't know who ${id} is, you haven't introduced us yet.`
  )
}

function matchType(leftType, rightType, isAssignment) {
  //Unhandled case: constant matching variable type
  //rework to take advantage of type fields: type, readOnly?
  //Handle objects?

  switch (leftType.type.constructor) {
    case core.TypeSum:
      return (
        matchType(leftType.type1, rightType) ||
        matchType(leftType.type2, rightType)
      )
    case core.TypeList:
    case core.TypeSet:
      return matchType(leftType.type, rightType.type)
    case core.TypeMap:
      return (
        matchType(leftType.keyType, rightType.keyType) &&
        matchType(leftType.valueType, rightType.valueType)
      )
    case core.GodRay.joolean:
    case core.GodRay.string:
    case core.GodRay.number:
      return leftType.type.constructor === rightType.type.constructor
    case core.GodRay.JOOLEAN:
    case core.GodRay.STRING:
    case core.GodRay.NUMBER:
      megaCheck(
        !isAssignment,
        `Did you just try to reassign to a constant variable? Nah that ain't chiefin' out.`
      )
      //   switch(rightType.type.constructor) {
      //     case core.GodRay.joolean:
      //         return
      //     case core.GodRay.string:
      //     case core.GodRay.number:
      //   }
      break
    default:
      megaCheck(false, `DuuuuuuUUUUDE! What even IS type ${leftType.type}?!`)
  }
}

function checkExpectedType(wanted, found, assignment, expected) {
  megaCheck(
    matchType(wanted, found, assignment),
    `What? Wait, that's not ${expected}, the hell are you on right now?`
  )
}

function expectedJoolean(expression) {
  checkExpectedType(core.GodRay.joolean, expression.type, false, "joolean")
}

function expectedIterable(expression) {
  switch (expression.type) {
    case core.TypeList:
    case core.TypeSet:
    case core.TypeMap:
    case core.GodRay.string:
    case core.GodRay.STRING:
      return
  }

  megaCheck(
    false,
    `You can't iterate over that, bro, it's gotta be a list, set, map, or string. Take your pick.`
  )
}

function expectedNumber(expression) {
  checkExpectedType(core.GodRay.number, expression.type, false, "a number")
}

function checkParams(params) {
  megaCheck(
    Set(
      params.map((p) =>
        p.constructor === core.DeclarationParameter ? p.params.id : p.id
      )
    ).size === params.length,
    "Oh my god, you duped a parameter! Blow it up. Right now."
  )
}

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
    matchType(context.get(i.id).type)
  }

  VariableDeclaration(v) {
    if (v.initializer) this.analyze(v.initializer)
    checkIsDeclared(this, v.id, true) //Checking if the id is NOT declared
    this.analyze(v.id)
    this.analyze(v.type)

    if (v.initializer) matchType(v.type, v.initializer.type)

    v.variable = new core.VariableObj(v.id, v.type)
    context.addToScope(v.id, v.variable)
  }

  ReassignmentStatement(r) {
    checkIsDeclared(this, r.id, false)
    this.analyze(r.id)
    this.analyze(r.source)
    matchType(context.getVar(r.id).type, r.source.type)
  }

  ReassignmentMyStatement(r) {
    checkIsDeclared(this, r.id, false)
    this.analyze(r.id)
    this.analyze(r.source)
    matchType(context.getVar(r.id).type, r.source.type)
  }

  FunctionDeclaration(f) {
    this.analyze(f.id)
    let newContext = this.makeChildContext({ isFunction: true })
    newContext.analyze(f.params) // types
    // e and d did this... **PLEASE check this**
    // ASK a TA
    // f.params.map((param) => {
    //   let tempestJunior = new core.VariableDeclaration( // a friendly reminder to rename this please
    //     param,
    //     param.type,
    //     param.source
    //   )
    //   matchType(tempestJunior.type, tempestJunior.source.type)
    // })
    if (f.params.length > 1) checkParams(f.params)
    newContext.analyze(f.funcBlock)
  }

  FunctionBlock(f) {
    //Check base types like reassigns
    this.analyze(f.base)
    matchType(context.getVar(f.id).type, f.source.type) // this feels wrong...oh, e and d did this
    //Analyzed in newContext in FunctionDeclaration:
    //It does not put them in LocalVars
    this.analyze(f.statements)
  }

  ConditionIf(c) {
    this.analyze(c.testExp)
    expectedJoolean(c.testExp)
    let newContext = this.makeChildContext()
    newContext.analyze(c.genBlock)
    this.analyze(c.listOfButs)
    this.analyze(c.otherwise)
  }

  ConditionElseIf(c) {
    this.analyze(c.testExp)
    expectedJoolean(c.testExp)
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
    expectedIterable(f.expression)
    newContext.analyze(f.genBlock)
  }

  WhileLoop(w) {
    this.analyze(w.expression)
    expectedJoolean(w.expression)
    let newContext = this.makeChildContext({ isLoop: true })
    newContext.analyze(w.genBlock)
  }

  Return(r) {
    checkInFunction(this)
    this.analyze(r.expression) // types
    // also want to do this method dec return typepepepep
    // also, should method and funcs even be separated?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    matchType(
      // e and d did this...**PLEASE FOR THE LOVE OF EVERYTHING CHECK THIS**
      this.FunctionDeclaration.returnType.type,
      r.expression.type
    )
  }

  Break(b) {
    checkInLoop(this)
  }

  Continue(c) {
    checkInLoop(this)
  }

  ObjectHeader(o) {
    this.analyze(o.id)
    let newContext = this.makeChildContext({ isObj: true })
    newContext.analyze(o.params) // types
    // we don't know if types need to be checked here -> they don't
    if (o.params.length > 0) checkParams(o.params)
    newContext.analyze(o.ObjectBlock)
  }

  ConstructDeclaration(c) {
    let newContext = this.makeChildContext({ isFunction: true })
    newContext.analyze(c.params) // types
    newContext.analyze(c.genBlock)
  }

  ObjectBlock(o) {
    // check base types like var reassign
    this.analyze(o.base)
    this.analyze(o.construcDec)
    this.analyze(o.methodDec)
    matchType(context.getVar(o.base.id).type, o.base.source.type) // e and did this
  }

  MethodDeclaration(m) {
    this.analyze(m.id)
    let newContext = this.makeChildContext({ isFunction: true })
    newContext.analyze(m.params) // types
    if (m.params.length > 0) checkParams(m.params)
    this.analyze(m.returnType) // new context? also types
    newContext.analyze(m.funcBlock)
  }

  Base(b) {
    // types
    this.analyze(b.id)
    this.analyze(b.expression)
    matchType(b.id.type, b.expression.type) // e and did this
  }

  GeneralBlock(g) {
    this.analyze(g.statements)
  }

  RealParameter(r) {
    this.analyze(r.id)
    this.analyze(r.type)
  }

  DeclarationParameter(d) {
    // kwarg/parg delimiter? -> should we not do this in function declaration?
    this.analyze(d.params)
  }

  CallArgument(c) {
    // check parg/kwarg -> already checking in Call
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
    //subscript paren?
    this.analyze(s.subscriptee)
    this.analyze(s.argument)
    //index out of range error
    if(subscriptee.length - 1 < argument) {
      `Index out of range`
    }
  }

  Call(c) {
    c.expression = this.analyze(c.expression)
    c.argument = this.analyze(c.argument)
    let slashPosition = 0
    for (let paramIndex = 0; paramIndex < c.expression.params.length; paramIndex++) {
      if (c.expression.params[paramIndex] === "/") {
        slashPosition = paramIndex
        break
      }
      matchType(c.argument[paramIndex], c.expression.params[paramIndex])
    }
    let kwargParams = (Array.from(c.expression.params)).slice(slashPosition + 1, c.expression.params.length)
    let kwargs = (Array.from(c.argument)).slice(slashPosition, c.argument.length)
    kwargParams.forEach((param, index) => { 
      let arg = kwargs[index]
      if(param.id === arg.id) {
        matchType(param.type, arg.type)
      }
    })
    // for (let i = slashPosition + 1; i < c.expression.params.length; i++) {
    //   for (let j = slashPosition; j < c.argument.length; j++) {
    //     if(c.expression.params[i].id === c.argument[j].id) {
    //       matchType(c.expression.params[i].type, c.argument[j].type)
    //     }
    //   }
    // }
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
    if (typeof t.type === "string") {
      t.type = this.getVar(t.type)
    }
    this.analyze(t.type)
  }

  TypeSum(t) {
    this.analyze(t.type1)
    this.analyze(t.type2)
  }

  TypeList(t) {
    //Mark this as a list of
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

export default function analyze(node) {
  const initialContext = new Context({})
  for (const [name, type] of Object.entries(stdlib.contents)) {
    initialContext.addToScope(name, type)
  }
  initialContext.analyze(node)
  return node
}
