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

function checkInFunction(context) {
  megaCheck(
    context.functions,
    `you ain't in a function big dawg, your a🍑🍑 can't ask howItBe here`
  )
}

// function checkInVoidFunction(context) {
//   megaCheck(context.functions.returnType == "void")
// }

function checkInLoop(context) {
  megaCheck(context.isLoop, `You ain't in a loop big dawg`)
}

function checkIsObj(context) {
  megaCheck(context.objects, `Not an obj`)
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

  console.log("L Type: ", leftType.name)
  console.log("R Type: ", rightType.name)
  switch (leftType.name) {
    case core.Type.name:
      return matchType(leftType.type, rightType.type)
    case core.TypeSum.name:
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
    // switch (leftType.name) {
    //   case core.GodRay.joolean:
    //     return Boolean === rightType
    //   case core.GodRay.string:
    //     return String === rightType
    //   case core.GodRay.number:
    //     return Number === rightType
    // }
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
    core.error(`Dawg, ima level wit you, there ain't no delcaration for ${id}`)
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
    this.analyze(e.expression)
  }

  IncDecStatement(i) {
    this.analyze(i.id)
    matchType(context.get(i.id).type)
  }

  VariableDeclaration(v) {
    //console.log(v)
    //if (v.initializer)
    this.analyze(v.initializer)
    // this.analyze(v.id)
    checkIsDeclared(this, v.id.lexeme, true) //Checking if the id is NOT declared
    //console.log("---------Before analyzing, v.type is", v.type.constructor)
    this.analyze(v.type)
    //console.log("---------After analyzing, v.type is", v.type)

    //if (v.initializer) {
    matchType(v.type, v.initializer.type)
    //}

    v.variable = new core.VariableObj(v.id, v.type)
    this.addVarToScope(v.id, v.variable)
  }

  ReassignmentStatement(r) {
    checkIsDeclared(this, r.id, false)
    this.analyze(r.id)
    this.analyze(r.source)
    matchType(this.getVar(r.id).type, r.source.type)
  }

  ReassignmentMyStatement(r) {
    checkIsDeclared(this, r.id, false)
    this.analyze(r.id)
    this.analyze(r.source)
    matchType(context.getVar(r.id).type, r.source.type)
  }

  FunctionDeclaration(f) {
    this.analyze(f.id)
    //let newContext = this.makeChildContext({ functions: true })

    newContext.analyze(f.params) // types
    // e and d did this... **PLEASE check this**
    // ASK a TA
    f.params.map((param) => {
      return new core.RealParameter(param, param.type) // a friendly reminder to rename this please
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

  ReturnStatement(r) {
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
    checkInLoop(this)
  }

  Continue(c) {
    checkInLoop(this)
  }

  ObjectHeader(o) {
    this.analyze(o.id)
    //let newType = core.ObjectType(o.id, o.params, )
    //put it into context
    let newContext = this.makeChildContext({ objects: true })
    newContext.analyze(o.params)
    if (o.params.length > 0) checkParams(o.params)
    newContext.analyze(o.ObjectBlock)
  }

  ConstructDeclaration(c) {
    let newContext = this.makeChildContext({ functions: true })
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
    let newContext = this.makeChildContext({ functions: true })
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
    //console.log("-------->BEFORE analYZED: ", l)
    this.analyze(l.expression)
    //console.log("=========>AFTER ANALyzed: ", l)
    // Somebody tell the JS developer to make a .unique method...
    l.type = typeInferenceAst(
      `[${[...new Set(l.expression.map((item) => item.type.typeName))].join(
        "|"
      )}]`
    )
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
    //console.log(u)
    this.analyze(u.right)
  }

  SubscriptExpression(s) {
    //subscript paren?
    this.analyze(s.subscriptee)
    this.analyze(s.argument)
    //index out of range error
    if (subscriptee.length - 1 < argument) {
      ;`Index out of range`
    }
  }

  Call(c) {
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
    //   for (let i = slashPosition + 1; i < c.expression.params.length; i++) {
    //     for (let j = slashPosition; j < c.argument.length; j++) {
    //       if(c.expression.params[i].id === c.argument[j].id) {
    //         matchType(c.expression.params[i].type, c.argument[j].type)
    //       }
    //     }
    //   }
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
    //console.log("YEAAA, WOOOWW TOOOOOOOAAAAAAALLLLLLL: ", r)
    if (r.gType === "id") {
      r.value = this.getVar(r.lexeme)
      r.gType = r.value.type
    }
    if (r.gType === "number")
      [r.value, r.type] = [Number(r.lexeme), typeInferenceAst("number")]
    if (r.gType === "string");
    ;[r.value, r.type] = [r.lexeme, typeInferenceAst("string")]
    if (r.gType === "joolean");
    ;[r.value, r.type] = [r.lexeme === "ideal", typeInferenceAst("joolean")]
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
