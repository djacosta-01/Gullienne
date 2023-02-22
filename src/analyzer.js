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
    //whaaaaattttttttt.....
    Statement_standalone(expression, _semi) {
      return new core.Statement(expression.rep())
    },
    //what...
    Statement_incDec() {},
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
      return new core.ReturnStatement(expression.rep())
    },
    Break(_frogOut, _semi) {
      return new core.BreakStatement()
    },
    Continue(_frogIn, _semi) {
      return new core.ContinueStatement()
    },
    ObjectHead(_object, id, _lp, params, _comma, _rp, objectBlock) {
      return new core.ObjectHeader(id.rep(), params.rep(), objectBlock.rep())
    },
    ConstructDec(_const, _lp, params, _comma, _rp, genBlock) {
      return new core.ConstructDeclaration(params.rep(), genBlock.rep())
    },
    ObjectBlock(_lc, base, constDec, methodDec, _rc) {
      return new core.ObjectBlock(base.rep(), constDec.rep(), methodDec.rep())
    },
    MethodDec(
      _do,
      _hash,
      id,
      _lp,
      params,
      _comma,
      _rp,
      _arrow,
      returnType,
      funcBlock
    ) {
      return new core.MethodDeclaration(
        id.rep(),
        params.rep(),
        returnType.rep(),
        funcBlock.rep()
      )
    },
    Base(_bayes, id, _at, expression, _semi) {
      return new core.Base(id.rep(), expression.rep())
    },
    GenBlock(_lc, statements, _rc) {
      return new core.GeneralBlock(statements.rep())
    },
    RealParam(id, _colon, type) {
      return new core.RealParameter(id.rep(), type.rep())
    },
    DecParam(params) {
      if (params == "/") {
        return "/"
      } else {
        return new core.DeclarationParameter(params.rep())
      }
    },
    CallArg_kwarg(id, _colon, expression) {
      return new core.CallArgument(id.rep(), expression.rep())
    },
    CallArg_parg(expression) {
      return new core.CallArgument(null, expression.rep())
    },
    ListLit(_lbrac, expression, _comma, _rbrac) {
      return new core.ListLiteral(expression.rep())
    },
    SetLit(_lab, expression, _comma, _rab) {
      return new core.SetLiteral(expression.rep())
    },
    MapLit(_ldab, keyValue, _comma, _rdab) {
      return new core.SetLiteral(keyValue.rep())
    },
    KeyValue(expression1, _dcolon, expression2) {
      return new core.KeyValue(expression1.rep(), expression2.rep())
    },
    ExpFull_joolOr(left, _op, right) {
      return new core.BinaryExpression(left.rep(), "|", right.rep())
    },
    Exp8_joolAnd(left, _op, right) {
      return new core.BinaryExpression(left.rep(), "&", right.rep())
    },
    Exp7_eqNeq(left, _op, right) {
      if (_op == "=") {
        return new core.BinaryExpression(left.rep(), "=", right.rep())
      } else {
        return new core.BinaryExpression(left.rep(), "!=", right.rep())
      }
    },
    Exp6_glte(left, _op, right) {
      if (_op == "<=") {
        return new core.BinaryExpression(left.rep(), "<=", right.rep())
      } else if (_op == ">=") {
        return new core.BinaryExpression(left.rep(), ">=", right.rep())
      } else if (_op == "<") {
        return new core.BinaryExpression(left.rep(), "<", right.rep())
      } else {
        return new core.BinaryExpression(left.rep(), ">", right.rep())
      }
    },
    Exp5_addDubUnionInter(left, _op, right) {
      if (_op == "+") {
        return new core.BinaryExpression(left.rep(), "+", right.rep())
      } else if (_op == "-") {
        return new core.BinaryExpression(left.rep(), "-", right.rep())
      } else if (_op == "union") {
        return new core.BinaryExpression(left.rep(), "union", right.rep())
      } else {
        return new core.BinaryExpression(left.rep(), "intersect", right.rep())
      }
    },
    Exp4_mulDivRem(left, _op, right) {
      if (_op == "*") {
        return new core.BinaryExpression(left.rep(), "*", right.rep())
      } else if (_op == "/") {
        return new core.BinaryExpression(left.rep(), "/", right.rep())
      } else {
        return new core.BinaryExpression(left.rep(), "%", right.rep())
      }
    },
    Exp3_expo(left, _op, right) {
      return new core.BinaryExpression(left.rep(), "^", right.rep())
    },
    Exp3_neg(_op, right) {
      if (_op == "-") {
        return new core.UnaryExpression("-", right.rep())
      } else {
        return new core.UnaryExpression("!", right.rep())
      }
    },
    Exp2_listInd(subscriptee, _lbrac, argument, _rbrac) {
      return new core.SubscriptExpression(subscriptee.rep(), argument.rep())
    },
    Exp2_mapInd(subscriptee, _ldab, argument, _rdab) {
      return new core.SubscriptExpression(subscriptee.rep(), argument.rep())
    },
    Exp2_setInd(subscriptee, _lab, argument, _rab) {
      return new core.SubscriptExpression(subscriptee.rep(), argument.rep())
    },
    Exp2_functCall(expression, _lp, argument, _comma, _rp) {
      return new core.Call(expression.rep(), argument.rep())
    },
    Exp2_objField(expression, _dot, id) {
      return new core.FieldExpression(expression.rep(), id.rep())
    },
    Exp2_objMethod(expression, _dot, id, _lp, argument, _comma, _rp) {
      return new core.MethodExpression(
        expression.rep(),
        id.rep(),
        argument.rep()
      )
    },
    Exp2_objMake(_make, type, _lp, argument, _comma, _rp) {
      return new core.MakeExpression(type.rep(), argument.rep())
    },
    Exp1_expr(expression) {
      return new core.Expression(expression.rep())
    },

    //Check w Julian
    id(chars) {
      return this.sourceString
    },
    Var(id) {
      return id.rep()
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

    // do this last
    IfStmt(_maybe, test, _yep, consequent, _nope, alternate, _fine) {
      return new core.IfStatement(test.rep(), consequent.rep(), alternate.rep())
    },
  })

  const match = gullienneGrammar.match(sourceCode)
  if (!match.succeeded()) error(match.message)
  return analyzer(match).rep()
}
