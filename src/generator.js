export default function generate() {
  const output = []

  const targetName = ((mapping) => {
    return (entity) => {
        if (!mapping.has(entity)) {
            mapping.set(entity, mapping.size + 1)
        }
        return `${entity?.source?._contents ?? entity?.id ?? entity.name ?? entity.description}_${mapping.get(entity)}`
    }
})(new Map())

function gen(node) {
  return generators[node.constructor.name](node)
}

const opMap = new Map([
  ["@", "="],
])
let constructorFunction = false

const generators = {
  // everything needed to initialize the file
  Program(p) {
    gen(p.statements)
  },

  ExpressionStatement(e) {
    gen(e.expression)
  },

  IncDecStatement(i) {
    this.analyze(i.id)
    matchType(context.get(i.id).type)
  },

  VariableDeclaration(v) {
    let expressionString = gen(v.expression)
    output.push(`${v.isConst ? "const" : "let"} ${v.id} = ${expressionString}`)
  },

  ReassignmentStatement(r) {
    const source = gen(r.source)
    output.push(`${r.id} = ${source}`)
  },

  ReassignmentMyStatement(r) {
    const source = gen(r.source)
    output.push(`this.${r.fieldId} = ${source}`)
  },

  FunctionDeclaration(f) {
    output.push(
        `function ${gen(f.id)}(${gen(f.params).join(", ")}) {`
    )
    gen(f.funcBlock)
    output.push(`}`)    
  },

  FunctionBlock(f) {
    // TO BE CONTINUED
  },

  ConditionIf(c) {
    this.analyze(c.testExp)
    expectedJoolean(c.testExp)
    let newContext = this.makeChildContext()
    newContext.analyze(c.genBlock)
    this.analyze(c.listOfButs)
    this.analyze(c.otherwise)
  },

  ConditionElseIf(c) {
    this.analyze(c.testExp)
    expectedJoolean(c.testExp)
    let newContext = this.makeChildContext()
    newContext.analyze(c.genBlock)
  },

  ConditionElse(c) {
    let newContext = this.makeChildContext()
    newContext.analyze(c.genBlock)
  },

  ForLoop(f) {
    let newContext = this.makeChildContext({ isLoop: true })
    newContext.analyze(f.id)
    newContext.analyze(f.expression)
    expectedIterable(f.expression)
    newContext.analyze(f.genBlock)
  },

  WhileLoop(w) {
    this.analyze(w.expression)
    expectedJoolean(w.expression)
    let newContext = this.makeChildContext({ isLoop: true })
    newContext.analyze(w.genBlock)
  },

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
  },

  Break(b) {
    checkInLoop(this)
  },

  Continue(c) {
    checkInLoop(this)
  },

  ObjectHeader(o) {
    this.analyze(o.id)
    //let newType = core.ObjectType(o.id, o.params, )
    //put it into context
    let newContext = this.makeChildContext({ objects: true })
    newContext.analyze(o.params)
    if (o.params.length > 0) checkParams(o.params)
    newContext.analyze(o.ObjectBlock)
  },

  ConstructDeclaration(c) {
    let newContext = this.makeChildContext({ functions: true })
    newContext.analyze(c.params) // types
    newContext.analyze(c.genBlock)
  },

  ObjectBlock(o) {
    // check base types like var reassign
    this.analyze(o.base)
    this.analyze(o.construcDec)
    this.analyze(o.methodDec)
    matchType(context.getVar(o.base.id).type, o.base.source.type) // e and did this
  },

  MethodDeclaration(m) {
    this.analyze(m.id)
    let newContext = this.makeChildContext({ functions: true })
    newContext.analyze(m.params) // types
    if (m.params.length > 0) checkParams(m.params)
    this.analyze(m.returnType) // new context? also types
    newContext.analyze(m.funcBlock)
  },

  Base(b) {
    // types
    this.analyze(b.id)
    this.analyze(b.expression)
    matchType(b.id.type, b.expression.type) // e and did this
  },

  GeneralBlock(g) {
    this.analyze(g.statements)
  },

  RealParameter(r) {
    this.analyze(r.id)
    this.analyze(r.type)
  },

  DeclarationParameter(d) {
    // kwarg/parg delimiter? -> should we not do this in function declaration?
    this.analyze(d.params)
  },

  CallArgument(c) {
    // check parg/kwarg -> already checking in Call
    this.analyze(c.id)
    this.analyze(c.expression)
  },

  ListLiteral(l) {
    this.analyze(l.expression)
  },

  SetLiteral(s) {
    this.analyze(s.expression)
  },

  MapLiteral(m) {
    this.analyze(m.keyValue)
  },

  KeyValue(k) {
    this.analyze(k.expression1)
    this.analyze(k.expression2)
  },

  BinaryExpression(b) {
    this.analyze(b.left)
    this.analyze(b.right)
  },

  UnaryExpression(u) {
    this.analyze(u.right)
  },

  SubscriptExpression(s) {
    //subscript paren?
    this.analyze(s.subscriptee)
    this.analyze(s.argument)
    //index out of range error
    if (subscriptee.length - 1 < argument) {
      ;`Index out of range`
    }
  },

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
  },

  FieldExpression(f) {
    this.analyze(f.expression)
    this.analyze(f.id)
  },

  MethodExpression(m) {
    this.analyze(m.expression)
    this.analyze(m.id)
    this.analyze(m.argument)
  },

  MakeExpression(m) {
    this.analyze(m.type)
    this.analyze(m.argument)
  },

  Expression(e) {
    this.analyze(e.expression)
  },

  Type(t) {
    if (typeof t.type === "string") {
      t.type = this.getVar(t.type)
    }
    this.analyze(t.type)
  },

  TypeSum(t) {
    this.analyze(t.type1)
    this.analyze(t.type2)
  },

  TypeList(t) {
    //Mark this as a list of
    this.analyze(t.type)
  },

  TypeSet(t) {
    this.analyze(t.type)
  },

  TypeMap(t) {
    this.analyze(t.keyType)
    this.analyze(t.valueType)
  },
  Array(a) {
    a.forEach((item) => this.analyze(item))
  },
  Number(n) {
    return n
  },
  String(s) {
    return s
  }, 
  GodRay(g) {
    return g
  }
}
}
