const fs = require('fs');
const { getAst } = require('./getAst');

function isObject(obj) {
    return obj != null && obj.constructor.name === "Object"
}

let collection = {
    variables: [],
    identifiers: [],
    functions: []
}

let document;

function ifVariable(value) {
    if (typeof value.nodeType !== 'undefined' && value.nodeType == 'VariableDeclaration' && value.name !== '') {
        collection.variables.push({
            name: value.name,
            position: [getPosition(value.src)],
            type: value.typeName.typeDescriptions.typeString,
            description: variableDescription(value),
            data: value
        });
        return true;
    }
    return null;
}

function ifFunction(value) {
    if (typeof value.nodeType !== 'undefined' && value.nodeType == 'FunctionDefinition') {
        collection.functions.push({
            name: value.name,
            position: getPosition(value.src),
            description: functionDescription(value),
            size: functionSize(value.src),
            data: value
        });
        return true;
    }
    return null;
}

function ifIdentifier(value) {
    if (typeof value.nodeType !== 'undefined' && value.nodeType == 'Identifier' && value.referencedDeclaration > 0) {
        //value.referencedDeclaration
        collection.identifiers.push({
            name: value.name,
            type: value.typeDescriptions.typeString,
            position: getPosition(value.src),
            data: value
        })
        return true;
    }
    return null;
}

function functionSize(src) {
    const srcData = src.split(':');
    const characters = Number(srcData[1]);
    const endCharacter = Number(srcData[0]) + characters;
    const startPosition = getPosition(src);
    const endPosition = getPosition(`${endCharacter}`);
    return {
        characters,
        lines: endPosition.line - startPosition.line - 1
    }
}

function variableDescription(value) {
    let description = '';
    description += `(`;
    description += `${value.visibility}`
    if (value.stateVariable == true) {
        description += `, state`;
    }
    description += `)`;
    if (value.constant == true) {
        description += ' const';
    }
    description += ` ${value.name}: ${value.typeDescriptions.typeString}`;
    return description;
}

function functionDescription(value) {
    if (value.kind == "constructor") {
        return "constructor";
    }

    let description = '';

    // function name 
    description += `function ${value.name}`;

    //function input params
    description += `(`;
    if (value.parameters.parameters !== 'undefined' && value.parameters.parameters.length > 0) {
        let input = value.parameters.parameters;
        for (let i = 0; i < input.length; i++) {
            if (i > 0) {
                description += ', ';
            }
            description += `${input[i].name} `;
            description += input[i].typeDescriptions.typeString;
        }
    }
    description += `)`;
    //function scopes
    description += ` ${value.visibility} ${value.stateMutability}`;
    if (value.virtual == true) {
        description += ` virtual`;
    }

    //modifiers
    if (typeof value.modifiers[0].modifierName.name !== 'undefined') {
        const modifiers = value.modifiers;
        for (let i = 0; i < modifiers.length; i++) {
            if (i > 0) {
                description += ', ';
            }
            description += ` ${modifiers[i].modifierName.name}`;
        }
    }
    description += `: `;

    //function ouptup params
    if (value.returnParameters.parameters !== 'undefined' && value.returnParameters.parameters.length > 0) {
        let returns = value.returnParameters.parameters;
        for (let i = 0; i < returns.length; i++) {
            if (i > 0) {
                description += ', ';
            }
            if (returns[i].name !== '') {
                description += `${returns[i].name} `;
            }
            description += returns[i].typeDescriptions.typeString;
        }
    } else {
        description += '{}';
    }
    return description;
}

function getPosition(src) {
    let character = Number(src.split(':')[0]);
    let lines = document.split("\n");
    for (line = 0; character > lines[line].length; line++) {
        character -= lines[line].length + 1;
    }
    return {
        line: line + 1,
        character: character + 1
    }
}

function treeRecursion(obj) {
    for (const [, value] of Object.entries(obj)) {
        if (isObject(value) || Array.isArray(value)) {
            ifVariable(value) ?? ifFunction(value) ?? ifIdentifier(value);
            treeRecursion(value);
        }
    }
}

async function getFuncAndVars(solUrl) {
    document = fs.readFileSync(solUrl, "utf-8");
    const r = await getAst(solUrl);
    if (typeof r.ast !== 'undefined' && isObject(r.ast)) {
        treeRecursion(r.ast);
    }
    return collection;
}

module.exports = {
    getFuncAndVars
}

