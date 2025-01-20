import { SeptBy } from "../../src/base/combinators";
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

// sepBy parser functonality
describe("SepBy parser functionality", () => {

  test("can parse with 1 result without separator successfully", () => {
    
    const sepByParser = SeptBy(aaParser, bbParser);

    const pResult = sepByParser.run('aabaabbcc');
    expect(pResult.isError).toBe(false);
    expect(Array.isArray(pResult.result)).toBe(true);
    expect(pResult.result.join()).toBe('aa');
    expect(pResult.index).toBe(2);
  });

  test("can parse with 1 result with separator successfully", () => {
    
    const sepByParser = SeptBy(aaParser, bbParser);

    const pResult = sepByParser.run('aabbcaabbcc');
    expect(pResult.isError).toBe(false);
    expect(Array.isArray(pResult.result)).toBe(true);
    expect(pResult.result.join()).toBe('aa');
    expect(pResult.index).toBe(4);
  });

  test("can parse with multiple results successfully", () => {
    
    const sepByParser = SeptBy(aaParser, bbParser);

    const pResult = sepByParser.run('aabbaabbaabbcaabbcc');
    expect(pResult.isError).toBe(false);
    expect(Array.isArray(pResult.result)).toBe(true);
    expect(pResult.result.join()).toBe('aa,aa,aa');
    expect(pResult.index).toBe(12);
  });

  test("can parse with 0 results successfully", () => {
    
    const sepByParser = SeptBy(aaParser, bbParser);
    
    const pResult = sepByParser.run('caabbbaabbcc');
    expect(pResult.isError).toBe(false);
    expect(Array.isArray(pResult.result)).toBe(true);
    expect(pResult.result.length).toBe(0);
    expect(pResult.index).toBe(0);
  });

});

