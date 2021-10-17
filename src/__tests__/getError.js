const { getAst } = require("../index");
const { formatErrors } = require("../formatErrors");
const path = require("path");
jest.setTimeout(100_000);

test("Get AST data", async () => {
    const solFile = path.resolve(__dirname, "contracts/HelloWalletWithError.sol");
    const received_error = (await getAst(solFile));
    expect(received_error.type).toStrictEqual("error");
    const formattedError = formatErrors(received_error.error[0]);
    expect(received_error.type).toStrictEqual("error");
});