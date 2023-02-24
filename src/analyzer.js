import fs from "fs"
import ohm from "ohm-js"
import * as core from "./core.js"

//Throw an error message
function error(message) {
  throw new Error(message)
}

const gullienneGrammar = ohm.grammar(fs.readFileSync("src/gullienne.ohm"))

export default function analyze(sourceCode) {
  const analyzer = gullienneGrammar.createSemantics().addOperation("rep", {
    Program(body) {
      return new core.Program(body.rep())
    },
    Statement(statement) {
      return statement.rep()
    },
    Statement_standalone(expression, _semi) {
      return new core.Statement(expression.rep())
    },
    Statement_incDec(id, operator, _semi) {
      return new core.IncDecStatement(id.rep(), operator.sourceString)
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
    ReassignMy(_my, _dot, id, _at, source, _semi) {
      return new core.ReassignmentMyStatement(id.rep(), source.rep())
    },
    FunctDec(_do, id, _lp, params, _rp, _arrow, returnType, funcBlock) {
      return new core.FunctionDeclaration(
        id.rep(),
        params.asIteration().rep(),
        returnType.rep(),
        funcBlock.rep()
      )
    },
    FuncBlock(_lc, base, statements, _rc) {
      return new core.FunctionBlock(base.rep(), statements.rep())
    },
    If(_so, _lp, testExp, _rp, genBlock, listOfButs, otherwise) {
      return new core.ConditionIf(
        testExp.rep(),
        genBlock.rep(),
        listOfButs.rep(),
        otherwise.rep()
      )
    },
    ElseIf(_but, _lp, testExp, _rp, genBlock) {
      return new core.ConditionElseIf(testExp.rep(), genBlock.rep())
    },
    Else(_otherwise, genBlock) {
      return new core.ConditionElse(genBlock.rep())
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
    ObjectHead(_object, id, _lp, params, _rp, objectBlock) {
      return new core.ObjectHeader(
        id.rep(),
        params.asIteration().children.map((child) => child.rep()),
        objectBlock.rep()
      )
    },
    ConstrucDec(_const, _lp, params, _rp, genBlock) {
      return new core.ConstructDeclaration(
        params.asIteration().rep(),
        genBlock.rep()
      )
    },
    ObjectBlock(_lc, base, construcDec, methodDec, _rc) {
      return new core.ObjectBlock(
        base.rep(),
        construcDec.rep(),
        methodDec.rep()
      )
    },
    MethodDec(_do, _hash, id, _lp, params, _rp, _arrow, returnType, funcBlock) {
      return new core.MethodDeclaration(
        id.rep(),
        params.asIteration().rep(),
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
      if (params.sourceString == "/") {
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
    ListLit(_lbrac, expression, _rbrac) {
      return new core.ListLiteral(expression.asIteration().rep())
    },
    SetLit(_lab, expression, _rab) {
      return new core.SetLiteral(expression.asIteration().rep())
    },
    MapLit(_ldab, keyValue, _rdab) {
      return new core.MapLiteral(keyValue.asIteration().rep())
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
    Exp7_eqNeq(left, op, right) {
      if (op.sourceString == "=") {
        return new core.BinaryExpression(left.rep(), "=", right.rep())
      } else {
        return new core.BinaryExpression(left.rep(), "!=", right.rep())
      }
    },
    Exp6_glte(left, op, right) {
      if (op.sourceString == "<=") {
        return new core.BinaryExpression(left.rep(), "<=", right.rep())
      } else if (op.sourceString == ">=") {
        return new core.BinaryExpression(left.rep(), ">=", right.rep())
      } else if (op.sourceString == "<") {
        return new core.BinaryExpression(left.rep(), "<", right.rep())
      } else {
        return new core.BinaryExpression(left.rep(), ">", right.rep())
      }
    },
    Exp5_addDubUnionInter(left, op, right) {
      if (op.sourceString == "+") {
        return new core.BinaryExpression(left.rep(), "+", right.rep())
      } else if (op.sourceString == "-") {
        return new core.BinaryExpression(left.rep(), "-", right.rep())
      } else if (op.sourceString == "union") {
        return new core.BinaryExpression(left.rep(), "union", right.rep())
      } else {
        return new core.BinaryExpression(left.rep(), "intersect", right.rep())
      }
    },
    Exp4_mulDivRem(left, op, right) {
      if (op.sourceString == "*") {
        return new core.BinaryExpression(left.rep(), "*", right.rep())
      } else if (op.sourceString == "/") {
        return new core.BinaryExpression(left.rep(), "/", right.rep())
      } else {
        return new core.BinaryExpression(left.rep(), "%", right.rep())
      }
    },
    Exp3_expo(left, _op, right) {
      return new core.BinaryExpression(left.rep(), "^", right.rep())
    },
    Exp3_neg(op, right) {
      if (op.sourceString == "-") {
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
    Exp2_functCall(expression, _lp, argument, _rp) {
      return new core.Call(expression.rep(), argument.asIteration().rep())
    },
    Exp2_objField(expression, _dot, id) {
      return new core.FieldExpression(expression.rep(), id.rep())
    },
    Exp2_objMethod(expression, _dot, id, _lp, argument, _rp) {
      return new core.MethodExpression(
        expression.rep(),
        id.rep(),
        argument.asIteration().rep()
      )
    },
    Exp2_objMake(_make, type, _lp, argument, _rp) {
      return new core.MakeExpression(type.rep(), argument.asIteration().rep())
    },
    Exp1_expr(_lp, expression, _rp) {
      return new core.Expression(expression.rep())
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
      return new core.Type(type.rep())
    },
    Type_sumType(type1, _or, type2) {
      return new core.TypeSum(type1.rep(), type2.rep())
    },
    Type_listType(_lb, type, _rb) {
      return new core.TypeList(type.rep())
    },
    Type_setType(_lab, type, _rab) {
      return new core.TypeSet(type.rep())
    },
    Type_mapType(_ldab, keyType, _dc, valueType, _rdab) {
      return new core.TypeMap(keyType.rep(), valueType.rep())
    },
    Type_custom(letter, rest) {
      return this.sourceString
    },
    _terminal() {
      return this.sourceString
    },
    _iter(...children) {
      return children.map((child) => child.rep())
    },
  })

  const match = gullienneGrammar.match(sourceCode)
  if (!match.succeeded()) error(match.message)
  return analyzer(match).rep()
}
