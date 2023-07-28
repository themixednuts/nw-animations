import { xpathmatch } from "../utils/xpathmatch.js"
import { AnimationQuery } from "./types.js"
import path from 'path'
import { JSDOM } from 'jsdom'
//@ts-ignore
import saxon from 'saxon-js'


type Param = [AnimationQuery, boolean?]
export async function handleQuery(filePath: string, params: Param) {
  if (!path.basename(filePath).includes(".adb")) {
    return
  }

  const baseName = path.basename(filePath, '.adb')

  console.time(baseName)
  const query = params[0]
  const match = params[1] || false
  const xml = await saxon.getResource({
    file: filePath,
    type: "xml"
  })

  const fragment = query.fragment ? `//${query.fragment}` : ''
  const tags = query.tags ? `[${xpathmatch("Tags", query.tags.join("+"), match)}]` : ''

  const proceduralQuery = []
  const type = query.type ? xpathmatch("type", query.type, match) : ''
  const contextType = query.contexttype ? xpathmatch("contextType", query.contexttype, match) : ''

  const newAction = query.newaction ? `lower-case(ProceduralParams/NewAction/@value) = lower-case("${query.newaction}")` : ''
  const newFragment = query.newfragment ? `lower-case(ProceduralParams/NewFragment/@value) = lower-case("${query.newfragment}")` : ''
  const damageTableRow = query.damagetablerow ? `lower-case(ProceduralParams/DamageTableRow/@value) = lower-case("${query.damagetablerow}")` : ''
  const damageKey = query.damagekey ? `lower-case(ProceduralParams/DamageKey/@value) = lower-case("${query.damagekey}")` : ''
  const condition = query.condition ? `lower-case(ProceduralParams/Condition/@value) = lower-case("${query.condition}")` : ''
  const name = query.name ? `lower-case(ProceduralParams/Name/@value) = lower-case("${query.name}")` : ''

  const variables = [type, contextType, newAction, newFragment, damageTableRow, damageKey, condition, name];
  proceduralQuery.push(...variables.filter((value) => value));

  const procedural = proceduralQuery.length > 0 ? `[Procedural[${proceduralQuery.join(" and ")}]]` : ''
  const expression = `${fragment}//Fragment${tags}/ProcLayer${procedural}`

  //console.log(expression)

  const evaluation = saxon.XPath.evaluate(expression, xml)
  const serialized = saxon.serialize(evaluation)
  const xmlEval = serialized //.replace('<?xml version="1.0" encoding="UTF-8"?>', "")
  const dom = new JSDOM(xmlEval)
  const doc = dom.window.document.querySelector('body')?.innerHTML

  console.timeEnd(baseName)
  return doc
}
