const { getAst } = require("../index");
const path = require("path");
jest.setTimeout(100_000);

test("Get AST data", async () => {
    const solFile = path.resolve(__dirname, "contracts/HelloWallet.sol");
    const received_ast = await getAst(solFile);
    const desired_ast = require(path.resolve(__dirname, "ast/HelloWallet.ast.json"));
    expect(received_ast).toMatchObject(desired_ast);
});