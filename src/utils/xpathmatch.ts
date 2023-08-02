import { xpathlowercase } from "./xpathlowercase.js";

export function xpathmatch(attribute: string, key: string, match: boolean) {
  const lowerStr = key.toLowerCase()
  return match ? `${xpathlowercase(`@${attribute}`)} = '${lowerStr}'` : `contains(${xpathlowercase(`@${attribute}`)}, '${lowerStr}')`
}
