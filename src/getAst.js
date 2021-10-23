const { controllers } = require('tondev');
const path = require('path');
const fs = require('fs');
const { formatErrors } = require("./formatErrors");

let t_out = [];
async function getAst(solFile) {
    const ext = path.extname(solFile);
    if (ext !== ".sol") {
        terminal.log(`Choose solidity source file.`);
        return;
    }
    const compileCommand = controllers[1].commands[3];
    const args = [];
    args.file = solFile;
    args.outputDir = path.resolve(__dirname, 'temp');
    await runCommand(compileCommand, args);
    const astFile = path.resolve(__dirname, "temp", `${path.parse(args.file).name}.ast.json`);
    if (fs.existsSync(astFile)) {
        let ast = fs.readFileSync(astFile, "utf-8");
        //if in sol file is import, ast isn`t valid. It has a few ast files. I need to have last of them
        ast = ast.split("}{");
        if(ast.length > 1){
            ast = JSON.parse(`{${ast[ast.length-1]}`);
        }else{
            ast = JSON.parse(ast[0]);
        }
     //  fs.writeFileSync("/home/nikolai/ton-ast/src/__tests__/ast/HelloWallet.ast.json", JSON.stringify(ast, 0, 4));//for testing files
        fs.unlink(astFile, () => { });
        return {
            type: 'ast',
            ast
        }
    }
    return {
        type: 'error',
        error: formatErrors(t_out[0])
    }
}

async function runCommand(command, args) {
    const terminal = tondevTerminal();
    try {
        await command.run(tondevTerminal(), args);
    } catch (err) {
        terminal.writeError(err.toString());
    }
}
function tondevTerminal() {
    return {
        log: (...args) => {

        },
        writeError: (text) => {
            !t_out.includes(text) && t_out.push(text);
        },
        write: () => {            
        },
    };
}

module.exports = {
    getAst
}