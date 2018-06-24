import {
    createToken,
    Lexer
} from "chevrotain"

const LSquare          = createToken({ name: "LSquare",          pattern: /\[/ })
const RSquare          = createToken({ name: "RSquare",          pattern: /\]/ })
const LAngle           = createToken({ name: "LAngle",           pattern: /</})
const RAngle           = createToken({ name: "RAngle",           pattern: />/})

const Pipe             = createToken({ name: "Pipe",             pattern: /\|/})

const StringLiteral    = createToken({ name: "StringLiteral",    pattern: /[a-zA-Z0-9]+/})
const SpecialCharacter = createToken({ name: "SpecialCharacter", pattern: /[-_.]+/})
const WhiteSpace       = createToken({ name: "WhiteSpace",       pattern: /[ \t\n]+/ , line_breaks: true})

const Arrow            = createToken({ name: "Arrow",            pattern: /-*>/ })


const allTokens = [
    LSquare,
    RSquare,
    LAngle,
    RAngle,
    Arrow,
    StringLiteral,
    SpecialCharacter,
    WhiteSpace,
    Pipe
]

const NomnomlLexer = new Lexer(allTokens)

export { allTokens,
    LSquare,
    RSquare,
    Arrow,
    StringLiteral,
    SpecialCharacter,
    WhiteSpace,
    Pipe,
    LAngle,
    RAngle
}

export function tokenize(text) {
    return NomnomlLexer.tokenize(text)
}
