/**
 * Paser state structure
 */
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

/**
 * Utility class with a bunch of methods to handle state more easily
 */
export class StateUtils {

  /**
  * Get initial parser state for the provided input string
  * @param input initial input string
  */
  static newState(input: string): IParserState {
    return {
      inputString: input,
      index: 0,
      result: null,
      isError: false,
      err: null
    };
  }

  /**
   * return state with provided result immutably
   * 
   */
  static withResult(state: IParserState, result: any): IParserState {
    return {
      ...state,
      result
    };
  }

  /**
   * return state with provided error immutably
   * 
   */
  static withError(state: IParserState, err: any): IParserState {
    return {
      ...state,
      isError: true,
      err
    };
  }

  /**
   * update state result immutably
   * 
   */
  static updateResult(state: IParserState, result: any, newIndex: number): IParserState {
    return {
      ...state,
      index: newIndex,
      result
    };
  }

}