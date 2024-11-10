# Lexicons

Collection of parsers bits for your next awesome parser

This library provides a bunch of tools and utility parsers to ease the process of creating parsers by using the combinators technique.

# Usage

All of the parsers are instances of Parser class. Every parser has one transformation function that transforms the input parser state to error or result after the parse operation.

Parser state is of following signature:
```
export interface IParserState {
  /** Initial input string */
  inputString: string;
  /** Current input string  */
  index: number;
  /** Result of running parser */
  result: any;
  /** If parsing resulted in any error */
  isError: boolean;
  /** Error resulting from parsing */
  err: any;
}
```

## Creating a new parser

You may create a new parser by one of the following two ways:
1. Combining/Using existing parsers
1. Creating new instance of Parser class

### Combining/Using existing parsers

There are bunch of handy parsers available to use. To check the list of all available parsers, check the 'List of parsers' section

```
import { NumberParsers } from '@sharadt/lexicons/parsers';
import { Choice } from '@sharadt/lexicons';

// create a parser that parses numbers float/interger/scientific values

var numberParser = Choice([
  NumberParsers.scientificNumber,
  NumberParsers.float,
  NumberParsers.integer
]);

var res = numberParser.run('123.12');

```

### Creating new instance of Parser class

Creating new parser is each, all we need to do is create an instance of Parser class by passing a parser transformer function to the Parser constructor. ex:
```
import { Parser, StateUtils } from '@sharadt/lexicons';

// create a new parser that parses bool values(true/false)
var boolParser = new Parser((state: IParserState) => {
  if(state.isError){
    return state;
  }

  const inp = state.inputString.slice(state.index);
  if(inp.length == 0){
    return StateUtils.withError(state, `Unexpected end of input at index ${state.index}`);
  }

  // reset and check regex
  if(inp.startsWith('true')){
    return StateUtils.updateResult(state, true, state.index + 4);
  }else if(inp.startsWith('false')){
    return StateUtils.updateResult(state, false, state.index + 5);
  }

  return StateUtils.withError(state, `Parser error: Expected bool at index ${state.index} but found ${inp.slice(0, 5)}`);
});

var res = boolParser.run('true');

```

# List of parsers

## Base
- Parser: Base class for all parsers and provides utility methods like run, parse, map, mapErr, chain.
- Many: factory function that returns a parser which matches the input parser 0 or more times.
- Many1: same as many but atleast one match is required to parse successfully.
- Sequence: factory function that returns a parser which matches the provided sequence of parsers in order
- Choice: factory function that returns a parser which matches any of the provided parsers
- Between: factory function that returns a parser which matches the provided parser surrounded by seperator parser
- SeptBy: factory function that returns a parser which matches the provided parser multiple time with each match separated by the provided separator parser
- Lazy: lazy evaluates a parser type, can be used in cases of circular dependency between parsers
- Contextual: chain multiple parsers in sequential manner without using a bunch of chain statements

## StringParsers
- Regex: factory function which returns a parser that parses the provided input string as regex.
- char: char parser, matches any single character. **regex: .**
- alphabet:  mathes a single alphabet from english chars. **regex: [a-zA-Z]**
- alphabets: mathes multiple alphabets from english chars, atleast one alphabet is required to parse successfully. **regex: [a-zA-Z]+**
- digit: mathes a single digit char. **regex: \d**
- digits: mathes multiple digit chars, failing if no digit char is found. **regex: \d+**
- word: mathes a single word char (a-z, A-Z, 0-9, _) from english chars. **\w+**
- varName: mathes common variable name, starts with _ or alphabet followed by alphabet, digit or underscore. **[a-zA-Z_]w**

## NumberParsers
- integer: matches interger values. **regex: [+-]?\d+**
- float: matches float values. **regex: [+-]?\d+\.\d+**
- scientificNumber: matches scientific notation, result is an object with properties str(actual string match) and value(parsed number value). **regex: [+-]?[1-9]\d*(\.\d+[eE][+-]?\d+)**
