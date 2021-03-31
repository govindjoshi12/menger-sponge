import { Mat3, Mat4, Vec3, Vec4 } from "../lib/TSM.js";

/* A potential interface that students should implement */
interface IMengerSponge {
  setLevel(level: number): void;
  isDirty(): boolean;
  setClean(): void;
  normalsFlat(): Float32Array;
  indicesFlat(): Uint32Array;
  positionsFlat(): Float32Array;
}

/**
 * Represents a Menger Sponge
 */
export class MengerSponge implements IMengerSponge {

  // These are immutable
  private currPositions: number[];
  private currIndices: number[];
  private currNormals: number[];

  // TODO: sponge data structures
  private level: number = 1;
  private min: number = -1;
  private max: number = 1;
  private dirty: boolean = false;

  private numVertex: number = 8;
  private coordDim: number = 4;

  constructor(level: number) {
    this.resetDataStructures();
    // console.log(level);
	  this.setLevel(level);
  }

  resetDataStructures(): void {
    this.currPositions = [];
    this.currIndices = [];
    this.currNormals = [];
  }

  // Returns an array of positions representing a cube 
  // bounded by min and max
  public newCube(min: number, max: number): number[] {
    // First 4 coordinates are bottom face, from (0,0,0) clockwise
    // Next 4 are clockwise from (0,1,0)
    return [min, min, min, 1.0, 
            max, min, min, 1.0, 
            max, min, max, 1.0, 
            min, min, max, 1.0,
            min, max, min, 1.0, 
            max, max, min, 1.0, 
            max, max, max, 1.0, 
            min, max, max, 1.0];
  }

  public cubeIndicesOffset(offset: number): number[] {
    let arr: number[] = [0, 1, 2, // Bottom Face 
                        0, 2, 3, 
                        2, 6, 5, // Right Face
                        2, 5, 1,
                        4, 5, 6, // Top Face
                        4, 6, 7,
                        7, 3, 0, // Left Face
                        7, 0, 4,
                        3, 7, 6, // Front Face
                        3, 6, 2,
                        0, 4, 5, // Back Face
                        0, 5, 1];
    arr = arr.map(n => n + offset);
    return arr;
  }

  // TODO: How to compute normals?
  public computeNormals(): number[] {
    return [1.0, 0.0, 1.0, 0.0, 
            0.0, 0.0, 1.0, 0.0, 
            1.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            1.0, 0.0, 1.0, 0.0,
            1.0, 0.0, 1.0, 0.0,
            1.0, 0.0, 1.0, 0.0,
            1.0, 0.0, 1.0, 0.0];
  }

  // Assuming that the recursively generated
  // Cube is at the bottom-back-left corner
  public translations(factor: number): number[] {
    let arr: number[] = [1, 0, 0, 0,
                         2, 0, 0, 0,
                         0, 1, 0, 0,
                         2, 1, 0, 0,
                         0, 2, 0, 0,
                         1, 2, 0, 0,
                         2, 2, 0, 0,
                         0, 0, 1, 0,
                         2, 0, 1, 0,
                         0, 2, 1, 0,
                         2, 2, 1, 0,
                         0, 0, 2, 0,
                         1, 0, 2, 0,
                         2, 0, 2, 0,
                         0, 1, 2, 0,
                         2, 1, 2, 0,
                         0, 2, 2, 0,
                         1, 2, 2, 0,
                         2, 2, 2, 0];
    arr = arr.map(n => n * factor);
    return arr;
  }

  /**
   * Returns true if the sponge has changed.
   */
  public isDirty(): boolean {
       return this.dirty;
  }

  public setClean(): void {
    this.dirty = false;
  }
  
  public setLevel(level: number)
  {
    // TODO: initialize the cube
    /*
      // Starting with single base cube
      this.currPositions = this.newCube(this.min, this.max);
      this.currIndices = this.cubeIndicesOffset(0);
      // Figure out how normals work
      this.currNormals = this.computeNormals();
    */
    
    // No optimization. Remakes sponge every time.
    this.resetDataStructures();
    this.level = level;
    console.log("Im choosing level: " + level);
    this.recursiveMengerSponge(3, this.min, this.max);
    this.computeNormals();
  }

  // Wanted to return array of points, but
  // need to alter triangle indices array.
  // Thus, making changes within method
  // instead of just returning new arrays.
  recursiveMengerSponge(level: number, min: number, max: number): void {
    // Base Case
    if(level == 1) {
      // Concat is much slower than push
      let cubePos = this.newCube(min, max);
      cubePos.forEach(function(elem) {
        this.currPositions.push(elem);
      }, this)

      // let offset = ((this.currPositions.length / this.numVertex) - 1) * this.numVertex;
      // This is mathematically equivalent to length - 8. Does this make sense? Yes.
      let offset = (this.currPositions.length / this.coordDim) - this.numVertex;
      // console.log(offset);
      let indices = this.cubeIndicesOffset(offset);
      indices.forEach(function(elem) {
        this.currIndices.push(elem);
      }, this)

      return;
    }

    // Recursively make new cube which is 1/3 the size based on passed min and max
    // Make 20 copies and transform to appropriate locations (hardcode? for loop?)
    let startIdx = this.currPositions.length;
    let newLength = (Math.abs(min) + Math.abs(max)) / 3;
    this.recursiveMengerSponge(level - 1, min, min + newLength);

    // Need to transform this cube to each of the remaining 19 locations
    // and its triangle indicies to currIndices
    let currCube : number[] = this.currPositions.slice(startIdx);
    let translations : number[] = this.translations(newLength);

    for(let i = 0; i < translations.length; i+=4) {
      let transCube: number[] = [];
      for(let j = 0; j < currCube.length; j += 4) {
        transCube.push(currCube[j] + translations[i]);
        transCube.push(currCube[j+1] + translations[i+1]);
        transCube.push(currCube[j+2] + translations[i+2]);
        transCube.push(currCube[j+3] + translations[i+3]);
      }

      transCube.forEach(function(elem) {
        this.currPositions.push(elem);
      }, this)

      let offset = (this.currPositions.length / this.coordDim) - currCube.length;
      let indices = this.cubeIndicesOffset(offset);
      indices.forEach(function(elem) {
        this.currIndices.push(elem);
      }, this)
    }
  }

  /* Returns a flat Float32Array of the sponge's vertex positions */
  public positionsFlat(): Float32Array {
	  // TODO: right now this makes a single triangle. Make the cube fractal instead.
    // return new Float32Array([1.0, 0.0, 0.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0]);
  
    return new Float32Array(this.currPositions);
  }

  /**
   * Returns a flat Uint32Array of the sponge's face indices
   */
  public indicesFlat(): Uint32Array {
    // TODO: right now this makes a single triangle. Make the cube fractal instead.
    return new Uint32Array(this.currIndices);
  }

  /**
   * Returns a flat Float32Array of the sponge's normals
   */
  public normalsFlat(): Float32Array {
	  // TODO: right now this makes a single triangle. Make the cube fractal instead.
    // return new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0]);

    return new Float32Array(this.currNormals);
  }

  /**
   * Returns the model matrix of the sponge
   */
  public uMatrix(): Mat4 {

    // TODO: change this, if it's useful
    const ret : Mat4 = new Mat4().setIdentity();

    return ret;    
  }
  
}
