import { IParser, IParserState, Parser, StateUtils } from './../base';

/**
 * Function that returns a parser which matches the provided regex
 * @param rgxStr regex string to match
 */
export function Regex(rgxStr: string, flags: string = ''): IParser{
  if(!rgxStr.startsWith('^')){
    rgxStr = '^' + rgxStr;
  }
  
  return new Parser((state: IParserState) => {
    
    if(state.isError){
      return state;
    }
    const rgx = new RegExp(rgxStr, flags);

    const inp = state.inputString.slice(state.index);
    if(inp.length == 0){
      return StateUtils.withError(state, `Unexpected end of input at index ${state.index}`);
    }

    // reset and check regex
    rgx.lastIndex = 0;
    const res = rgx.exec(inp);
    if(res){
      return StateUtils.updateResult(state, res[0], state.index + res[0].length);
    }else{
      return StateUtils.withError(state, `Parser error: Expected pattern ${rgxStr} at index ${state.index} but found ${inp.slice(0, 5)}`);
    }
  });
}

/**
 * Function that returns a parser which matches the passed string
 * @param str imput string to match
 */
export function Str(str: string): IParser{
  return new Parser((state) => {
    const inp = state.inputString.slice(state.index);

    if (inp.length == 0) {
      return StateUtils.withError(state, `Unexpected end of input`);
    }

    if (inp.startsWith(str)) {
      return StateUtils.updateResult(state, str, state.index + str.length);
    } else {
      return StateUtils.withError(state,
        `Parse Error: expected '${str}' but got ${inp.substring(0, str.length)} at index ${state.index}`
      );
    }
  });
};

/**
 * char parser, matches any single character
 * regex: .
 */
export const char = Regex('.');

/**
 * mathes a single alphabet from english chars
 * regex: [a-zA-Z]
 */
export const alphabet = Regex('[a-zA-Z]');

/**
 * mathes multiple alphabets from english chars, atleast one alphabet is required to parse successfully
 * regex: [a-zA-Z]+
 */
export const alphabets = Regex('[a-zA-Z]+');

/**
 * mathes a single digit char
 * regex: \d
 */
export const digit = Regex('\\d');

/**
 * mathes multiple digit chars, failing if no digit char is found
 * regex: \d+
 */
export const digits = Regex('\\d+');

/**
 * mathes a single word char (a-z, A-Z, 0-9, _) from english chars
 * regex: \w+
 */
export const word = Regex('\\w+');

/**
 * mathes common variable name, starts with _ or alphabet followed by alphabet, digit or underscore
 * note that this does not match '$' char like in js variable names
 * regex: [a-zA-Z_]w*
 */
export const varName = Regex('[a-zA-Z_]w*');


export default {
  Regex,
  char,
  alphabet,
  alphabets,
  digit,
  digits,
  word,
  varName
}
