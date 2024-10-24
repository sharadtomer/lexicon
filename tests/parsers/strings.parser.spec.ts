import StringParsers from "../../src/parsers/strings";

// regex parser functonality
describe("Regex parser functionality", () => {

  const aaRgxParser = StringParsers.Regex('aa');

  test("can parse input successfully", () => {
    const pResult = aaRgxParser.run('aaabbcc');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe('aa');
    expect(pResult.index).toBe(2);
  });

  test("can parse with error successfully", () => {
    const pResult = aaRgxParser.run('abaabbcc');  
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});

// char parser functonality
describe("char parser functionality", () => {

  test("can parse input successfully", () => {
    const pResult = StringParsers.char.run('aaabbcc');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe('a');
    expect(pResult.index).toBe(1);
  });

  test("can parse with error successfully", () => {
    const pResult = StringParsers.char.run('');  
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});

// alphabet parser functonality
describe("alphabet parser functionality", () => {

  test("can parse input successfully", () => {
    const pResult = StringParsers.alphabet.run('aaabbcc');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe('a');
    expect(pResult.index).toBe(1);
  });

  test("can parse with error successfully", () => {
    const pResult = StringParsers.alphabet.run('1aaabbcc');  
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});

// alphabets parser functonality
describe("alphabets parser functionality", () => {

  test("can parse input successfully", () => {
    const pResult = StringParsers.alphabets.run('aaa1bbcc');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe('aaa');
    expect(pResult.index).toBe(3);
  });

  test("can parse with error successfully", () => {
    const pResult = StringParsers.alphabets.run('1aaabbcc');  
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});

// digit parser functonality
describe("digit parser functionality", () => {

  test("can parse input successfully", () => {
    const pResult = StringParsers.digit.run('123abc');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe('1');
    expect(pResult.index).toBe(1);
  });

  test("can parse with error successfully", () => {
    const pResult = StringParsers.digit.run('abc123');  
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});

// digits parser functonality
describe("digits parser functionality", () => {

  test("can parse input successfully", () => {
    const pResult = StringParsers.digits.run('123abc');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe('123');
    expect(pResult.index).toBe(3);
  });

  test("can parse with error successfully", () => {
    const pResult = StringParsers.digits.run('abc123');  
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});

// word parser functonality
describe("word parser functionality", () => {

  test("can parse words characters successfully", () => {
    const pResult = StringParsers.word.run('aa123_abc#aa');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe('aa123_abc');
    expect(pResult.index).toBe(9);
  });

  test("can parse with error successfully", () => {
    const pResult = StringParsers.word.run('#abc123');  
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});


// varname parser functonality
describe("varname parser functionality", () => {

  test("can parse varname staring with alphabet successfully", () => {
    const pResult = StringParsers.word.run('aa123abc');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe('aa123abc');
    expect(pResult.index).toBe(8);
  });

  test("can parse varname staring with digits successfully", () => {
    const pResult = StringParsers.word.run('1a123abc');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe('1a123abc');
    expect(pResult.index).toBe(8);
  });

  test("can parse varname staring with _ successfully", () => {
    const pResult = StringParsers.word.run('_a123abc');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe('_a123abc');
    expect(pResult.index).toBe(8);
  });

  test("can parse with error successfully", () => {
    const pResult = StringParsers.word.run('#abc123');  
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});



