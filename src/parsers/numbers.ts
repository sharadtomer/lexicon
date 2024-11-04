import { Regex } from "./strings";

/**
 * number parser, matches interger values
 * also support sign
 * regex: [+-]?\d+
 */
export const integer = Regex('[+-]?\\d+').map(res => parseInt(res));

/**
 * number parser, matches float values
 * also support sign
 * regex: [+-]?\d+\.\d+
 */
export const float = Regex('[+-]?\\d+\\.\\d+').map(res => parseFloat(res));

/**
 * scientific number parser, matches scientific notation,
 * result contains object with two properties,
 * str: actual string matched
 * value: parsed number value
 * regex: [+-]?[1-9]\d*(\.\d+[eE][+-]?\d+)
 */
export const scientificNumber = Regex('[+-]?[1-9]\\d*(\\.\\d+[eE][+-]?\\d+)').map(res => ({
  str: res,
  value: parseFloat(res)
}));

export default {
  integer,
  float,
  scientificNumber
};