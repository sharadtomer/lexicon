import { Parser, StateUtils, IParserState } from "../../src";
import { Lazy } from "../../src/base/combinators";

const aaParser = new Parser((state) => {
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

const lParser = Lazy(() => aaParser);

// lazy parser functonality
describe("Lazy parser functionality", () => {

  test("can properly parse the state using lazy parser", () => {

    const pResult = lParser.run('aabbcc');
    expect(pResult.result).toBe('aa');
    expect(pResult.index).toBe(2);
    expect(pResult.isError).toBe(false);
  });

  test("can parse with error successfully", () => {
    const pResult = lParser.run('baabb');
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});

