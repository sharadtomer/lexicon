import { IParserState, StateUtils } from "./parser-state";

/**
 * Parser function that transforms parser state to some other state
 */
export type TStateTransformFunction = (state: IParserState) => IParserState;

/**
 * Transform function that transform result from one form to another
 * @param result previous result
 */
export type TResultTransformFunction = (result: any) => any;

/**
 * Transform function that transform error from one form to another
 * @param state Parser state that has error
 * @returns transformed error
 */
export type TErrorTransformFunction = (state: IParserState) => any;

/**
 * Parser selector function that returns next parser of use based on the presious parser result
 */
export type TParserSelectorFunction = (result: any) => Parser;

/**
 * Main parser definition
 * parser constructor takes in StateTransformFunction and parsers the input string accordingly
 * 
 */

export interface IParser {

  /** StateTransformFunction of this parser */
  parseFn: TStateTransformFunction;

  /**
  * Transform the input state according to the state transformation function
  * @param state input state
  * @returns output state
  */
  parse(state: IParserState): IParserState;

  /**
   * Parse the provide input string and report any result or error in the
   * form of IParserState
   * @param input string to parse
   */
  run(input: string): IParserState;

  /**
   * Transform the result of parser into another state, 
   * do nothing if parsing result in error
   * @param resultMapfn ResultTransformFunction to use for result transformation
   * @returns New parser that returns the transformed result after parsing using the original parser
   */
  map(resultMapfn: TResultTransformFunction): Parser;

  /**
   * Transform the error of parser into another state, 
   * do nothing if parsing completes without any error
   * @param errMapfn ErrorTransformFunction to use for error transformation
   * @returns New parser that returns the transformed error after parsing using the original parser
   */
  errMap(errMapfn: TErrorTransformFunction): Parser;

  /**
   * select the next parser dynamically based on result of current parser
   * 
   * @param selectorFn selector function that the next parser to use based on result of current parser
   * @returns New parser that runs the current parser and next dynamically selcted parser in sequence
   */
  chain(selectorFn: TParserSelectorFunction): Parser;
}

export class Parser {

  /** StateTransformFunction of this parser */
  parseFn: TStateTransformFunction;

  constructor(fn: TStateTransformFunction) {
    this.parseFn = fn;
  }

  /**
   * Transform the input state according to the state transformation function
   * @param state input state
   * @returns output state
   */
  parse(state: IParserState): IParserState {
    return this.parseFn(state);
  }

  /**
   * Parse the provide input string and report any result or error in the
   * form of IParserState
   * @param input string to parse
   */
  run(input: string): IParserState {
    const state = StateUtils.newState(input);
    return this.parse(state);
  }

  /**
   * Transform the result of parser into another state, 
   * do nothing if parsing result in error
   * @param resultMapfn ResultTransformFunction to use for result transformation
   * @returns New parser that returns the transformed result after parsing using the original parser
   */
  map(resultMapfn: TResultTransformFunction): Parser {
    return new Parser((state) => {
      // parse with current transformation function
      const nextState = this.parse(state);

      // do nothing for error state
      if (nextState.isError) {
        return nextState;
      }

      const transformedResult = resultMapfn(nextState.result);
      return StateUtils.withResult(nextState, transformedResult);
    });
  }

  /**
   * Transform the error of parser into another state, 
   * do nothing if parsing completes without any error
   * @param errMapfn ErrorTransformFunction to use for error transformation
   * @returns New parser that returns the transformed error after parsing using the original parser
   */
  errMap(errMapfn: TErrorTransformFunction): Parser {
    return new Parser((state) => {
      // parse with current transformation function
      const nextState = this.parse(state);

      // do nothing for successful parsing
      if (!nextState.isError) {
        return nextState;
      }

      const transformedError = errMapfn(nextState);
      return StateUtils.withError(nextState, transformedError);
    });
  }

  /**
   * select the next parser dynamically based on result of current parser
   * 
   * @param selectorFn selector function that the next parser to use based on result of current parser
   * @returns New parser that runs the current parser and next dynamically selcted parser in sequence
   */
  chain(selectorFn: TParserSelectorFunction): Parser {
    return new Parser((state) => {
      // parse with current transformation function
      const nextState = this.parse(state);

      // do nothing for error state
      if (nextState.isError) {
        return nextState;
      }

      // get next parser and parse
      const nextParser = selectorFn(nextState.result);
      return nextParser.parse(nextState);
    });
  }

}
