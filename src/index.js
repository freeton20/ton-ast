const { getAst } = require("./getAst");
const { getFuncAndVars } = require("./getFuncAndVars");
const { formatErrorsForVSCode } = require("./formatErrors");

module.exports = {
    getAst,
    getFuncAndVars,
    formatErrorsForVSCode
}