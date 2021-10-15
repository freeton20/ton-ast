const { getAst } = require("../index");
const path = require("path");
jest.setTimeout(100_000);

test("Get AST data", async () => {
    const solFile = path.resolve(__dirname, "contracts/HelloWalletWithError.sol");
    const received_error = (await getAst(solFile));
    expect(received_error.type).toStrictEqual("error");
});