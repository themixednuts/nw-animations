import { JSDOM } from 'jsdom'
import path from 'path'
import { writeFile, stat, readdir } from 'fs/promises'
import { Stats } from "fs"

//GLOBAL
const ANIMATIONDIRECTORY = 'E:/Extract/NW-Live/animations/mannequin/adb' //./animations/mannequin/adb
const ANIMATIONDATA: AnimnationData = {}

type AnimnationData = {
    [key: string]: FragmentData[]
}

type FragmentData = {
    [key: string]: string | FragmentNode[] | undefined,
    blendoutduration?: string,
    tags?: string,
    proclayer?: FragmentNode[]
}

type FragmentNode = ProcLayerData[]

type ProcLayerData = ProcLayerNode[]

type ProcLayerNode = {
    [key: string]: string | ProceduralParam | undefined,
    exittime?: string,
    starttime?: string,
    duration?: string,
    curvetype?: string,
    type?: string,
    contexttype?: string,
}
type ProceduralParam = {
    [key: string]: string | undefined,
}


async function main() {
    console.time('Total Time')
    await walkDir(ANIMATIONDIRECTORY, parseAnimations)
    await writeFile('./animations.json', JSON.stringify(ANIMATIONDATA, null, 2))
    console.timeEnd('Total Time')
}

async function parseXML(xml: string) {
    const dom = await JSDOM.fromFile(xml)
    const document = dom.window.document
    return document
}

async function walkDir(dir: string, callback: Function) {
    const files = await readdir(dir)
    for (const file of files) {
        const filepath = path.join(dir, file)
        const stats = await stat(filepath)
        if (stats.isDirectory()) {
            await walkDir(filepath, callback)
        } else if (stats.isFile()) {
            await callback(filepath, stats)
        }
    }
}

async function parseAnimations(filePath: string, stats: Stats) {

    if (!path.basename(filePath).includes(".adb") || !path.basename(filePath).includes('player')) {
        return
    }

    const baseName = path.basename(filePath, '.adb')

    console.time(baseName)
    const document = await parseXML(filePath)
    const fragmentList = document.querySelector('FragmentList')

    if (!fragmentList) {
        console.log('No FragmentList found in ' + filePath)
        console.timeEnd(baseName)
        return
    }

    for (const fragmentName of fragmentList.children) {
        if (!ANIMATIONDATA[fragmentName.nodeName]) {
            ANIMATIONDATA[fragmentName.nodeName] = []
        }

        const fragmentObj: FragmentData = {}

        fragmentName.querySelectorAll('Fragment').forEach((fragmentChild) => {
            for (const attribute of fragmentChild.attributes) {
                if (!attribute.nodeValue) continue
                fragmentObj[attribute.nodeName] = attribute.nodeValue

            }

            fragmentObj["proclayer"] = []

            fragmentChild.querySelectorAll('ProcLayer').forEach((procLayer) => {
                const procLayerObj: FragmentNode = []

                const blends = procLayer.querySelectorAll('Blend')
                const procedurals = procLayer.querySelectorAll('Procedural')
                const arr: ProcLayerData = new Array(blends.length)

                for (let i = 0; i < blends.length; i++) {
                    const blendObj: ProcLayerNode = {}
                    for (const attribute of blends[i].attributes) {
                        if (!attribute.nodeValue) continue
                        blendObj[attribute.nodeName] = attribute.nodeValue
                    }
                    for (const attribute of procedurals[i].attributes) {
                        if (!attribute.nodeValue) continue
                        blendObj[attribute.nodeName] = attribute.nodeValue
                    }

                    const params = procedurals[i].querySelector('ProceduralParams')
                    if (params) {

                        for (const param of params.querySelectorAll('*')) {
                            const paramObj: ProceduralParam = {}

                            for (const attribute of param.attributes) {
                                if (!attribute.nodeValue) continue
                                paramObj[attribute.nodeName] = attribute.nodeValue
                            }
                            blendObj[param.nodeName.toLowerCase()] = paramObj
                        }
                    }

                    arr[i] = blendObj

                }
                procLayerObj.push(arr)

                fragmentObj.proclayer?.push(procLayerObj)
            })
        })

        ANIMATIONDATA[fragmentName.nodeName].push(fragmentObj)
    }

    console.timeEnd(baseName)
}



//entry
main()