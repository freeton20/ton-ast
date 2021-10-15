const { controllers } = require('tondev');
const path = require('path');
const fs = require('fs');

let t_out = [];
async function getAst(solFile) {
    const ext = path.extname(solFile);
    if (ext !== ".sol") {
        terminal.log(`Choose solidity source file.`);
        return;
    }
    const compileCommand = controllers[1].commands[2];
    const args = [];
    args.file = solFile;
    args.outputDir = path.resolve(__dirname, 'temp');
    await runCommand(compileCommand, args);
    const astFile = path.resolve(__dirname, "temp", `${path.parse(args.file).name}.ast.json`);
    if (fs.existsSync(astFile)) {
        const ast = require(astFile);
        fs.unlink(astFile, () => { });
        return {
            type: 'ast',
            ast
        }
    }
    return {
        type: 'error',
        error: t_out
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