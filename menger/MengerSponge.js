import { Mat4, Vec3 } from "../lib/TSM.js";
/**
 * Represents a Menger Sponge
 */
export class MengerSponge {
    constructor(level) {
        // TODO: sponge data structures
        this.level = -1; // First iteration
        this.min = -0.5;
        this.length = 1;
        this.dirty = false;
        this.numVertex = 36;
        this.coordDim = 4;
        this.resetDataStructures();
        // console.log(level);
        this.setLevel(level);
    }
    resetDataStructures() {
        this.currPositions = [];
        this.currIndices = [];
        this.currNormals = [];
    }
    // Returns an array of positions representing a cube 
    // bounded by min and max
    newCube(x, y, z, l) {
        let cubePos = [
            x, y, z, 1.0,
            x, y, z + l, 1.0,
            x, y + l, z + l, 1.0,
            x + l, y + l, z, 1.0,
            x, y, z, 1.0,
            x, y + l, z, 1.0,
            x + l, y, z + l, 1.0,
            x, y, z, 1.0,
            x + l, y, z, 1.0,
            x + l, y + l, z, 1.0,
            x + l, y, z, 1.0,
            x, y, z, 1.0,
            x, y, z, 1.0,
            x, y + l, z + l, 1.0,
            x, y + l, z, 1.0,
            x + l, y, z + l, 1.0,
            x, y, z + l, 1.0,
            x, y, z, 1.0,
            x, y + l, z + l, 1.0,
            x, y, z + l, 1.0,
            x + l, y, z + l, 1.0,
            x + l, y + l, z + l, 1.0,
            x + l, y, z, 1.0,
            x + l, y + l, z, 1.0,
            x + l, y, z, 1.0,
            x + l, y + l, z + l, 1.0,
            x + l, y, z + l, 1.0,
            x + l, y + l, z + l, 1.0,
            x + l, y + l, z, 1.0,
            x, y + l, z, 1.0,
            x + l, y + l, z + l, 1.0,
            x, y + l, z, 1.0,
            x, y + l, z + l, 1.0,
            x + l, y + l, z + l, 1.0,
            x, y + l, z + l, 1.0,
            x + l, y, z + l, 1.0
        ];
        cubePos.forEach(function (elem) {
            this.currPositions.push(elem);
        }, this);
        // Compute Normals
        for (let i = 0; i < cubePos.length; i += 12) {
            let a = new Vec3([cubePos[i], cubePos[i + 1], cubePos[i + 2]]);
            let b = new Vec3([cubePos[i + 4], cubePos[i + 5], cubePos[i + 6]]);
            let c = new Vec3([cubePos[i + 8], cubePos[i + 9], cubePos[i + 10]]);
            let normal = Vec3.cross(Vec3.difference(b, a), Vec3.difference(c, a));
            // Same normal for all three verts
            for (let j = 0; j < 3; j++)
                this.currNormals.push(normal.x, normal.y, normal.z, 0.0);
        }
        // let offset = ((this.currPositions.length / this.numVertex) - 1) * this.numVertex;
        // This is mathematically equivalent to length - 8. Does this make sense? Yes.
        let offset = (this.currPositions.length / this.coordDim) - this.numVertex;
        let indices = this.cubeIndices(offset);
        indices.forEach(function (elem) {
            this.currIndices.push(elem);
        }, this);
    }
    cubeIndices(offset) {
        // Array from 0 to 35
        let arr = [...Array(this.numVertex).keys()];
        arr = arr.map(n => n + offset);
        return arr;
    }
    // Assuming that the recursively generated
    // Cube is at the bottom-back-left corner
    translations(factor) {
        let arr = [0, 0, 0, 0,
            1, 0, 0, 0,
            2, 0, 0, 0,
            0, 0, 1, 0,
            2, 0, 1, 0,
            0, 0, 2, 0,
            1, 0, 2, 0,
            2, 0, 2, 0,
            0, 1, 0, 0,
            2, 1, 0, 0,
            0, 1, 2, 0,
            2, 1, 2, 0,
            0, 2, 0, 0,
            1, 2, 0, 0,
            2, 2, 0, 0,
            0, 2, 1, 0,
            2, 2, 1, 0,
            0, 2, 2, 0,
            1, 2, 2, 0,
            2, 2, 2, 0];
        arr = arr.map(n => n * factor);
        return arr;
    }
    /**
     * Returns true if the sponge has changed.
     */
    isDirty() {
        return this.dirty;
    }
    setClean() {
        this.dirty = false;
    }
    setLevel(level) {
        // TODO: initialize the cube
        // No optimization. Remakes sponge every time.
        if (level != this.level) {
            this.resetDataStructures();
            this.level = level;
            this.dirty = true;
            console.log("level: " + level);
            this.recursiveMengerSpongeXYZ(level, this.min, this.min, this.min, this.length);
        }
    }
    // Attempting extremely slow method where every cube is recursively made
    recursiveMengerSpongeXYZ(level, x, y, z, length) {
        // Base Case
        if (level == 1) {
            // Concat is much slower than push
            this.newCube(x, y, z, length);
            return;
        }
        let startIdx = this.currPositions.length;
        let newLength = length / 3;
        let translations = this.translations(newLength);
        for (let i = 0; i < translations.length; i += 4) {
            this.recursiveMengerSpongeXYZ(level - 1, x + translations[i], y + translations[i + 1], z + translations[i + 2], newLength);
        }
    }
    /* Returns a flat Float32Array of the sponge's vertex positions */
    positionsFlat() {
        // TODO: right now this makes a single triangle. Make the cube fractal instead.
        // return new Float32Array([1.0, 0.0, 0.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0]);
        return new Float32Array(this.currPositions);
    }
    /**
     * Returns a flat Uint32Array of the sponge's face indices
     */
    indicesFlat() {
        // TODO: right now this makes a single triangle. Make the cube fractal instead.
        return new Uint32Array(this.currIndices);
    }
    /**
     * Returns a flat Float32Array of the sponge's normals
     */
    normalsFlat() {
        // TODO: right now this makes a single triangle. Make the cube fractal instead.
        // return new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0]);
        return new Float32Array(this.currNormals);
    }
    /**
     * Returns the model matrix of the sponge
     */
    uMatrix() {
        // TODO: change this, if it's useful
        const ret = new Mat4().setIdentity();
        return ret;
    }
    // W.santed to return array of points, but
    // need to alter triangle indices array.
    // Thus, making changes within method
    // instead of just returning new arrays.
    recursiveMengerSponge(level, min, length) {
        // Base Case
        if (level == 1) {
            // Concat is much slower than push
            this.newCube(min, min, min, length);
            return;
        }
        // Recursively make new cube which is 1/3 the size based on passed min and max
        // Make 20 copies and transform to appropriate locations (hardcode? for loop?)
        let startIdx = this.currPositions.length;
        let newLength = length / 3;
        this.recursiveMengerSponge(level - 1, min, newLength);
        // Need to transform this cube to each of the remaining 19 locations
        // and its triangle indicies to currIndices
        let currCube = this.currPositions.slice(startIdx);
        let translations = this.translations(newLength);
        for (let i = 0; i < translations.length; i += 4) {
            let transCube = [];
            for (let j = 0; j < currCube.length; j += 4) {
                transCube.push(currCube[j] + translations[i]);
                transCube.push(currCube[j + 1] + translations[i + 1]);
                transCube.push(currCube[j + 2] + translations[i + 2]);
                transCube.push(currCube[j + 3] + translations[i + 3]);
            }
            transCube.forEach(function (elem) {
                this.currPositions.push(elem);
            }, this);
            let offset = (this.currPositions.length / this.coordDim) - currCube.length;
            let indices = this.cubeIndices(offset);
            indices.forEach(function (elem) {
                this.currIndices.push(elem);
            }, this);
        }
    }
}
//# sourceMappingURL=MengerSponge.js.map