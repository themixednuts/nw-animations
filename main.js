var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JSDOM } from 'jsdom';
import path from 'path';
import { writeFile, stat, readdir } from 'fs/promises';
//GLOBAL
const ANIMATIONDIRECTORY = 'E:/Extract/NW-Live/animations/mannequin/adb'; //./animations/mannequin/adb
const ANIMATIONDATA = {};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.time('Total Time');
        yield walkDir(ANIMATIONDIRECTORY, parseAnimations);
        yield writeFile('./animations.json', JSON.stringify(ANIMATIONDATA, null, 2));
        console.timeEnd('Total Time');
    });
}
function parseXML(xml) {
    return __awaiter(this, void 0, void 0, function* () {
        const dom = yield JSDOM.fromFile(xml);
        const document = dom.window.document;
        return document;
    });
}
function walkDir(dir, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield readdir(dir);
        for (const file of files) {
            const filepath = path.join(dir, file);
            const stats = yield stat(filepath);
            if (stats.isDirectory()) {
                yield walkDir(filepath, callback);
            }
            else if (stats.isFile()) {
                yield callback(filepath, stats);
            }
        }
    });
}
function parseAnimations(filePath, stats) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!path.basename(filePath).includes(".adb") || !path.basename(filePath).includes('player')) {
            return;
        }
        const baseName = path.basename(filePath, '.adb');
        console.time(baseName);
        const document = yield parseXML(filePath);
        const fragmentList = document.querySelector('FragmentList');
        if (!fragmentList) {
            console.log('No FragmentList found in ' + filePath);
            console.timeEnd(baseName);
            return;
        }
        for (const fragmentName of fragmentList.children) {
            if (!ANIMATIONDATA[fragmentName.nodeName]) {
                ANIMATIONDATA[fragmentName.nodeName] = [];
            }
            const fragmentObj = {};
            fragmentName.querySelectorAll('Fragment').forEach((fragmentChild) => {
                for (const attribute of fragmentChild.attributes) {
                    if (!attribute.nodeValue)
                        continue;
                    fragmentObj[attribute.nodeName] = attribute.nodeValue;
                }
                //@ts-ignore
                fragmentObj["ProcLayer"] = [];
                fragmentChild.querySelectorAll('ProcLayer').forEach((procLayer) => {
                    const procLayerObj = [];
                    const blends = procLayer.querySelectorAll('Blend');
                    const procedurals = procLayer.querySelectorAll('Procedural');
                    const arr = new Array(blends.length);
                    for (let i = 0; i < blends.length; i++) {
                        const blendObj = {};
                        for (const attribute of blends[i].attributes) {
                            if (!attribute.nodeValue)
                                continue;
                            blendObj[attribute.nodeName] = attribute.nodeValue;
                        }
                        for (const attribute of procedurals[i].attributes) {
                            if (!attribute.nodeValue)
                                continue;
                            blendObj[attribute.nodeName] = attribute.nodeValue;
                        }
                        const params = procedurals[i].querySelector('ProceduralParams');
                        if (params) {
                            for (const param of params.querySelectorAll('*')) {
                                const paramObj = {};
                                for (const attribute of param.attributes) {
                                    if (!attribute.nodeValue)
                                        continue;
                                    paramObj[attribute.nodeName] = attribute.nodeValue;
                                }
                                blendObj[param.nodeName.toLowerCase()] = paramObj;
                            }
                        }
                        arr[i] = blendObj;
                    }
                    procLayerObj.push(arr);
                    //@ts-ignore
                    fragmentObj["ProcLayer"].push(procLayerObj);
                });
            });
            ANIMATIONDATA[fragmentName.nodeName].push(fragmentObj);
        }
        console.timeEnd(baseName);
    });
}
//entry
main();
