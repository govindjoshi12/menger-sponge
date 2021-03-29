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

  // TODO: sponge data structures
  public level: number;

  constructor(level: number) {
	  this.setLevel(level);
	  // TODO: other initialization	
  }

  /**
   * Returns true if the sponge has changed.
   */
  public isDirty(): boolean {
       return true;
  }

  public setClean(): void {
  }
  
  public setLevel(level: number)
  {
    this.level = level;
	  // TODO: initialize the cube
  }

  /* Returns a flat Float32Array of the sponge's vertex positions */
  public positionsFlat(): Float32Array {
	  // TODO: right now this makes a single triangle. Make the cube fractal instead.
	  let min = -0.5;
    let max = 0.5; 
    return new Float32Array([min, min, min, 1.0, 
                            min, min, max, 1.0, 
                            min, max, max, 1.0,
                            min, max, min, 1.0,
                            max, min, max, 1.0,
                            max, min, min, 1.0,
                            max, max, min, 1.0,
                            max, max, max, 1.0,]);
  }

  /**
   * Returns a flat Uint32Array of the sponge's face indices
   */
  public indicesFlat(): Uint32Array {
    // TODO: right now this makes a single triangle. Make the cube fractal instead.

    return new Uint32Array([0, 1, 2, 3, 4, 5]);
  }

  /**
   * Returns a flat Float32Array of the sponge's normals
   */
  public normalsFlat(): Float32Array {
	  // TODO: right now this makes a single triangle. Make the cube fractal instead.
	  return new Float32Array([0.0, 0.0, 1.0, 0.0, 
                            0.0, 0.0, 1.0, 0.0, 
                            0.0, 0.0, 1.0, 0.0,
                            0.0, 0.0, 1.0, 0.0,
                            0.0, 0.0, -1.0, 0.0,
                            0.0, 0.0, -1.0, 0.0,
                            0.0, 0.0, -1.0, 0.0,
                            0.0, 0.0, -1.0, 0.0,]);
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
