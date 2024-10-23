import { Parser, StateUtils, IParserState } from "../../src";
import { Between } from "../../src/base/combinators";

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

// between parser functonality
describe("Between parser functionality", () => {

  test("can parse input successfully", () => {
    
    const seqParser = Between(aaParser, bbParser);

    const pResult = seqParser.run('bbaabbcc');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe('aa');
    expect(pResult.index).toBe(6);
  });

  test("can parse with error successfully", () => {
    
    const seqParser = Between(aaParser, bbParser);
    
    const pResult = seqParser.run('bbaabaaabbcc');
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});

