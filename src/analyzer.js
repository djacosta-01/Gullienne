import fs from "fs"
import ohm from "ohm-js"
import * as core from "./core.js"

//Throw an error message
function error(message, node) {
  if (node) {
    throw new Error(`${node.source.getLineAndColumnMessage()}${message}`)
  }
  throw new Error(message)
}

const gullienneGrammar = ohm.grammar(fs.readFileSync("src/gullienne.ohm"))

export default function analyze(sourceCode) {
  const analyzer = gullienneGrammar.createSemantics().addOperation("rep", {
    Program(body) {
      return new core.Program(body.rep())
    },
    VarDec(id, _colon, type, _at, initializer, _semi) {
      return new core.VariableDeclaration(
        id.rep(),
        type.rep(),
        initializer.rep()
      )
    },
    AssignStmt(target, _eq, source, _bird) {
      return new core.AssignmentStatement(target.rep(), source.rep())
    },
    IfStmt(_maybe, test, _yep, consequent, _nope, alternate, _fine) {
      return new core.IfStatement(test.rep(), consequent.rep(), alternate.rep())
    },
    id(chars) {
      return this.sourceString
    },
    Var(id) {
      return id.rep()
    },
    Exp_add(left, _plus, right) {
      return new core.BinaryExpression("+", left.rep(), right.rep())
    },
    Exp_sub(left, _plus, right) {
      return new core.BinaryExpression("-", left.rep(), right.rep())
    },
    Term_parens(_open, expression, _close) {
      return expression.rep()
    },
    numeral(_leading, _dot, _fractional) {
      return Number(this.sourceString)
    },
    strlit(_open, chars, _close) {
      return new core.StringLiteral(chars.sourceString)
    },
    _iter(...children) {
      return children.map((child) => child.rep())
    },
  })

  const match = gullienneGrammar.match(sourceCode)
  if (!match.succeeded()) error(match.message)
  return analyzer(match).rep()
}
