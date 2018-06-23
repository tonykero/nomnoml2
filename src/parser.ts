import {
    Parser,
    IToken,
    createSyntaxDiagramsCode
} from "chevrotain"

import { allTokens, LSquare, StringLiteral, RSquare, Arrow, tokenize } from "./lexer";
//import { CSTVisitor } from './visitor.js'

class NomnomlParser extends Parser {
    constructor(input: IToken[]){
        super(input, allTokens, {outputCst: true})
        this.performSelfAnalysis()
    }

    public nomnoml = this.RULE("nomnoml", () => {
        this.MANY( () => {
            this.SUBRULE(this.object)
        })
    })

    private compartment = this.RULE("compartment", () => {
        this.CONSUME(LSquare)
        this.CONSUME(StringLiteral)
        this.CONSUME(RSquare)
    })

    private link = this.RULE("link", () => {
        this.CONSUME(Arrow)
    })
    
    private OneLinkOne = this.RULE("OneLinkOne", () => {
        this.SUBRULE(this.compartment)
        this.SUBRULE(this.link)
        this.SUBRULE2(this.compartment)
    })
    
    private object = this.RULE("object", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.OneLinkOne) },
            { ALT: () => this.SUBRULE(this.compartment)}
            
        ])
    })
}

const parser = new NomnomlParser([])
const BaseNomnomlVisitor = parser.getBaseCstVisitorConstructor()

class CSTVisitor extends BaseNomnomlVisitor {
    constructor(){
        super()
        this.validateVisitor()
    }

    nomnoml(ctx){

        let objs = [] 
        console.log(ctx)
        
        ctx.object.forEach((el) => {
            objs.push(this.visit(el))
        })

        return {
            type: "NOMNOML",
            objects: objs
        }
    }

    compartment(ctx){
        const string = ctx.StringLiteral[0].image

        return {
            type: "COMPARTMENT",
            content: string
        }
    }

    link(ctx){
        const link = ctx.link
        return {
            type: "LINK",
            link: link
        }
    }

    OneLinkOne(ctx){
        const lhs = this.visit(ctx.compartment[0])
        const link = this.visit(ctx.link)
        const rhs = this.visit(ctx.compartment[1])

        return {
            type: "ONELINKONE",
            lhs: lhs,
            rhs: rhs
        }
    }

    object(ctx){
        if(ctx.OneLinkOne){
            return this.visit(ctx.OneLinkOne)
        }
        else
        {
            return this.visit(ctx.compartment)
        }
    }

}

export function parse(text) {
    let lexResult = tokenize(text)

    parser.input = lexResult.tokens

    const cst = parser.nomnoml()

    if (parser.errors.length > 0) {
        console.log(parser.errors)
        //throw new Error("sad sad panda, Parsing errors detected")
    }
    const toAstVisitor = new CSTVisitor()

    const ast = toAstVisitor.visit(cst)
    return {
        ast: ast,
        cst: cst,
        tokens: lexResult.tokens
    }
}

export function generateRailroads() {
    const serGrammar = parser.getSerializedGastProductions()
    return createSyntaxDiagramsCode(serGrammar)
}