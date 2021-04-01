import { Mat3, Mat4, Vec3, Vec4 } from "../lib/TSM.js";

/* A potential interface that students should implement */
interface IFloor {
    normalsFlat(): Float32Array;
    indicesFlat(): Uint32Array;
    positionsFlat(): Float32Array;
}

/**
 * Represents a Menger Sponge
 */
export class Floor implements IFloor {

    // These are immutable
    private currPositions: number[];
    private currIndices: number[];
    private currNormals: number[];
    private coordDim: number = 4;
    private numVertex: number = 6;
    // TODO: Floor Data Structures
    private size: number = 5.0; // was 5.0
    private yaxis: number = -2.0;
    private amount: number = 500;

    constructor() {
        // TODO: other initialization	
        this.resetDataStructures();
        for (let x = -1 * this.amount; x < this.amount; x+= 5) {
            for (let z = -1 * this.amount; z < this.amount; z+= 5) {
                if (x + z & 0x1) { // white
                    this.newSquare(x, z, this.size);
                }
                else { // black
                    this.newSquare(x, z, this.size);
                }
            }
        }
    }

    resetDataStructures(): void {
        this.currPositions = [];
        this.currIndices = [];
        this.currNormals = [];
    }

    private newSquare(x: number, z: number, l: number): void {
        let squarePos =
                [x, this.yaxis, z, 1.0,
                    x, this.yaxis, z + l, 1.0,
                    x + l, this.yaxis, z, 1.0,

                    x + l, this.yaxis, z + l, 1.0,
                    x + l, this.yaxis, z, 1.0,
                    x, this.yaxis, z + l, 1.0];

        squarePos.forEach(function (elem) {
            this.currPositions.push(elem)
        }, this)

        // Normals
        for (let i = 0; i < squarePos.length; i += 12) {
            let a: Vec3 = new Vec3([squarePos[i], squarePos[i + 1], squarePos[i + 2]]);
            let b: Vec3 = new Vec3([squarePos[i + 4], squarePos[i + 5], squarePos[i + 6]]);
            let c: Vec3 = new Vec3([squarePos[i + 8], squarePos[i + 9], squarePos[i + 10]]);

            let normal = Vec3.cross(Vec3.difference(b, a), Vec3.difference(c, a));

            for (let j = 0; j < 3; j++) {
                this.currNormals.push(normal.x, normal.y, normal.z, 0.0);
            }
        }

        // Offset?
        let offset = (this.currPositions.length / this.coordDim) - this.numVertex;
        let indices = this.floorIndices(offset);
        indices.forEach(function (elem) {
            this.currIndices.push(elem);
        }, this)
    }

    public floorIndices(offset: number): number[] {
        // Array from 0 to 35
        let arr: number[] = [...Array(this.numVertex).keys()];
        arr = arr.map(n => n + offset);
        return arr;
    }

    /* Returns a flat Float32Array of the floor's vertex positions */
    public positionsFlat(): Float32Array {
        // TODO: make floor pos
        //return new Float32Array([1.0, 0.0, 0.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0]);
        return new Float32Array(this.currPositions);
    }

    /**
     * Returns a flat Uint32Array of the floor's face indices
     */
    public indicesFlat(): Uint32Array {
        // TODO: make floor indices
        return new Uint32Array(this.currIndices);
    }

    /**
     * Returns a flat Float32Array of the floor's normals
     */
    public normalsFlat(): Float32Array {
        // TODO: make floor normals
        return new Float32Array(this.currNormals);
    }

    /**
     * Returns the model matrix of the floor
     */
    public uMatrix(): Mat4 {

        // TODO: change this, if it's useful
        const ret: Mat4 = new Mat4().setIdentity();

        return ret;
    }

}