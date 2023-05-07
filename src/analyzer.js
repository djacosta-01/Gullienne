import { match } from "assert"
import fs from "fs"
import * as ohm from "ohm-js"
import * as core from "./core.js"
import * as stdlib from "./stdlib.js"
import { typeInferenceAst } from "./ast.js"
import { stringify } from "querystring"

const grammar = ohm.grammar(fs.readFileSync("src/gullienne.ohm"))
const typeInference = ohm.grammar(fs.readFileSync("src/types.ohm"))

function megaCheck(condition, message, entity) {
  if (!condition) core.error(message, entity)
}

function unimplementedError(featureName) {
  megaCheck(false, `I have some bad news... ${featureName} are unimplemented.`)
}

function checkInFunction(context) {
  megaCheck(
    context.functions,
    `you ain't in a function big dawg, your a🍑🍑 can't ask howItBe here`
  )
}

function checkInLoop(context) {
  megaCheck(context.isLoop, `You ain't in a loop big dawg`)
}

function checkIsObj(context) {
  megaCheck(context.objects, `Not an obj`)
}

function checkIsDeclared(context, id, notDeclared) {
  // console.log('CONTEXT ', context)
  megaCheck(
    notDeclared ? !context.checkExistence(id) : context.checkExistence(id),
    `I don't know who ${id} is, you haven't introduced us yet.`
  )
}

function matchType(leftType, rightType, isAssignment) {
  //Unhandled case: constant matching variable type
  //rework to take advantage of type fields: type, readOnly?
  //Handle objects?
  //   console.log("\nmatchType Called")
  //   console.log("L Type: ", leftType)
  //   console.log("R Type: ", rightType)
  switch (leftType.name) {
    case core.Type.name:
      return matchType(leftType.type, rightType.type)
    case core.TypeSum.name:
      /* Checking if it is an actual sum type or a
         single type wrapped as a sum type */
      let checkSingle = (rightSide) =>
        rightSide instanceof core.Type
          ? leftType.typeList
              .map((leftSide) =>
                leftSide instanceof core.Type
                  ? matchType(leftSide, rightSide)
                  : false
              )
              .contains(true)
          : leftType.typeList.includes(rightSide)

      return rightType.typeList.map(checkSingle).every((existence) => existence)
    case core.TypeList.name:
    case core.TypeSet.name:
      return matchType(leftType.type, rightType.type)
    case core.TypeMap.name:
      return (
        matchType(leftType.keyType, rightType.keyType) &&
        matchType(leftType.valueType, rightType.valueType)
      )
    case core.GodRay.joolean.typeName:
    case core.GodRay.string.typeName:
    case core.GodRay.number.typeName:
    case core.GodRay.JOOLEAN.typeName:
    case core.GodRay.STRING.typeName:
    case core.GodRay.NUMBER.typeName:
      if (leftType.readOnly) {
        megaCheck(
          !isAssignment,
          `Did you just try to reassign to a constant variable? Nah that ain't chiefin' out.`
        )
      }

      return leftType.typeName === rightType.typeName
    default:
      megaCheck(
        false,
        `DuuuuuuUUUUDE! What even IS type ${JSON.stringify(leftType.type)}?!`
      )
  }
}

function checkExpectedType(wanted, found, assignment, expected) {
  megaCheck(
    matchType(wanted, found, assignment),
    `What? Wait, that's not ${expected}, the hell are you on right now?`
  )
}

function checkIsNumberOrString(expression) {
  //console.log("WHAT IS HAPPNIN: ", expression.typeList.constructor)
  megaCheck(
    matchType(typeInferenceAst("string|number"), expression.type, false),
    `You can only add numbers and strings, bro.`,
    expression
  )
}

function expectedJoolean(expression) {
  megaCheck(
    matchType(typeInferenceAst("joolean"), expression.type, false),
    `You can only have jooleans here.`,
    expression
  )
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
  megaCheck(
    matchType(typeInferenceAst("number"), expression.type, false),
    `Dawg you can't have anything other than a number here.`,
    expression
  )
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
    functions = new Map(),
    objects = new Map(),
  }) {
    Object.assign(this, {
      parent,
      localVars,
      isLoop,
      functions,
      objects,
    })
  }

  checkExistence(id) {
    return this.localVars.has(id) || this.parent?.checkExistence(id)
  }

  addVarToScope(id, value) {
    this.localVars.set(id, value)
  }

  addFuncToScope(id, func) {
    this.functions.set(id, func)
  }

  addObjectToScope(id, obj) {
    this.objects.set(id, obj)
  }

  getVar(id) {
    let varInContext = this.localVars.get(id)
    if (varInContext) {
      return varInContext
    } else if (this.parent) {
      return this.parent.getVar(id)
    }
    core.error(`Dawg, ima level wit you, there ain't no declaration for ${id}`)
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
    //console.log(node.constructor.name)
    return this[node.constructor.name](node)
  }

  Program(p) {
    // console.log("before: ", p)
    this.analyze(p.statements)
    // console.log("after: ", p)
  }

  ExpressionStatement(e) {
    unimplementedError("expression statements")
    this.analyze(e.expression)
  }

  IncDecStatement(i) {
    this.analyze(i.id)
    matchType(context.get(i.id).type)
  }

  VariableDeclaration(v) {
    // console.log("VVvVVVVVVVvvVV\n ", v.initializer)
    this.analyze(v.initializer)
    // console.log("AFTERRRRRRRRRR BRRRR ", v.initializer)

    // this.analyze(v.id)
    checkIsDeclared(this, v.id.lexeme, true) //Checking if the id is NOT declared
    //console.log("---------Before analyzing, v.type is", v.type.constructor)
    this.analyze(v.type)
    //console.log("---------After analyzing, v.type is", v.type)

    matchType(v.type, v.initializer.type ?? v.initializer.value.type, true)

    v.variable = new core.VariableObj(v.id, v.type)
    this.addVarToScope(v.id.lexeme, v.variable)
  }

  ReassignmentStatement(r) {
    // console.log('GRRRRRRRRRR -----> ', r)
    // console.log('R IDDDDDD ---->: ', r.id)
    // console.log('R SOURCEEEEE ---->: ', r.source)
    checkIsDeclared(this, r.id.lexeme, false)
    this.analyze(r.id)
    this.analyze(r.source)

    console.log("R id", r.id)
    console.log("R Source", r.source)
    checkExpectedType(
      this.getVar(r.id.lexeme).type,
      r.source.type,
      true,
      "a test"
    )
    // matchType(this.getVar(r.id.lexeme).type, r.source.type, true)
  }

  ReassignmentMyStatement(r) {
    checkIsDeclared(this, r.id, false)
    this.analyze(r.id)
    this.analyze(r.source)
    matchType(context.getVar(r.id).type, r.source.type)
  }

  FunctionDeclaration(f) {
    unimplementedError("function declarations")
    this.analyze(f.id)
    //let newContext = this.makeChildContext({ functions: true })

    newContext.analyze(f.params)
    f.params.map((param) => {
      return new core.RealParameter(param, param.type)
    })
    if (f.params.length > 1) checkParams(f.params)

    let newContext = this.makeChildContext()
    newContext.analyze(f.funcBlock)
    this.addFuncToScope(
      f.id,
      new core.FunctionObject(f.params, f.returnType, f.funcBlock)
    )
  }

  FunctionBlock(f) {
    unimplementedError("function blocks")
    //Check base types like reassigns
    this.analyze(f.base)
    matchType(context.getVar(f.id).type, f.source.type) // this feels wrong...oh, e and d did this
    //Analyzed in newContext in FunctionDeclaration:
    //It does not put them in LocalVars
    this.analyze(f.statements)
  }

  ConditionIf(c) {
    unimplementedError("if (so) statements")
    this.analyze(c.testExp)
    expectedJoolean(c.testExp)
    let newContext = this.makeChildContext()
    newContext.analyze(c.genBlock)
    this.analyze(c.listOfButs)
    this.analyze(c.otherwise)
  }

  ConditionElseIf(c) {
    unimplementedError("else if (but) statements")
    this.analyze(c.testExp)
    expectedJoolean(c.testExp)
    let newContext = this.makeChildContext()
    newContext.analyze(c.genBlock)
  }

  ConditionElse(c) {
    unimplementedError("else (otherwise) statements")
    let newContext = this.makeChildContext()
    newContext.analyze(c.genBlock)
  }

  ForLoop(f) {
    unimplementedError("for (cap) loops")
    let newContext = this.makeChildContext({ isLoop: true })
    newContext.analyze(f.id)
    newContext.analyze(f.expression)
    expectedIterable(f.expression)
    newContext.analyze(f.genBlock)
  }

  WhileLoop(w) {
    unimplementedError("while (noCap) loops")
    this.analyze(w.expression)
    expectedJoolean(w.expression)
    let newContext = this.makeChildContext({ isLoop: true })
    newContext.analyze(w.genBlock)
  }

  ReturnStatement(r) {
    unimplementedError("return (howItBe) statements")
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

  EmptyReturnStatement(r) {}

  Break(b) {
    unimplementedError("break (frogOut) statements")
    checkInLoop(this)
  }

  Continue(c) {
    unimplementedError("continue (frogIn) statements")
    checkInLoop(this)
  }

  ObjectHeader(o) {
    unimplementedError("objects")
    this.analyze(o.id)
    //let newType = core.ObjectType(o.id, o.params, )
    //put it into context
    let newContext = this.makeChildContext({ objects: true })
    newContext.analyze(o.params)
    if (o.params.length > 0) checkParams(o.params)
    newContext.analyze(o.ObjectBlock)
  }

  ConstructDeclaration(c) {
    unimplementedError("object constructors")
    let newContext = this.makeChildContext({ functions: true })
    newContext.analyze(c.params) // types
    newContext.analyze(c.genBlock)
  }

  ObjectBlock(o) {
    unimplementedError("object blocks")
    // check base types like var reassign
    this.analyze(o.base)
    this.analyze(o.construcDec)
    this.analyze(o.methodDec)
    matchType(context.getVar(o.base.id).type, o.base.source.type) // e and did this
  }

  MethodDeclaration(m) {
    unimplementedError("methods")
    this.analyze(m.id)
    let newContext = this.makeChildContext({ functions: true })
    newContext.analyze(m.params) // types
    if (m.params.length > 0) checkParams(m.params)
    this.analyze(m.returnType) // new context? also types
    newContext.analyze(m.funcBlock)
  }

  Base(b) {
    // types
    unimplementedError("default (bayes) declarations")
    this.analyze(b.id)
    this.analyze(b.expression)
    matchType(b.id.type, b.expression.type) // e and did this
  }

  GeneralBlock(g) {
    unimplementedError("general code blocks")
    this.analyze(g.statements)
  }

  RealParameter(r) {
    unimplementedError("parameters")
    this.analyze(r.id)
    this.analyze(r.type)
  }

  DeclarationParameter(d) {
    unimplementedError("parameters")
    this.analyze(d.params)
  }

  CallArgument(c) {
    unimplementedError("function calls")
    this.analyze(c.id)
    this.analyze(c.expression)
  }

  ListLiteral(l) {
    // console.log("-------->BEFORE analYZED: ", l)
    this.analyze(l.expression)
    // console.log("=========>AFTER ANALyzed: ", l)
    // Somebody tell the JS developer to make a .unique method...
    l.type = typeInferenceAst(
      `[${[...new Set(l.expression.map((item) => item.gType))].join("|")}]`
    )
  }

  SetLiteral(s) {
    unimplementedError("sets")
    this.analyze(s.expression)
  }

  MapLiteral(m) {
    unimplementedError("maps")
    this.analyze(m.keyValue)
  }

  KeyValue(k) {
    unimplementedError("key-value pairs")
    this.analyze(k.expression1)
    this.analyze(k.expression2)
  }

  BinaryExpression(b) {
    // console.log('BINARY', b)
    this.analyze(b.left)
    this.analyze(b.right)
    // console.log("BINARY LEFT", b.left)
    // console.log("BINARY RIGHT", b.right)
    if (["+"].includes(b.op)) {
      //   console.log("checking isNumberOrString")
      checkIsNumberOrString(b.left)
      //   console.log("matching left and right types")
      matchType(b.left.type, b.right.type, false)
      b.type = b.left.type
    } else if (["-", "*", "/", "%", "^"].includes(b.op)) {
      expectedNumber(b.left)
      matchType(b.left.type, b.right.type, false)
      b.type = b.left.type
    } else if (["<", "<=", ">", ">="].includes(b.op)) {
      checkIsNumberOrString(b.left)
      matchType(b.left.type, b.right.type, false)
      b.type = b.left.type
    } else if (["=", "!="].includes(b.op)) {
      matchType(b.left, b.right, false)
      b.type = b.left.type
    } else if (["&", "|"].includes(b.op)) {
      expectedJoolean(b.left)
      expectedJoolean(b.right)
      b.type = b.left.type
    }
  }

  UnaryExpression(u) {
    // console.log(u.right)
    this.analyze(u.right)
    if (u.op === "-") {
      expectedNumber(u.right)
      u.type = u.right.type
      u.gType = "number"
    } else {
      expectedJoolean(u.right)
      u.type = u.right.type
      u.gType = "joolean"
    }
  }

  SubscriptExpression(s) {
    unimplementedError("subscripting")
    //subscript paren?
    this.analyze(s.subscriptee)
    this.analyze(s.argument)
    //index out of range error
    if (subscriptee.length - 1 < argument) {
      core.error(`Index out of range`)
    }
  }

  Call(c) {
    unimplementedError("function calls")
    c.expression = this.analyze(c.expression)
    c.argument = this.analyze(c.argument)
    let slashPosition = 0
    for (
      let paramIndex = 0;
      paramIndex < c.expression.params.length;
      paramIndex++
    ) {
      if (c.expression.params[paramIndex] === "/") {
        slashPosition = paramIndex
        break
      }
      matchType(c.argument[paramIndex], c.expression.params[paramIndex])
    }
    let kwargParams = c.expression.params.slice(slashPosition + 1)
    let kwargs = c.argument.slice(slashPosition)
    kwargParams.forEach((param, index) => {
      let arg = kwargs[index]
      if (param.id === arg.id) {
        matchType(param.type, arg.type)
      }
    })
  }

  FieldExpression(f) {
    unimplementedError("object fields")
    this.analyze(f.expression)
    this.analyze(f.id)
  }

  MethodExpression(m) {
    unimplementedError("object methods")
    this.analyze(m.expression)
    this.analyze(m.id)
    this.analyze(m.argument)
  }

  MakeExpression(m) {
    unimplementedError("object constructors")
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
    this.analyze(t.typeList)
  }

  TypeList(t) {
    //Mark this as a list of
    // console.log("!!!!!!!!!!!!!!! x[1,2,3] is being analyzed here")
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
  Boolean(b) {
    // console.log("BBBBBBBBBBBBB", b)
    return b
  }
  Number(n) {
    return n
  }
  String(s) {
    return s
  }
  GodRay(g) {
    return g
  }
  TOALken(r) {
    // For ids being used, not defined
    if (r.gType === "id") {
      r.value = this.getVar(r.lexeme)
      r.type = r.value.type
    }
    if (r.gType === "number") {
      ;[r.value, r.type] = [Number(r.lexeme), typeInferenceAst("number")]
    }
    if (r.gType === "string") {
      // console.log('BOOOOOOOOOOOOMMMMM', r)
      ;[r.value, r.type] = [
        r.lexeme.replaceAll("`", '"'),
        typeInferenceAst("string"),
      ]
      //   console.log("BOOOOOOOOOOOOMMMMM", r)
    }
    if (r.gType === "joolean") {
      ;[r.value, r.type] = [r.lexeme === "ideal", typeInferenceAst("joolean")]
    }
  }
}

export default function analyze(node) {
  const initialContext = new Context({})
  for (const [name, type] of Object.entries(stdlib.contents)) {
    initialContext.addVarToScope(name, type)
  }
  initialContext.analyze(node)
  //console.log(`------->In ANALYZER NODE: ${node}`)
  return node
}
