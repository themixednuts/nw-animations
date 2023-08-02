import path from 'path'
import { writeFile, stat, readdir, mkdir, access, readFile } from 'fs/promises'
import { animationQuery } from './lib/animations.js'
import { AnimationQuery, AnimationQueryResult } from './lib/types.js'

export default async function main(query: AnimationQuery = {}, match: boolean = false) {
}

async function walkDir(dir: string, callback: Function, params: [AnimationQuery, boolean]) {
  const values = []
  const files = await readdir(dir)

  for (const file of files) {
    const filepath = path.join(dir, file)
    const stats = await stat(filepath)
    if (stats.isDirectory()) {
      await walkDir(filepath, callback, params)
    } else if (stats.isFile()) {
      const str = await readFile(filepath, { encoding: 'utf8' })
      const value = await callback(str, ...params)
      if (value && value.length > 0) values.push(value)
    }
  }
  return values
}

//entry
main({
  fragment: "Attack_Primary",
  //damagetablerow: "1H_Club_Attack1",
  //damagekey: "atk1",
  type: "cage-damage"
})
