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
  animation?: string, //name of action
  fragment?: FragmentQuery,
}

export type FragmentQuery = {
  tags?: string[],
  proclayer?: ProcLayerQuery,
}

export type ProcLayerQuery = {
  // blend?: BlendQuery,
  procedural?: ProceduralQuery,
}

export type BlendQuery = {
  exittime?: string,
  starttime?: string,
  duration?: string,
  curvetype?: string,
}

export type ProceduralQuery = {
  type?: string,
  contexttype?: string,
  params?: ProceduralParamsQuery,
}

export type ProceduralParamsQuery = {
  [key: string]: string | undefined,
  newaction?: string,
  newfragment?: string,
  condition?: string,
  damagekey?: string,
  damagetablerow?: string,
  name?: string,
}

export type ProceduralParamsData = {
  [key: string]: string
}

export type AnimationData = {
  Animation?: string,
  Fragments?: FragmentData[]
}

export type FragmentData = {
  Tags?: string,
  ProcLayers?: ProcLayerData[][]
}

export type ProcLayerData = {
  StartTime?: string,
  ExitTime?: string,
  Duration?: string,
  CurveType?: string,
  type?: string,
  contextType?: string,
  ProceduralParams?: ProceduralParamsData
}
