import { Parser, StateUtils, IParserState } from "../../src";
import { Choice, Contextual } from "../../src/base/combinators";

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

const ctxParser = Contextual(function* (){
  // first parse using aa parser
  var aaRes = yield aaParser;

  // then parse using bb parsers
  var bbRes = yield bbParser;

  // use conbination as result
  return aaRes + bbRes;
});

// contextual parser functonality
describe("contextual parser functionality", () => {

  test("can properly parse the state using contextual parser", () => {

    const pResult = ctxParser.run('aabbcc');
    expect(pResult.result).toBe('aabb');
    expect(pResult.index).toBe(4);
    expect(pResult.isError).toBe(false);
  });

  test("can parse with error successfully if first parser fails", () => {
    const pResult = ctxParser.run('baabb');
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

  test("can parse with error successfully if 2nd parser fails", () => {
    const pResult = ctxParser.run('aabaabb');
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(2);
  });

  // can be used with other parsers like choice
  test("can be used with other parsers like choice", () => {
    const pResult = Choice([
      ctxParser,
      aaParser
    ]).run('aabaabb');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe('aa');
    expect(pResult.index).toBe(2);
  });

});

