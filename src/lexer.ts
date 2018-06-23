import {
    createToken,
    Lexer
} from "chevrotain"

const LSquare          = createToken({ name: "LSquare",          pattern: /\[/ })
const RSquare          = createToken({ name: "RSquare",          pattern: /\]/ })
//const Pipe           = createToken({ name: "Pipe",             pattern: /|/})
const StringLiteral    = createToken({ name: "StringLiteral",    pattern: /[a-zA-Z0-9 ]+/})
const SpecialCharacter = createToken({ name: "SpecialCharacter", pattern: /[ -_.]+/})
const Arrow            = createToken({ name: "Arrow",            pattern: /-*>/ })
/*
const Whitespace    = createToken({
    name: "WhiteSpace",
    pattern: /[\n]+/,
    group: Lexer.SKIPPED
})
*/
const allTokens = [
    LSquare,
    RSquare,
    Arrow,
    StringLiteral
]

const NomnomlLexer = new Lexer(allTokens)

export { allTokens,
    LSquare,
    RSquare,
    Arrow,
    StringLiteral
}

export function tokenize(text) {
    return NomnomlLexer.tokenize(text)
}
