import { StateUtils } from "./parser-state";
import { IParser, Parser } from "./parser";

/**
 * Combinator functions that returns a parser which matches the input parser 0 or more times 
 * @param parser parser to match multiple times
 * @returns parser that matches input parser multiple times
 */
export function Many(parser: IParser): IParser{
  return new Parser((state) => {

    if(state.isError){
      return state;
    }

    let nextState = parser.parse(state);
    let res = [];
    while(!nextState.isError){
      state = nextState;
      res.push(state.result);
      nextState = parser.parse(state);
    }

    return StateUtils.withResult(state, res);
  });
}

/**
 * Combinator functions that returns a parser which matches the input parser 1 or more times 
 * @param parser parser to match multiple times
 * @returns parser that matches input parser multiple times
 */
export function Many1(parser: IParser): IParser {
  return new Parser((state) => {
    if(state.isError){
      return state;
    }

    let nextState = parser.parse(state);
    let res = [];
    while(!nextState.isError){
      state = nextState;
      res.push(state.result);
      nextState = parser.parse(state);
    }

    if(res.length){
      return StateUtils.withResult(state, res);
    }else {
      return nextState;
    }
  })
}

/**
 * Combinator function that returns a parser which matches the provided sequence of parsers in order
 * @param parsers sequence of parsers to match
 * @returns parser that matches sequence of input parsers
 */
export function Sequence(parsers: IParser[]): IParser {
  return new Parser((state) => {
    if(state.isError){
      return state;
    }

    let res = [];
    let nextState = state;
    for(let p of parsers){
      nextState = p.parse(nextState);
      if(nextState.isError){
        return nextState;
      }

      res.push(nextState.result);
    }

    return StateUtils.withResult(nextState, res);
  });
}

/**
 * Combinator function that returns a parser which matches any of the provided parsers
 * @param parsers choices of parsers to choose from
 * @returns parser that matches any of the provided parsers
 */
export function Choice(parsers: IParser[]): IParser {
  return new Parser((state) => {
    if(state.isError){
      return state;
    }

    let nextState = state;
    for(let p of parsers){
      nextState = p.parse(nextState);
      // found a match
      if(!nextState.isError){
        return nextState;
      }
    }

    return StateUtils.withError(state, `ParseError: Failed to match any choice at index ${state.index}`);
  });
}

/**
 * Combinator function that returns a parser which matches the provided parser surrounded by seperator parser
 * @param parser parser to match
 * @param seperator separator parser that surrounds the main parser
 * @returns new parser matching the provided parses surrounded by separator parser
 */
export function Between(parser: IParser, seperator: IParser): IParser {
  return Sequence([seperator, parser, seperator]).map(res => res[1]);
}

/**
 * Combinator function that returns a parser which matches the provided parser multiple time
 * with ecach match separated by the provided separator function
 * @param parser parser to match
 * @param seperator parser to be used as separator between matches
 * @returns parser matching the given parser multiple times with each match separated by provided parser
 */
export function SeptBy(parser: IParser, seperator: IParser): IParser {
  return new Parser((state) => {
    if(state.isError){
      return state;
    }

    let nextState = state;
    let res = [];
    while(!nextState.isError){
      // match parser
      nextState = parser.parse(nextState);
      if(nextState.isError){
        break;
      }
      res.push(state.result);

      // match separator
      nextState = seperator.parse(nextState);
      if(!nextState.isError){
        state = nextState;
      }
    }

    return StateUtils.withResult(state, res);
  })
}

