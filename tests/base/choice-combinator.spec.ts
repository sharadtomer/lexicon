import { Parser, StateUtils, IParserState } from "../../src";
import { Choice } from "../../src/base/combinators";

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

const bbParser = new Parser((state) => {
  const inp = state.inputString.slice(state.index);

  if(inp.length == 0){
    return StateUtils.withError(state, `Unexpected end of input`);
  }

  if(inp.startsWith('bb')){
    return StateUtils.updateResult(state, 'bb', state.index + 2);
  }else {
    return StateUtils.withError(state, `Parse Error: expected 'bb' but got ${inp.substring(0, 2)} at index ${state.index}`);
  }
});

// choice parser functonality
describe("Choice parser functionality", () => {

  test("can parse with first parser successfully", () => {
    
    const choiceParser = Choice([aaParser, bbParser]);

    const pResult = choiceParser.run('aabbcc');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe('aa');
    expect(pResult.index).toBe(2);
  });

  test("can parse with alternate choice parser successfully", () => {
    
    const choiceParser = Choice([aaParser, bbParser]);
    
    const pResult = choiceParser.run('bbaabbcc');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe('bb');
    expect(pResult.index).toBe(2);
  });

  test("can parse with error if no choice matches", () => {
    
    const choiceParser = Choice([aaParser, bbParser]);
    
    const pResult = choiceParser.run('caabbbaabbcc');
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});

