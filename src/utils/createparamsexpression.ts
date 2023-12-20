// import { xpathlocalname } from "./xpathlocalname.js";
import { xpathlowercase } from "./xpathlowercase.js";

export function createParamsExpression(query: string | undefined, nodeName: string) {
  return query ? `.//${nodeName.toLowerCase()}[${xpathlowercase('@value')}='${query.toLowerCase()}']` : ''
}
