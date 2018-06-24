import {
    Parser,
    IToken,
    createSyntaxDiagramsCode
} from "chevrotain"

import { allTokens, LSquare, StringLiteral, RSquare, Arrow, tokenize, SpecialCharacter, WhiteSpace, Pipe, LAngle, RAngle } from "./lexer";
//import { CSTVisitor } from './visitor.js'

class NomnomlParser extends Parser {
    constructor(input: IToken[]){
        super(input, allTokens, {outputCst: true, maxLookahead: 10})
        this.performSelfAnalysis()
    }

    public nomnoml = this.RULE("nomnoml", () => {
        this.MANY(()=>{
            this.SUBRULE(this.object)
        })
    })

    private compartment = this.RULE("compartment", () => {
        this.CONSUME(LSquare)
        this.SUBRULE(this.title)
        this.AT_LEAST_ONE_SEP({
            SEP: Pipe,
            DEF: () => {
                this.SUBRULE(this.compartmentContent)
            }
        })
        this.CONSUME(RSquare)
})

    
    private content = this.RULE("content", () => {
        this.MANY(() => {
            this.SUBRULE(this.contentComposition)
        })
    })

    private contentComposition = this.RULE("contentComposition", () => {
        //this.OR([
        //    { ALT: () => this.SUBRULE(this.content1)},
        //    { ALT: () => this.CONSUME(StringLiteral)}
        //])
        this.CONSUME(StringLiteral)
    })
    
    private content1 = this.RULE("content1", () => {
        this.CONSUME(WhiteSpace)
        this.CONSUME(SpecialCharacter)
    })

    private attribute = this.RULE("attribute", () => {
        this.CONSUME(LAngle)
        this.SUBRULE(this.content)
        this.CONSUME(RAngle)
    })

    private title = this.RULE("title", () => {
        this.OPTION(()=>{
            this.SUBRULE(this.attribute)
        })
        this.SUBRULE(this.content)
    })
    
    private compartmentContent = this.RULE("compartmentContent", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.content)},
            { ALT: () => this.SUBRULE(this.compartment)}
        ])
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
            { ALT: () => this.SUBRULE(this.compartment)},
            { ALT: () => this.SUBRULE(this.OneLinkOne) }
            
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
        
        ctx.object.forEach((el) => {
            objs.push(this.visit(el))
        })

        return {
            type: "NOMNOML",
            objects: objs
        }
    }

    compartment(ctx){
        let objs = []
        objs.push(this.visit(ctx.title))
        
        ctx.compartmentContent.forEach((el) => {
            objs.push(this.visit(el))
        })

        return {
            type: "COMPARTMENT",
            content: objs
        }
    }

    content(ctx){

        let objs = []
        ctx.contentComposition.forEach((el) => {
            objs.push(this.visit(el))
        })

        return {
            type: "CONTENT",
            content: objs
        }
    }

    contentComposition(ctx){
        const content = ctx.StringLiteral.image

        return {
            type: "CONTENT_COMPOSITION",
            content: content
        }
    }

    content1(ctx){

        const ws = ctx.WhiteSpace.image
        const sc = ctx.SpecialCharacter.image

        return {
            type: "CONTENT1",
            ws: ws,
            sc: sc
        }

    }

    attribute(ctx){
        const content = this.visit(ctx.content)

        return {
            type: "ATTRIBUTE",
            content: content
        }
    }

    title(ctx){

        let attrib = undefined
        if(ctx.attribute)
        {
            attrib = this.visit(ctx.attribute)
        }
        const content = this.visit(ctx.content)

        return {
            type: "TITLE",
            attribute: attrib,
            content: content
        }
    }

    compartmentContent(ctx){
        let content = undefined
        if(ctx.content){
            content = this.visit(ctx.content)
        }
        else{
            content = this.visit(ctx.compartment)
        }

        return {
            type: "COMPARTMENT_CONTENT",
            content: content
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
    /*
    if (parser.errors.length > 0) {
        console.log(parser.errors)
        throw new Error("sad sad panda, Parsing errors detected")
    }
    */

    const toAstVisitor = new CSTVisitor()

    const ast = toAstVisitor.visit(cst)
    return {
        ast: ast,
        cst: cst,
        tokens: lexResult.tokens,
        errors: parser.errors
    }
}

export function generateRailroads() {
    const serGrammar = parser.getSerializedGastProductions()
    return createSyntaxDiagramsCode(serGrammar)
}