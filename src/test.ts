import "./parser.js"
import { parse, generateRailroads } from "./parser";

import * as fs from "fs"
import * as path from "path"

import * as util from "util"

const test = 
`
[ 0 0]->[jambon]
[prout]--->[jambonneau]
`

console.log(parse(test).ast)

const outPath = path.resolve(__dirname, "./")
let tokens = util.inspect(parse(test).tokens, false, null)
fs.writeFileSync(outPath + "/lexer_finish.txt", tokens)
let cst = util.inspect(parse(test).cst, false, null)
fs.writeFileSync(outPath + "/cst_finish.txt", cst)
let ast = util.inspect(parse(test).ast, false, null)
fs.writeFileSync(outPath + "/ast_finish.txt", ast)

const html = generateRailroads()
fs.writeFileSync(outPath + "/railroads.html", html)

