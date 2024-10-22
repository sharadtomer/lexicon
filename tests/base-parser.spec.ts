import { Parser, StateUtils, IParserState } from "../src";

describe("Base parser functionality", () => {
  test("can create simple parser", () => {
    const parser = new Parser((state) => {
      const inp = state.inputString.slice(state.index);

      if(inp.length == 0){
        return StateUtils.withError(state, `Unexpected end of input`);
      }

      if(inp.startsWith('aa')){
        return StateUtils.updateResult(state, 'aa', state.index + 2);
      }else {
        return StateUtils.withError(state, `Parse Error: expected 'aa' but got ${inp.substring(0, 2)} at index ${state.index}`);
      }
    });

    const pResult = parser.run('aabbcc');
    expect(pResult.result).toEqual('aa');
    expect(pResult.index).toEqual(2);
    expect(pResult.isError).toBeFalsy();

    const pErrResult = parser.run('bbaacc');
    expect(pErrResult.isError).toBeTruthy();
    expect(pErrResult.err).toEqual(`Parse Error: expected 'aa' but got bb at index 0`);
  });
});