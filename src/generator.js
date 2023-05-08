import util from "util"
import * as core from "./core.js"

export default function generate(program) {
  const output = []

  // const targetName = ((mapping) => {
  //   return (entity) => {
  //     if (!mapping.has(entity)) {
  //       mapping.set(entity, mapping.size + 1)
  //     }
  //     return `${
  //       entity?.source?._contents ??
  //       entity?.id ??
  //       entity.name ??
  //       entity.description
  //     }_${mapping.get(entity)}`
  //   }
  // })(new Map())

  function gen(node) {
    // console.log("NOOOOOODE", node.constructor)
    return generators[node.constructor.name](node)
  }

  // const opMap = new Map([["@", "="]])
  // let constructorFunction = false

  const generators = {
    // everything needed to initialize the file
    Program(p) {
      //   console.log("--------> IN GENERATOR: \n", p)
      // console.log('P STATEMENTS: ', p.statements.constructor)
      // gen(p.statements)
      p.statements.map(gen)
      // console.log("in generator: ", p)
    },

    // ExpressionStatement(e) {
    //   gen(e.expression)
    // },

    // IncDecStatement(i) {
    //   if (i.operator === "++") {
    //     output.push(`${gen(s.variable)}++`)
    //   } else {
    //     output.push(`${gen(s.variable)}--`)
    //   }
    // },

    VariableDeclaration(v) {
      let expressionString = gen(v.initializer)
      //   console.log("********", util.inspect(v.initializer))
      //constants not recognized yet
      // output.push(
      //   `${v.isConst ? "const" : "let"} ${v.id.lexeme} = ${expressionString}`
      // )
      output.push(`let ${v.id.lexeme} = ${expressionString}`)
    },

    ReassignmentStatement(r) {
      // console.log('RE MY ASS', r)
      const source = gen(r.source)
      //   console.log("SOURCEEEE", source)
      output.push(`${r.id.lexeme} = ${source}`)
    },

    // ReassignmentMyStatement(r) {
    //   //   console.log(" -------> RE MY ASS", r)
    //   const source = gen(r.source)

    //   output.push(`this.${r.fieldId.lexeme} = ${source}`)
    // },

    // FunctionDeclaration(f) {
    //   output.push(`do ${gen(f.id.lexeme)}(${gen(f.params).join(", ")}) {`)
    //   gen(f.funcBlock)
    //   output.push(`}`)
    // },

    // FunctionBlock(f) {
    //   // base??
    //   gen(f.statements)
    // },

    // ConditionIf(c) {
    //   output.push(`if (${gen(c.testExp)}) {`)
    //   gen(c.listOfButs)
    // },

    // ConditionElseIf(c) {
    //   output.push(`} else if (${gen(c.testExp)}) {`)
    //   gen(c.but)
    //   output.push("}")
    // },

    // ConditionElse(c) {
    //   output.push("} else {")
    //   gen(c.otherwise)
    //   output.push("}")
    // },

    // ForLoop(f) {
    //   output.push(`for (let ${gen(f.id.lexeme)} of ${gen(f.expression)}) {`)
    //   gen(f.genBlock)
    //   output.push("}")
    // },

    // WhileLoop(w) {
    //   output.push(`while (${gen(w.expression)}) {`)
    //   gen(w.genBlock)
    //   output.push("}")
    // },

    // Return(r) {
    //   output.push(`return ${gen(r.expression)};`)
    // },

    // Break(b) {
    //   output.push("break;")
    // },

    // Continue(c) {
    //   output.push("continue;")
    // },

    // ObjectHeader(o) {
    //   output.push(`class ${gen(o.id.lexeme)} {`)
    //   output.push(
    //     `constructor ( ${gen(o.params)} ) {\n ${o.params.map((x) => {
    //       ;`this.${gen(x.id.lexeme)} = ${x.id.lexeme}`
    //     })} `.reduce((accumulator, current) => accumulator + current),
    //     ""
    //   )
    //   gen(o.ObjectBlock)
    //   output.push(`}`)
    // },

    // ConstructDeclaration(c) {
    //   output.push(`constructor ( ${gen(c.params)} ) {`)
    //   gen(c.genBlock)
    //   output.push(`}`)
    // },

    // ObjectBlock(o) {
    //   //base??
    //   gen(o.construcDec)
    //   gen(o.methodDec)
    // },

    // MethodDeclaration(m) {
    //   if (isPrivate) {
    //     output.push(`# ${gen(m.id.lexeme)}`)
    //   } else {
    //     output.output(`${gen(m.id.lexeme)}`)
    //   }
    //   output.push(`( ${gen(m.params)} ) {`)
    //   gen(m.funcBlock)
    // },

    // Base(b) {
    //   //not yet?
    // },

    // GeneralBlock(g) {
    //   gen(g.statements)
    // },

    // RealParameter(r) {
    //   output.push(`${gen(r.id.lexeme)} : ${gen(r.type)}`)
    // },

    // DeclarationParameter(d) {
    //   output.push(d.params)
    // },

    // CallArgument(c) {
    //   output.push(`${gen(c.id.lexeme)} . ${gen(c.expression)}`)
    // },

    // ListLiteral(l) {
    //   output.push(`[ ${gen(l.expression)} ]`)
    // },

    // SetLiteral(s) {
    //   //TO DO w Julian
    // },

    // MapLiteral(m) {
    //   output.push(`{ ${gen(m.keyValue)} }`)
    // },

    // KeyValue(k) {
    //   //TO DO w Julian
    // },

    BinaryExpression(b) {
      //   console.log("GEN BINARY", b)
      const op = { "=": "===", "!=": "!==", "^": "**" }[b.op] ?? b.op
      return `${gen(b.left)} ${op} ${gen(b.right)}`
    },

    UnaryExpression(u) {
      const right = gen(u.right)
      return `${u.op}${right}`
    },

    // SubscriptExpression(s) {
    //   return `${gen(s.subscriptee)}[${gen(s.argument)}]`
    // },

    // Call(c) {
    //   if (standardFunctions.has(c.expression)) {
    //     output.push(
    //       standardFunctions.get(c.expression)(gen(c.argument).join(", "))
    //     )
    //     return []
    //   }
    //   let objectString = gen(c.expression) ? gen(c.expression) : output.pop()
    //   if (c.expression instanceof PrototypeObj)
    //     output.push(`new ${objectString}(${gen(c.argument).join(", ")})`)
    //   else output.push(`${objectString}(${gen(c.argument).join(", ")})`)
    // },

    // FieldExpression(f) {
    //   output.push(`${gen(f.expression)} . ${gen(f.id.lexeme)}`)
    // },

    // MethodExpression(m) {
    //   output.push(
    //     `${gen(m.expression)} . ${gen(m.id.lexeme)} ( ${gen(m.argument)} )`
    //   )
    // },

    // MakeExpression(m) {
    //   output.push(`${gen(m.type)} ( ${gen(m.argument)} )`)
    // },

    // Expression(e) {
    //   gen(e.expression)
    // },

    // Type(t) {
    //   Console.log(`Shouldn't be in here ${t.constructor}`)
    //   return
    // },

    // TypeSum(t) {
    //   Console.log(`Shouldn't be in here ${t.constructor}`)
    //   return
    // },

    // TypeList(t) {
    //   Console.log(`Shouldn't be in here ${t.constructor}`)
    //   return
    // },

    // TypeSet(t) {
    //   Console.log(`Shouldn't be in here ${t.constructor}`)
    //   return
    // },

    // TypeMap(t) {
    //   Console.log(`Shouldn't be in here ${t.constructor}`)
    //   return
    // },
    // Array(a) {
    //   return a
    // },
    // Boolean(b) {
    //   return b
    // },
    // Number(n) {
    //   return n
    // },
    // String(s) {
    //   return s
    // },
    // GodRay(g) {
    //   return g
    // },
    TOALken(r) {
      return r.value === undefined || r.value instanceof core.VariableObj
        ? r.lexeme
        : r.value
    },
  }

  gen(program)
  return output.join("\n")
}
