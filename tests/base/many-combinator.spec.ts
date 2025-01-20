import { Many, Many1 } from "../../src/base/combinators";
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

// many parser functonality
describe("Many parser functionality", () => {

  test("can parse single result successfully", () => {
    
    const manyaaParser = Many(aaParser);

    const pResult = manyaaParser.run('aabbcc');
    expect(Array.isArray(pResult.result)).toBe(true);
    expect(pResult.result.length).toBe(1);
    expect(pResult.result[0]).toBe('aa');
    expect(pResult.index).toBe(2);
    expect(pResult.isError).toBe(false);
  });

  test("can parse multiple results successfully", () => {
    
    const manyaaParser = Many(aaParser);
    
    const pResult = manyaaParser.run('aaaaabbcc');
    expect(Array.isArray(pResult.result)).toBe(true);
    expect(pResult.result.length).toBe(2);
    expect(pResult.result.join()).toBe('aa,aa');
    expect(pResult.index).toBe(4);
    expect(pResult.isError).toBe(false);
  });

  test("can parse 0 results successfully", () => {
    
    const manyaaParser = Many(aaParser);
    
    const pResult = manyaaParser.run('baaaaabbcc');
    expect(Array.isArray(pResult.result)).toBe(true);
    expect(pResult.result.length).toBe(0);
    expect(pResult.index).toBe(0);
    expect(pResult.isError).toBe(false);
  });

});

// many1 parser functionality
describe("Many1 parser functionality", () => {

  test("can parse single result successfully", () => {
    
    const manyaaParser = Many1(aaParser);

    const pResult = manyaaParser.run('aabbcc');
    expect(Array.isArray(pResult.result)).toBe(true);
    expect(pResult.result.length).toBe(1);
    expect(pResult.result[0]).toBe('aa');
    expect(pResult.index).toBe(2);
    expect(pResult.isError).toBe(false);
  });

  test("can parse multiple results successfully", () => {
    
    const manyaaParser = Many1(aaParser);
    
    const pResult = manyaaParser.run('aaaaabbcc');
    expect(Array.isArray(pResult.result)).toBe(true);
    expect(pResult.result.length).toBe(2);
    expect(pResult.result.join()).toBe('aa,aa');
    expect(pResult.index).toBe(4);
    expect(pResult.isError).toBe(false);
  });

  test("gives error on 0 results", () => {
    
    const manyaaParser = Many1(aaParser);
    
    const pResult = manyaaParser.run('baaaaabbcc');
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});
