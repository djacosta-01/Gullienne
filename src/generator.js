export default function generate(program) {
  const output = []

  const targetName = ((mapping) => {
    return (entity) => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1)
      }
      return `${
        entity?.source?._contents ??
        entity?.id ??
        entity.name ??
        entity.description
      }_${mapping.get(entity)}`
    }
  })(new Map())

  function gen(node) {
    //console.log("NOOOOOODE", node)
    return generators[node.constructor.name](node)
  }

  const opMap = new Map([["@", "="]])
  let constructorFunction = false

  const generators = {
    // everything needed to initialize the file
    Program(p) {
      //console.log("--------> IN GENERATOR: \n", p)

      gen(p.statements)
      // console.log("in generator: ", p)
    },

    ExpressionStatement(e) {
      gen(e.expression)
    },

    IncDecStatement(i) {
      this.analyze(i.id)
      matchType(context.get(i.id).type)
    },

    VariableDeclaration(v) {
      //console.log(v)
      let expressionString = gen(v.initializer)
      //console.log(expressionString)
      output.push(
        `${v.isConst ? "const" : "let"} ${v.id} = ${expressionString}`
      )
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
      output.push(`do ${gen(f.id)}(${gen(f.params).join(", ")}) {`)
      gen(f.funcBlock)
      output.push(`}`)
    },

    FunctionBlock(f) {
      // base??
      gen(f.statements)
    },

    ConditionIf(c) {
      output.push(`if (${gen(c.testExp)}) {`)
      gen(c.listOfButs)
    },

    ConditionElseIf(c) {
      output.push(`} else if (${gen(c.testExp)}) {`)
      gen(c.but)
      output.push("}")
    },

    ConditionElse(c) {
      output.push("} else {")
      gen(c.otherwise)
      output.push("}")
    },

    ForLoop(f) {
      output.push(`for (let ${gen(f.id)} of ${gen(f.expression)}) {`)
      gen(f.genBlock)
      output.push("}")
    },

    WhileLoop(w) {
      output.push(`while (${gen(w.expression)}) {`)
      gen(w.genBlock)
      output.push("}")
    },

    Return(r) {
      output.push(`return ${gen(r.expression)};`)
    },

    Break(b) {
      output.push("break;")
    },

    Continue(c) {
      output.push("continue;")
    },

    ObjectHeader(o) {
      output.push(`class ${gen(o.id)} {`)
      output.push(`constructor ( ${gen(o.params)} ) {\n ${o.params.map((x) => {
        `this.${gen(x.id)} = ${x.id}`
      } )} `.reduce((accumulator, current) => accumulator + current), "")
      gen(o.ObjectBlock)
      output.push(`}`)
    },

    ConstructDeclaration(c) {
      output.push(`constructor ( ${gen(c.params)} ) {`)
      gen(c.genBlock)
      output.push(`}`)
    },

    ObjectBlock(o) {
      //base??
      gen(o.construcDec)
      gen(o.methodDec)
    },

    MethodDeclaration(m) {
      if (isPrivate) {
        output.push(`# ${gen(m.id)}`)
      } else {
        output.output(`${gen(m.id)}`)
      }
      output.push(`( ${gen(m.params)} ) {`)
      gen(m.funcBlock)
    },

    Base(b) {
      //not yet?
    },

    GeneralBlock(g) {
      gen(g.statements)
    },

    RealParameter(r) {
      output.push(`${gen(r.id)} : ${gen(r.type)}`)
    },

    DeclarationParameter(d) {
      output.push(d.params)
    },

    CallArgument(c) {
      output.push(`${gen(c.id)} . ${gen(c.expression)}`)
    },

    ListLiteral(l) {
      output.push(`[ ${gen(l.expression)} ]`)
    },

    SetLiteral(s) {
      //TO DO w Julian
    },

    MapLiteral(m) {
      output.push(`{ ${gen(m.keyValue)} }`)
    },

    KeyValue(k) {
      //TO DO w Julian
    },

    BinaryExpression(b) {
      //console.log(b)
      const op = { "=": "===", "!=": "!==" }[b.op] ?? b.op
      return `${gen(b.left)} ${op} ${gen(b.right)}`
    },

    UnaryExpression(u) {
      const right = gen(u.right)
      return `${u.op}${right}`
    },

    SubscriptExpression(s) {
      return `${gen(s.subscriptee)}[${gen(s.argument)}]`
    },

    Call(c) {
      if (standardFunctions.has(c.expression)) {
        output.push(
          standardFunctions.get(c.expression)(gen(c.argument).join(", "))
        )
        return []
      }
      let objectString = gen(c.expression) ? gen(c.expression) : output.pop()
      if (c.expression instanceof PrototypeObj)
        output.push(`new ${objectString}(${gen(c.argument).join(", ")})`)
      else output.push(`${objectString}(${gen(c.argument).join(", ")})`)
    },

    FieldExpression(f) {
      output.push(`${gen(f.expression)} . ${gen(f.id)}`)
    },

    MethodExpression(m) {
      output.push(`${gen(m.expression)} . ${gen(m.id)} ( ${gen(m.argument)} )`)
    },

    MakeExpression(m) {
      output.push(`${gen(m.type)} ( ${gen(m.argument)} )`)
    },

    Expression(e) {
      gen(e.expression)
    },

    Type(t) {
      Console.log(`Shouldn't be in here ${t.constructor}`)
      return
    },

    TypeSum(t) {
      return
    },

    TypeList(t) {
      return
    },

    TypeSet(t) {
      //
    },

    TypeMap(t) {
      //
    },
    Array(a) {
      return a
    },
    Boolean(b) {
      return b
    },
    Number(n) {
      return n
    },
    String(s) {
      return s
    },
    GodRay(g) {
      return g
    },
  }

  gen(program)
  return output.join("\n")
}
