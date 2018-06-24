import * as  assert from 'assert'
import {generateRailroads, parse} from '../build/parser.js'
import * as  fs     from 'fs'
import * as  path   from 'path'
import * as  util   from 'util'
import * as mocha from 'mocha'

const log = function(res, opt){
    let outPath = path.resolve(__dirname, "./")
    //console.log("consol opt :" +opt)

    //if(opt.dir){
    //    if (!path.existsSync(opt.dir)) {
    //        
    //    }
    outPath = path.join(outPath, opt.dir)
    console.log("consol path 1 :" + outPath)
    fs.mkdirSync(outPath)
    //}

    let tokens = util.inspect(res.tokens, false, null)
    let cst = util.inspect(res.cst, false, null)
    let ast = util.inspect(res.ast, false, null)
    let errors = util.inspect(res.errors, false, null)

    fs.writeFileSync(outPath + "/lexer_finish.txt", tokens)
    fs.writeFileSync(outPath + "/cst_finish.txt", cst)
    fs.writeFileSync(outPath + "/ast_finish.txt", ast)
    fs.writeFileSync(outPath + "/errors.txt", errors)
}

const html = generateRailroads()
fs.writeFileSync("./railroads.html", html)

describe('Compartments', function() {
    const tests = [
        { name: "prout", text: "jambon"}/*,
        { name: "prout2", text: "jambon|jambon"},
       { name: "simple",  text: "[j]" },
       { name: "simple2", text: "[ j ]" },
       { name: "simple3", text: "[ 0 0]" },
       { name: "simple4", text: "[ <j> jambon]"},
       { name: "simple5", text: "[ 0 0]-->[jambon]" },
       { name: "simple6", text: "[ 0 0]-->[jambon]\n [ 0 0]-->[jambon]" }*/
    ]

    tests.forEach((el) => {
        const test = el

        it('should parse: ' + test.name, function(){
            
            let opt = { "dir": "log" + test.name }
            const ret = parse(test.text)
            
            log(ret, opt)

            assert.equal(ret.errors.length, 0)
        })
    })
})