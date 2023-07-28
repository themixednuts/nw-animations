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
