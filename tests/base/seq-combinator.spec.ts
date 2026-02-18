import { describe, test, expect } from "bun:test";
import { Sequence } from "../../src/base/combinators";
import { Parser } from "../../src/base/parser";
import { StateUtils } from "../../src/base/parser-state";

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

// sequence parser functonality
describe("Sequence parser functionality", () => {

  test("can parse single result successfully", () => {
    
    const seqParser = Sequence([aaParser]);

    const pResult = seqParser.run('aabbcc');
    expect(Array.isArray(pResult.result)).toBe(true);
    expect(pResult.result.length).toBe(1);
    expect(pResult.result[0]).toBe('aa');
    expect(pResult.index).toBe(2);
    expect(pResult.isError).toBe(false);
  });

  test("can parse multiple results successfully", () => {
    
    const seqParser = Sequence([aaParser, bbParser, aaParser]);
    
    const pResult = seqParser.run('aabbaabbcc');
    expect(Array.isArray(pResult.result)).toBe(true);
    expect(pResult.result.length).toBe(3);
    expect(pResult.result.join()).toBe('aa,bb,aa');
    expect(pResult.index).toBe(6);
    expect(pResult.isError).toBe(false);
  });

  test("can parse with error successfully", () => {
    
    const seqParser = Sequence([aaParser, bbParser, aaParser]);
    
    const pResult = seqParser.run('aabbbaabbcc');
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});

