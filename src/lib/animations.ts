import { createParamsExpression } from "../utils/createparamsexpression.js"
import { xpathmatch } from "../utils/xpathmatch.js"
import { AnimationQuery, AnimationQueryResult} from "./types.js"
/**
 * @param doc - xmldoc string
 * @param [query={}] - case-insensitive 
 * @param [match=false] - used for tags query to return only exact match, else just checks if it 
 * contains the string array
 *
 * @example
 * ```typescript
 * const query: AnimationQuery = {
 *  tags: ['axe', '1h_melee'],
 *  fragment: "Attack_Primary"
 * }
 * const result = await animationsQuery(query)
 * ```
 */
export async function animationQuery(doc: Document, query: AnimationQuery, match: boolean = false) {
  const fragment = query.fragment ? `${query.fragment.toLowerCase()}/` : ''
  const tags = query.tags ? `[${xpathmatch("tags", query.tags.join("+"), match)}]` : ''

  const type = query.type ? xpathmatch("type", query.type, match) : ''
  const contextType = query.contexttype ? xpathmatch("contextType", query.contexttype, match) : ''
  const proceduralVariables = [type, contextType].filter(value => value)

  const newAction = createParamsExpression(query.newaction, 'NewAction')
  const newFragment = createParamsExpression(query.newfragment, 'NewFragment')
  const damageTableRow = createParamsExpression(query.damagetablerow, 'DamageTableRow')
  const damageKey = createParamsExpression(query.damagekey, 'DamageKey')
  const condition = createParamsExpression(query.condition, 'Condition')
  const name = createParamsExpression(query.name, 'Name')

  const paramsVariables = [newAction, newFragment, damageTableRow, damageKey, condition, name].filter(value => value);

  const proceduralQuery = proceduralVariables.length > 0 ? proceduralVariables.join(" and ") : ''
  const paramsQuery = paramsVariables.length > 0 ? `.//proceduralparams[${paramsVariables.join(" and ")}]` : ''
  const comboQuery = paramsQuery && proceduralQuery ? `[${proceduralQuery} and ${paramsQuery}]` : `[${proceduralQuery || paramsQuery}]`

  const procedural = `[.//procedural${comboQuery}]`
  const expression = `//${fragment}fragment${tags}/proclayer${procedural}`

  //console.log(expression)
  const evaluation = doc.evaluate(expression, doc, null, 5, null)

  let node = evaluation.iterateNext() as HTMLUnknownElement | null
  const result: AnimationQueryResult[][] = []
  while (node) {
    const fragmentName = node.closest("fragment")?.parentNode?.nodeName

    const blends = node.querySelectorAll('blend')
    const procedurals = node.querySelectorAll('procedural')

    const eleResult: AnimationQueryResult[] = []

    for (let i = 0; i < blends.length; i++) {

      const obj: AnimationQueryResult = {
        fragment: fragmentName || '',
        starttime: '',
        exittime: '',
        duration: '',
        curvetype: '',
        type: '',
        contexttype: '',
        proceduralparams: {}
      }

      for (const attribute of blends[i]?.attributes) {
        obj[attribute.nodeName] = attribute.nodeValue || ''
      }

      if (procedurals[i]) {
        for (const attribute of procedurals[i].attributes) {
          obj[attribute.nodeName] = attribute.nodeValue || ''
        }
      }
      const params = procedurals[i]?.querySelector('ProceduralParams')
      if (!params) continue
      obj.proceduralparams = {} as { [key: string]: string }
      for (const child of params.querySelectorAll('*')) {
        obj.proceduralparams[child.nodeName.toLowerCase()] = child.getAttribute('value')?.valueOf() || ''
      }
      eleResult.push(obj)
    }

    if (eleResult.length > 0) {
      result.push(eleResult)
    }

    node = evaluation.iterateNext() as HTMLUnknownElement | null
  }
  return result
}
