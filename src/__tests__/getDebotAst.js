const { getAst } = require("../index");
const path = require("path");
jest.setTimeout(100_000);

test("Get AST data", async () => {
    const solFile = path.resolve(__dirname, "contracts/testDebot.sol");
    const received_ast = (await getAst(solFile)).ast;
    const desired_ast = require(path.resolve(__dirname, "ast/testDebot.ast.json"));
    expect(received_ast).toMatchObject(desired_ast);
});