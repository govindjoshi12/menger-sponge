/* <<<{ */
import { Vec3, Vec4 } from "../lib/TSM.js";
/*
    List Utility Functions
*/
/* Concatenates a list onto itself repeatedly */
export function repeat(list, times) {
    let out = [];
    for (let i = 0; i < times; i++) {
        out = out.concat(list);
    }
    return out;
}
export function flattenListOfVec(listofVec) {
    const out = new Array();
    if (listofVec[0] instanceof Vec3) {
        listofVec.forEach((e) => out.push(e.x, e.y, e.z));
    }
    else if (listofVec[0] instanceof Vec4) {
        listofVec.forEach((e) => out.push(e.x, e.y, e.z, e.w));
    }
    return out;
}
// You will likely want to add extra helper functions throughout your project.
// Feel free to do so here!
//# sourceMappingURL=Utils.js.map