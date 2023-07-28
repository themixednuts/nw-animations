import path from 'path'
import { writeFile, stat, readdir, mkdir, access } from 'fs/promises'
import { handleQuery } from './lib/animations.js'
import { AnimationQuery } from './lib/types.js'
import { env } from './utils/config.js'

//GLOBAL
const ANIMATIONDIRECTORY = env ? process.env.ANIMATIONDIRECTORY : '' //{nw-directory}/animations/mannequin/adb

/**
 * @param [query={}] - case-insensitive 
 *
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
export default async function queryAnimation(query: AnimationQuery = {}, match: boolean = false) {
  console.time('Total Time')
  const result: string[] = await walkDir(ANIMATIONDIRECTORY || '', handleQuery, [query, match])
  console.timeEnd('Total Time')
  console.log(result[0])
  return result
}

async function walkDir(dir: string, callback: Function, params?: {}[]) {
  const values = []
  const files = await readdir(dir)
  for (const file of files) {
    const filepath = path.join(dir, file)
    const stats = await stat(filepath)
    if (stats.isDirectory()) {
      await walkDir(filepath, callback, params)
    } else if (stats.isFile()) {
      const value = await callback(filepath, params)
      if (value) values.push(value)
    }
  }
  return values
}

//entry
queryAnimation({
  fragment: "Attack_Primary",
  damagetablerow: "1H_Club_Attack1",
  damagekey: "atk1",
  type: "cage-damage"
})
