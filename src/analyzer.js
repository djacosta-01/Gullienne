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
    Reassign(id, _at, source, _semi) {
      return new core.ReassignmentStatement(id.rep(), source.rep())
    },
    FunctDec(_do, id, _lp, params, _comma, _rp, _arrow, returnType, funcBlock) {
      return new core.FunctionDeclaration(
        id.rep(),
        params.rep(),
        returnType.rep(),
        funcBlock.rep()
      )
    },
    FuncBlock(_lc, base, statements, _rc) {
      return new core.FunctionBlock(base.rep(), statements.rep())
    },
    ForLoop(_cap, _lp, id, _in, expression, _rp, genBlock) {
      return new core.ForLoop(id.rep(), expression.rep(), genBlock.rep())
    },
    WhileLoop(_noCap, _lp, expression, _rp, genBlock) {
      return new core.WhileLoop(expression.rep(), genBlock.rep())
    },
    Return(_howItBe, expression, _semi) {
      return new.core.ReturnStatement(expression.rep())
    },
    Break(_frogOut, _semi) {
      return new.core.BreakStatement()
    },
    Continue(_frogIn, _semi) {
      return new.core.ContinueStatement()
    },
    ObjectHead(_object, id, _lp, params, _comma, _rp, objectBlock) {
      return new.core.ObjectHeader(id.rep(), params.rep(), objectBlock.rep())
    },
    ConstructDec(_const, _lp, params, _comma, _rp, genBlock) {
      return new.core.ConstructDeclaration(params.rep(), genBlock.rep())
    },
    ObjectBlock(_lc, base, constDec, methodDec, _rc) {
      return new.core.ObjectBlock(base.rep(), constDec.rep(), methodDec.rep())
    },
    MethodDec(_do, _hash, id, _lp, params, _comma, _rp, _arrow, returnType, funcBlock) {
      return new.core.MethodDeclaration(id.rep(), params.rep(), returnType.rep(), funcBlock.rep())
    },
    Base(_bayes, id, _at, expression, _semi) {
      return new.core.Base(id.rep(), expression.rep())
    },
    
    // continue here
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
