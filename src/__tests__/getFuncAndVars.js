const { getFuncAndVars } = require("../index");
const path = require("path");
jest.setTimeout(100_000);

test("Get functions, variables, identifiers", async () => {
    const solFile = path.resolve(__dirname, "contracts/10_Wallet.sol");
    const funcAndVars = await getFuncAndVars(solFile);
    expect(funcAndVars.functions.length).toEqual(2);
    expect(funcAndVars.variables.length).toEqual(3);
    expect(funcAndVars.identifiers.length).toEqual(4);
});