import { xpathlowercase } from "./xpathlowercase.js";

export function xpathlocalname(str: string) {
  return `[${xpathlowercase('local-name()')} = '${str.toLowerCase()}']`
}
