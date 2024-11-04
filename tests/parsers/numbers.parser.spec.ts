import NumberParsers from "../../src/parsers/numbers";

// integer parser functonality
describe("integer parser functionality", () => {

  test("can parse positive integers successfully", () => {
    const pResult = NumberParsers.integer.run('12');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe(12);
    expect(pResult.index).toBe(2);
  });
  
  test("can parse negative integers successfully", () => {
    const pResult = NumberParsers.integer.run('-12');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe(-12);
    expect(pResult.index).toBe(3);
  });

  test("can parse with errors", () => {
    const pResult = NumberParsers.integer.run('abaabbcc');  
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

  test("should parse only intergers", () => {
    const pResult = NumberParsers.integer.run('12.11');  
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe(12);
    expect(pResult.index).toBe(2);
  });

});

// float parser functonality
describe("float parser functionality", () => {

  test("can parse positive float values successfully", () => {
    const pResult = NumberParsers.float.run('12.11');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe(12.11);
    expect(pResult.index).toBe(5);
  });
  
  test("can parse negative float values successfully", () => {
    const pResult = NumberParsers.float.run('-12.11');
    expect(pResult.isError).toBe(false);
    expect(pResult.result).toBe(-12.11);
    expect(pResult.index).toBe(6);
  });

  test("can parse with errors", () => {
    const pResult = NumberParsers.float.run('abaabbcc');  
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

  test("should parse only float values", () => {
    const pResult = NumberParsers.float.run('12');  
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});


// scientific parser functonality
describe("scientific number parser functionality", () => {

  test("can parse scientific numbers successfully", () => {
    const pResult = NumberParsers.scientificNumber.run('1.2e1abcd');
    expect(pResult.isError).toBe(false);
    expect(pResult.result.value).toBe(12);
    expect(pResult.result.str).toBe('1.2e1');
    expect(pResult.index).toBe(5);
  });
  
  test("can parse scientific numbers with negative powers", () => {
    const pResult = NumberParsers.scientificNumber.run('1.2e-1abcd');
    expect(pResult.isError).toBe(false);
    expect(pResult.result.value).toBe(0.12);
    expect(pResult.result.str).toBe('1.2e-1');
    expect(pResult.index).toBe(6);
  });

  test("can parse with errors", () => {
    const pResult = NumberParsers.scientificNumber.run('a1.2e1abcd');
    expect(pResult.isError).toBe(true);
    expect(pResult.index).toBe(0);
  });

});