import walkdir from 'walkdir'
import { JSDOM } from 'jsdom'
import { animationQuery } from '../src/lib/animations.js'
import { readFile } from 'fs/promises'
import { AnimationQuery } from '../src/lib/types.js'

const ANIMATIONDIRECTORY = "E:/Extract/NW-Live/animations/mannequin/adb" //{nw-directory}/animations/mannequin/adb

function test() {
  const query: AnimationQuery = {
    //fragment: "Attack_Primary",
    //damagetablerow: "Hatchet_Damage_PrimaryAttack",
    damagekey: "atk2",
    type: "cage-damage"
    //newfragment: 'Hatchet_Damage_PrimaryAttack',
    //tags: ["axe"],

  }

  walkdir(ANIMATIONDIRECTORY)
    .on("file", async (path) => {
      const file = await readFile(path)
      const dom = new JSDOM(file).window.document
      console.time(path)
      const result = await animationQuery(dom, query)

      if (result && result.length > 0) {
        //console.log(result, result[0][0].proceduralparams)
      }
      console.timeEnd(path)
    })
    .on("error", (err) => {
      console.log("there was an error I guess", err)
    })

}

test()
