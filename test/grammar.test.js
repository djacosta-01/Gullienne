import assert from "assert"
import fs from "fs"
import ohm from "ohm-js"

const syntaxChecks = [
  ["all numeric literal forms", "overheard(8 * 89.123);"],
  ["complex expressions", "overheard(83 * ((((-((((13 / 21)))))))) + 1 - 0);"],
  ["all unary operators", "overheard (-3); overheard (!ideal);"],
  ["all binary operators", "overheard (x & y | z * 1 / 2 ^ 3 + 4 < 5);"],
  [
    "all arithmetic operators",
    "x:number @ (!3) * 2 + 4 - (-7.3) * 8 ^ 13 / 1;",
  ],
  ["all relational operators", "x:joolean @ 1<(2<=(3=(4!=(5 >= (6>7)))));"],
  ["all logical operators", "x:joolean @ ideal & !ideal | (!ideal);"],
  ["end of program inside comment", "overheard(0); ~ yay ~"],
  ["comments with no text are ok", "overheard(1);~ ~\noverheard(0);~ ~"],
  ["non-Latin letters in identifiers", "コンパイラ:number @ 100;"],
]

const syntaxErrors = [
  ["non-letter in an identifier", "ab😭c:number @ 2;", /Line 1, col 3/],
  ["malformed number", "x:number @ 2.;", /Line 1, col 14/],
  ["missing semicolon", "x:number @ 3 y:number @ 1", /Line 1, col 14/],
  ["a missing right operand", "overheard(5 -", /Line 1, col 14/],
  ["a non-operator", "overheard(7 * ((2 _ 3)))", /Line 1, col 19/],
  ["an expression starting with a )", "x:number @ );", /Line 1, col 12/],
  ["a statement starting with expression", "x * 5;", /Line 1, col 3/],
  ["an illegal statement on line 2", "overheard(5);\nx * 5;", /Line 2, col 3/],
  ["a statement starting with a )", "overheard(5);\n) * 5", /Line 2, col 1/],
  ["an expression starting with a *", "x:number @ * 71;", /Line 1, col 12/],
]

const gullienneChecks = [
  [
    "multitype data structures",
    "x : [ number | joolean | number | number | number ] @ 12; x : << number|string :: joolean>> @ 12 ;",
  ],
  [
    "nested if statements",
    `so (x = 1) {
        so (x < 1) {
            so (x <= 1) {
                so (x > 1) {
                    so (x >= 1) {
                        so (x != 1) {
                            overheard(\`We compared a lot!\`);
                        }
                    }
                }
            }
        }
    }`,
  ],
  [
    "uncapped loops",
    `noCap(bob < 5) {
        bob++;
        overheard(\`Number of squids on floor: \` + mangle(bob, string));
    }
    
    noCap (bob = !0) {
        so (bob = 3) {
            frogOut;
        }
        frogIn;
    }`,
  ],
  [
    "capped loops",
    `cap (chocolate in pulp) {
        chocolate++;
    }
    
    cap(hotChocolates in debt) {
        overheard(\`I owe you \` + hotChocolates + \` for this.\`);
    }`,
  ],
  [
    "functions",
    `do gluStringTogether(bob:string, /, job:number, yob:number) -> string {
        bobble:number @ job + yob;
        howItBe bob + mangle(bobble, string);
    }
    gluStringTogether(\`No\`, job:4, yob:3);`,
  ],
  [
    "reasonable nested negation",
    `tripleNeg:number @ -(-(-3));
    doubleNot:joolean @ !!ideal;`,
  ],
  [
    "object stuff",
    `object Julian (hat:string, jacket:string) {
        ~ Object default (bayesline) values, if "empty" versions are unacceptable ~
        bayes hat @ \`the classic Julian LMU cap\`;
        bayes jacket @ \`the classic Julian black and orange\`;
        
        ~optional constructor - ask Julian how~
        constructor (hat:string, jacket:string) {
            my.hat @ hat;
            my.jacket @ jacket;
        }
        
        ~methods~
        do tutor (subject:string) -> joolean {
            so (subject = \`plang\`) {
                howItBe ideal;
            } otherwise {
                howItBe !ideal;
            }
        }
        
        do #stopOnTime() -> joolean {
            howItBe !ideal;
        }
    }
    
    ~Object instantiating with "imagine"~
    winterJulian:Julian @ imagine Julian (hat:\`red and blue\`, jacket:\`black and orange\`);
    
    ~Object fields are read-only outside the Object.
    Object methods are public unless marked by #.~
    overheard(winterJulian.jacket);
    overheard(winterJulian.hat);`,
  ],
  ["Reassignment operator", `x @ 20;`],
  [
    "Mathematical set operations on data structures",
    `overheard(3 * [4,5,6] union [1,2,3]);
    overheard(<1,2,3,ideal> intersect <10,11,12>);
    overheard(<<a::x, b::<1,2,3>, c::ideal>> union <<>>);
    overheard([a,b,c] + <d, e, i> + <<a::x, b::y>>);
    overheard(<1,2,3> + <4,5,6> union [a,b,c] intersect [7,8,9]);
    overheard(<1,2,3> + <4,5,6> union ([a,b,c] intersect [7,8,9]));`,
  ],
]

const gullienneErrors = [
  [
    "Incorrect string syntax",
    `wrong:string @ "use the tick mark!";`,
    /Line 1, col 16/,
  ],
  [
    "Declaring a variable in an conditional",
    `so (julian @ \`cool guy\`) {
        howItBe ideal;
    }`,
    /Line 1, col 12/,
  ],
  [
    "Incorrect assignment operator",
    `name:string = \`julian\`;`,
    /Line 1, col 13/,
  ],
  [
    "unreasonable nested negation",
    `------------------------------------------------------------3------------------------------------------------------------2==5;`,
    /Line 1, col 1/,
  ],
  [
    "statement conditions",
    `so (so (so (ideal))) {
        overhear(\`ideal\`);
    }`,
    /Line 1, col 5/,
  ],
  [
    "empty condition",
    `noCap () {
        ideal;
    }`,
    /Line 1, col 8/,
  ],
]

const grammar = ohm.grammar(fs.readFileSync("src/gullienne.ohm"))

describe("Base Grammar", () => {
  for (const [scenario, source] of syntaxChecks) {
    it(`properly specifies ${scenario}`, () => {
      assert(grammar.match(source).succeeded())
    })
  }
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    it(`does not permit ${scenario}`, () => {
      const match = grammar.match(source)
      assert(!match.succeeded())
      assert(new RegExp(errorMessagePattern).test(match.message))
    })
  }
})

describe("Gullienne-specific syntax", () => {
  for (const [scenario, source] of gullienneChecks) {
    it(`properly specifies ${scenario}`, () => {
      assert(grammar.match(source).succeeded())
    })
  }
  for (const [scenario, source, errorMessagePattern] of gullienneErrors) {
    it(`does not permit ${scenario}`, () => {
      const match = grammar.match(source)
      assert(!match.succeeded())
      assert(new RegExp(errorMessagePattern).test(match.message))
    })
  }
})
