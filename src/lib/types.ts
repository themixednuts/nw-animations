/**
 * [ fragment ] - Name of Animation
 * [ tags ] - Array string of Mannequin tags inclusive
 * [ newaction ] - Name of Action thats triggered by Animation
 * [ newfragment ] - Name of Animation thats triggered by Animation
 * [ condition ] - Name of Condition to check
 * [ damagekey ] - Order of Attack
 * [ damagetablerow ] - DamageID
 * [ name ] - Name of Condition that gets set
 *
 * @example
 * {
 *  fragment: "Attack_Primary",
 *  tags: ['axe','1h_melee']
 * }
 */
export type AnimationQuery = {
  [key: string]: string | string[] | undefined,
  fragment?: string, //name of action
  tags?: string[],
  type?: string,
  contexttype?: string,
  newaction?: string,
  newfragment?: string,
  condition?: string,
  damagekey?: string,
  damagetablerow?: string,
  name?: string,
}

export type Param = [AnimationQuery, boolean]

export type ProceduralParamsData = {
  [key: string]: string
}

export type BlendsData = {
  starttime: string,
  exittime: string,
  duration: string,
  curvetype: string
}

export type ProceduralData = {
  type: string,
  contexttype: string
}


export type AnimationQueryResult = {
  [key: string]: string | ProceduralParamsData,
  fragment: string,
  starttime: string,
  exittime: string,
  duration: string,
  curvetype: string,
  type: string,
  contexttype: string,
  proceduralparams: ProceduralParamsData
}

export type QueryOptions = {
  match: boolean,
  type: "text" | "file" | "uri"
}

export type SaxonOptions = {
  file?: string,
  location?: string,
  text?: string,
  type?: "xml" | "text" | "json",
  encoding?: "utf8" | "ucs2" | "utf16le" | "latin1" | "ascii",
  baseURI?: string,
  headers?: {}
}


