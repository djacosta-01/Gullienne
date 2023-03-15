import fs from "fs"
import ohm from "ohm-js"
import * as core from "./core.js"

//Throw an error message
function error(message) {
  throw new Error(message)
}

const gullienneGrammar = ohm.grammar(fs.readFileSync("src/gullienne.ohm"))

const astBuilder =gullienneGrammar.createSemantics().addOperation("ast", {
  Program(body) {
    return new core.Program(body.ast())
  },
  Statement(statement) {
    return statement.ast()
  },
  Statement_standalone(expression, _semi) {
    return new core.Statement(expression.ast())
  },
  Statement_incDec(id, operator, _semi) {
    return new core.IncDecStatement(id.ast(), operator.sourceString)
  },
  VarDec(id, _colon, type, _at, initializer, _semi) {
    return new core.VariableDeclaration(
      id.ast(),
      type.ast(),
      initializer.ast()
    )
  },
  Reassign(id, _at, source, _semi) {
    return new core.ReassignmentStatement(id.ast(), source.ast())
  },
  ReassignMy(_my, _dot, id, _at, source, _semi) {
    return new core.ReassignmentMyStatement(id.ast(), source.ast())
  },
  FunctDec(_do, id, _lp, params, _rp, _arrow, returnType, funcBlock) {
    return new core.FunctionDeclaration(
      id.ast(),
      params.asIteration().ast(),
      returnType.ast(),
      funcBlock.ast()
    )
  },
  FuncBlock(_lc, base, statements, _rc) {
    return new core.FunctionBlock(base.ast(), statements.ast())
  },
  If(_so, _lp, testExp, _rp, genBlock, listOfButs, otherwise) {
    return new core.ConditionIf(
      testExp.ast(),
      genBlock.ast(),
      listOfButs.ast(),
      otherwise.ast()
    )
  },
  ElseIf(_but, _lp, testExp, _rp, genBlock) {
    return new core.ConditionElseIf(testExp.ast(), genBlock.ast())
  },
  Else(_otherwise, genBlock) {
    return new core.ConditionElse(genBlock.ast())
  },
  ForLoop(_cap, _lp, id, _in, expression, _rp, genBlock) {
    return new core.ForLoop(id.ast(), expression.ast(), genBlock.ast())
  },
  WhileLoop(_noCap, _lp, expression, _rp, genBlock) {
    return new core.WhileLoop(expression.ast(), genBlock.ast())
  },
  Return(_howItBe, expression, _semi) {
    return new core.ReturnStatement(expression.ast())
  },
  Break(_frogOut, _semi) {
    return new core.BreakStatement()
  },
  Continue(_frogIn, _semi) {
    return new core.ContinueStatement()
  },
  ObjectHead(_object, id, _lp, params, _rp, objectBlock) {
    return new core.ObjectHeader(
      id.ast(),
      params.asIteration().children.map((child) => child.ast()),
      objectBlock.ast()
    )
  },
  ConstrucDec(_const, _lp, params, _rp, genBlock) {
    return new core.ConstructDeclaration(
      params.asIteration().ast(),
      genBlock.ast()
    )
  },
  ObjectBlock(_lc, base, construcDec, methodDec, _rc) {
    return new core.ObjectBlock(
      base.ast(),
      construcDec.ast(),
      methodDec.ast()
    )
  },
  MethodDec(_do, _hash, id, _lp, params, _rp, _arrow, returnType, funcBlock) {
    return new core.MethodDeclaration(
      id.ast(),
      params.asIteration().ast(),
      returnType.ast(),
      funcBlock.ast()
    )
  },
  Base(_bayes, id, _at, expression, _semi) {
    return new core.Base(id.ast(), expression.ast())
  },
  GenBlock(_lc, statements, _rc) {
    return new core.GeneralBlock(statements.ast())
  },
  RealParam(id, _colon, type) {
    return new core.RealParameter(id.ast(), type.ast())
  },
  DecParam(params) {
    if (params.sourceString == "/") {
      return "/"
    } else {
      return new core.DeclarationParameter(params.ast())
    }
  },
  CallArg_kwarg(id, _colon, expression) {
    return new core.CallArgument(id.ast(), expression.ast())
  },
  CallArg_parg(expression) {
    return new core.CallArgument(null, expression.ast())
  },
  ListLit(_lbrac, expression, _rbrac) {
    return new core.ListLiteral(expression.asIteration().ast())
  },
  SetLit(_lab, expression, _rab) {
    return new core.SetLiteral(expression.asIteration().ast())
  },
  MapLit(_ldab, keyValue, _rdab) {
    return new core.MapLiteral(keyValue.asIteration().ast())
  },
  KeyValue(expression1, _dcolon, expression2) {
    return new core.KeyValue(expression1.ast(), expression2.ast())
  },
  ExpFull_joolOr(left, _op, right) {
    return new core.BinaryExpression(left.ast(), "|", right.ast())
  },
  Exp8_joolAnd(left, _op, right) {
    return new core.BinaryExpression(left.ast(), "&", right.ast())
  },
  Exp7_eqNeq(left, op, right) {
    if (op.sourceString == "=") {
      return new core.BinaryExpression(left.ast(), "=", right.ast())
    } else {
      return new core.BinaryExpression(left.ast(), "!=", right.ast())
    }
  },
  Exp6_glte(left, op, right) {
    if (op.sourceString == "<=") {
      return new core.BinaryExpression(left.ast(), "<=", right.ast())
    } else if (op.sourceString == ">=") {
      return new core.BinaryExpression(left.ast(), ">=", right.ast())
    } else if (op.sourceString == "<") {
      return new core.BinaryExpression(left.ast(), "<", right.ast())
    } else {
      return new core.BinaryExpression(left.ast(), ">", right.ast())
    }
  },
  Exp5_addDubUnionInter(left, op, right) {
    if (op.sourceString == "+") {
      return new core.BinaryExpression(left.ast(), "+", right.ast())
    } else if (op.sourceString == "-") {
      return new core.BinaryExpression(left.ast(), "-", right.ast())
    } else if (op.sourceString == "union") {
      return new core.BinaryExpression(left.ast(), "union", right.ast())
    } else {
      return new core.BinaryExpression(left.ast(), "intersect", right.ast())
    }
  },
  Exp4_mulDivRem(left, op, right) {
    if (op.sourceString == "*") {
      return new core.BinaryExpression(left.ast(), "*", right.ast())
    } else if (op.sourceString == "/") {
      return new core.BinaryExpression(left.ast(), "/", right.ast())
    } else {
      return new core.BinaryExpression(left.ast(), "%", right.ast())
    }
  },
  Exp3_expo(left, _op, right) {
    return new core.BinaryExpression(left.ast(), "^", right.ast())
  },
  Exp3_neg(op, right) {
    if (op.sourceString == "-") {
      return new core.UnaryExpression("-", right.ast())
    } else {
      return new core.UnaryExpression("!", right.ast())
    }
  },
  Exp2_listInd(subscriptee, _lbrac, argument, _rbrac) {
    return new core.SubscriptExpression(subscriptee.ast(), argument.ast())
  },
  Exp2_mapInd(subscriptee, _ldab, argument, _rdab) {
    return new core.SubscriptExpression(subscriptee.ast(), argument.ast())
  },
  Exp2_setInd(subscriptee, _lab, argument, _rab) {
    return new core.SubscriptExpression(subscriptee.ast(), argument.ast())
  },
  Exp2_functCall(expression, _lp, argument, _rp) {
    return new core.Call(expression.ast(), argument.asIteration().ast())
  },
  Exp2_objField(expression, _dot, id) {
    return new core.FieldExpression(expression.ast(), id.ast())
  },
  Exp2_objMethod(expression, _dot, id, _lp, argument, _rp) {
    return new core.MethodExpression(
      expression.ast(),
      id.ast(),
      argument.asIteration().ast()
    )
  },
  Exp2_objMake(_make, type, _lp, argument, _rp) {
    return new core.MakeExpression(type.ast(), argument.asIteration().ast())
  },
  Exp1_expr(_lp, expression, _rp) {
    return new core.Expression(expression.ast())
  },
  id(letter, rest) {
    return this.sourceString
  },
  numeral(_leading, _dot, _fractional) {
    return Number(this.sourceString)
  },
  strlit(_lbt, chars, _rbt) {
    return this.sourceString
  },
  joolean(_ideal) {
    return true
  },
  Type(type) {
    return new core.Type(type.ast())
  },
  Type_sumType(type1, _or, type2) {
    return new core.TypeSum(type1.ast(), type2.ast())
  },
  Type_listType(_lb, type, _rb) {
    return new core.TypeList(type.ast())
  },
  Type_setType(_lab, type, _rab) {
    return new core.TypeSet(type.ast())
  },
  Type_mapType(_ldab, keyType, _dc, valueType, _rdab) {
    return new core.TypeMap(keyType.ast(), valueType.ast())
  },
  Type_custom(letter, rest) {
    return this.sourceString
  },
  _terminal() {
    return this.sourceString
  },
  _iter(...children) {
    return children.map((child) => child.ast())
  },
})

export default function ast(sourceCode) {
  const match = gullienneGrammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new error(match.message)
  }
  return astBuilder(match).ast()
}
