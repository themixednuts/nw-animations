import { createParamsExpression } from "../utils/createparamsexpression.js"
import { xpathmatch } from "../utils/xpathmatch.js"
import { AnimationData, AnimationQuery, ProcLayerData } from "./types.js"
import { type JSDOM } from 'jsdom'
/**
 * @example
 * ```typescript
 * const file = readFileSync('./npc_commander_1h_swordanims.adb', { encoding: 'utf8' })
 * const dom = new JSDOM(file, { contentType: 'text/xml' })
 * const query: AnimationQuery = {
 *  animation: "Attack_Primary",
 *  fragment: {
 *    tags: ['axe', '1h_melee'],
 *  } 
 * }
 * const result = Query(dom.window.document, query)
 * ```
 */
export function Query(doc: JSDOM['window']['document'], query?: AnimationQuery, caseSensitive: boolean = false) {

  let expression = '//'
  if (query) {
    const { animation, fragment } = query
    if (animation) expression += `${animation.toLowerCase()}/`
    expression += 'fragment'
    if (fragment) {
      const { tags, proclayer } = fragment
      if (tags) expression += `[${xpathmatch("tags", tags.join("+"), caseSensitive)}]/`
      if (proclayer) {
        expression += '/proclayer'
        const { procedural } = proclayer
        if (procedural) {
          const procedurals = []
          const { type, contexttype, params } = procedural
          if (type) procedurals.push(xpathmatch("type", type, caseSensitive))
          if (contexttype) procedurals.push(xpathmatch("contextType", contexttype, caseSensitive))
          if (params) {
            const paramsList = []
            for (const [key, value] of Object.entries(params)) {
              paramsList.push(createParamsExpression(value, key))
            }

            if (procedurals.length && paramsList.length)
              expression += `[.//procedural[${procedurals.join(" and ")}] and .//proceduralparams[${paramsList.join(" and ")}]]`
            else if (procedurals.length && !paramsList.length)
              expression += `[.//procedural[${procedurals.join(" and ")}]]`
            else if (!procedurals.length && paramsList.length)
              expression += `[.//procedural[.//proceduralparams[${paramsList.join(" and ")}]]]`
          }
          else {
            if (procedurals.length)
              expression += `[.//procedural[${procedurals.join(" and ")}]]`
          }
        }
      }
    }
  }
  else
    expression += 'fragment/proclayer'

  console.log(expression)
  const evaluation = doc.evaluate(expression, doc, null, 5, null)

  const result: AnimationData[] = []
  let node = evaluation.iterateNext() as HTMLUnknownElement | null
  const resultIndex: Map<string, number> = new Map()
  const tagsIndex: Map<string, number> = new Map()

  while (node) {
    const fragment = node.closest("Fragment")
    if (!fragment) {
      node = evaluation.iterateNext() as HTMLUnknownElement | null
      continue
    }
    const tags = fragment.getAttribute("Tags") || ''
    const animation = fragment.parentNode?.nodeName!
    const blends = node.querySelectorAll('Blend')
    const procedurals = node.querySelectorAll('Procedural')


    const proclayer: ProcLayerData[] = []
    for (let i = 0; i < blends.length; i++) {
      const obj: ProcLayerData = {}
      for (const attribute of blends[i]?.attributes) {
        if (animation == 'Ability_Greatsword_Combo') {
          console.log(attribute.nodeName, attribute.nodeValue)
        }
        // @ts-ignore
        obj[attribute.nodeName] = attribute.nodeValue || ''
      }

      if (procedurals[i]) {
        for (const attribute of procedurals[i].attributes) {
          //@ts-ignore
          obj[attribute.nodeName] = attribute.nodeValue || ''
        }
      }

      const params = procedurals[i]?.querySelector('ProceduralParams')
      obj.ProceduralParams ??= {} as { [key: string]: string }
      if (params)
        for (const child of params.querySelectorAll('*')) {
          obj.ProceduralParams[child.nodeName] = child.getAttribute('value')?.valueOf() || ''
        }
      proclayer.push(obj)
    }

    if (!resultIndex.has(animation)) {
      resultIndex.set(animation, result.length)
      tagsIndex.set(animation + tags, 0)
      result.push({
        Animation: animation,
        Fragments: [{
          Tags: tags,
          ProcLayers: []
        }]
      })
      if (proclayer.length)
        result[result.length - 1].Fragments?.[0]?.ProcLayers?.push(proclayer)
    }
    else {
      const idx = resultIndex.get(animation)!
      if (!tagsIndex.has(animation + tags)) {
        result[idx].Fragments?.push({
          Tags: tags,
          ProcLayers: []
        })
        tagsIndex.set(animation + tags, result[idx]?.Fragments?.length! - 1)
      }
      const tagsIdx = tagsIndex.get(animation + tags)!
      if (proclayer.length)
        result[idx].Fragments?.[tagsIdx]?.ProcLayers?.push(proclayer)
    }

    node = evaluation.iterateNext() as HTMLUnknownElement | null
  }
  return result
}
