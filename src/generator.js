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
    console.log("NOOOOOODE", node)
    return generators[node.constructor.name](node)
  }

  const opMap = new Map([["@", "="]])
  let constructorFunction = false

  const generators = {
    // everything needed to initialize the file
    Program(p) {
      console.log("in generator: ", p)

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
      console.log(v)
      let expressionString = gen(v.initializer)
      console.log(expressionString)
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
      output.push(`function ${gen(f.id)}(${gen(f.params).join(", ")}) {`)
      gen(f.funcBlock)
      output.push(`}`)
    },

    FunctionBlock(f) {
      // TO BE CONTINUED
    },

    ConditionIf(c) {
      // missing Else If????
      output.push(`if (${gen(c.testExp)}) {`)
      gen(c.listOfButs)
      if (c.otherwise instanceof IfStatement) {
        output.push("} else")
        gen(s.otherwise)
      } else {
        output.push("} else {")
        gen(s.otherwise)
        output.push("}")
      }
    },

    ConditionElseIf(c) {
      //
    },

    ConditionElse(c) {
      //
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
      //
    },

    ConstructDeclaration(c) {
      //
    },

    ObjectBlock(o) {
      //
    },

    MethodDeclaration(m) {
      //
    },

    Base(b) {
      //
    },

    GeneralBlock(g) {
      //
    },

    RealParameter(r) {
      //
    },

    DeclarationParameter(d) {
      //
    },

    CallArgument(c) {
      //
    },

    ListLiteral(l) {
      //
    },

    SetLiteral(s) {
      //
    },

    MapLiteral(m) {
      //
    },

    KeyValue(k) {
      //
    },

    BinaryExpression(b) {
      console.log(b)
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
      //
    },

    MethodExpression(m) {
      //
    },

    MakeExpression(m) {
      //
    },

    Expression(e) {
      //
    },

    Type(t) {
      //
    },

    TypeSum(t) {
      //
    },

    TypeList(t) {
      //
    },

    TypeSet(t) {
      //
    },

    TypeMap(t) {
      //
    },
    Array(a) {
      a.map(gen)
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
