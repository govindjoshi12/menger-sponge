/* <<<{ */

import { Color } from "../lib/Colors.js";
import { Vec2, Vec3, Vec4 } from "../lib/TSM.js";
import _ from "../lib/Underscore.js";

/*
    List Utility Functions
*/

/* Concatenates a list onto itself repeatedly */
export function repeat<T>(list: T[], times: number): T[] {
  let out: T[] = [];
  for (let i = 0; i < times; i++) {
    out = out.concat(list);
  }
  return out;
}

export function flattenListOfVec(listofVec: Vec3[] | Vec4[]): number[] {
  const out: number[] = new Array<number>();
  if (listofVec[0] instanceof Vec3) {
    (listofVec as Vec3[]).forEach((e) => out.push(e.x, e.y, e.z));
  } else if (listofVec[0] instanceof Vec4) {
    (listofVec as Vec4[]).forEach((e) => out.push(e.x, e.y, e.z, e.w));
  }
  return out;
}

// You will likely want to add extra helper functions throughout your project.
// Feel free to do so here!
