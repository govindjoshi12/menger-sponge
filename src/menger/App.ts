import {
  CanvasAnimation,
  WebGLUtilities
} from "../lib/webglutils/CanvasAnimation.js";
import { GUI } from "./Gui.js";
import { MengerSponge } from "./MengerSponge.js";
import { mengerTests } from "./tests/MengerTests.js";
import {
  defaultFSText,
  defaultVSText,
  floorFSText,
  floorVSText
} from "./Shaders.js";
import { Mat4, Vec4 } from "../lib/TSM.js";

export interface MengerAnimationTest {
  reset(): void;
  setLevel(level: number): void;
  getGUI(): GUI;
  draw(): void;
}

export class MengerAnimation extends CanvasAnimation {
  private gui: GUI;
  
  /* The Menger sponge */
  private sponge: MengerSponge = new MengerSponge(1);

  /* Menger Sponge Rendering Info */
  private mengerVAO: WebGLVertexArrayObjectOES = -1;
  private mengerProgram: WebGLProgram = -1;

  /* Menger Buffers */
  private mengerPosBuffer: WebGLBuffer = -1;
  private mengerIndexBuffer: WebGLBuffer = -1;
  private mengerNormBuffer: WebGLBuffer = -1;

  /* Menger Attribute Locations */
  private mengerPosAttribLoc: GLint = -1;
  private mengerNormAttribLoc: GLint = -1;

  /* Menger Uniform Locations */
  private mengerWorldUniformLocation: WebGLUniformLocation = -1;
  private mengerViewUniformLocation: WebGLUniformLocation = -1;
  private mengerProjUniformLocation: WebGLUniformLocation = -1;
  private mengerLightUniformLocation: WebGLUniformLocation = -1;

  /* Global Rendering Info */
  private lightPosition: Vec4 = new Vec4();
  private backgroundColor: Vec4 = new Vec4();

  // TODO: data structures for the floor


  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.gui = new GUI(canvas, this, this.sponge);

    /* Setup Animation */
    this.reset();
  }

  /**
   * Setup the animation. This can be called again to reset the animation.
   */
  public reset(): void {

    /* debugger; */
    this.lightPosition = new Vec4([-10.0, 10.0, -10.0, 1.0]);
    this.backgroundColor = new Vec4([0.0, 0.37254903, 0.37254903, 1.0]);

    this.initMenger();
    this.initFloor();

    this.gui.reset();

  }

  /**
   * Initialize the Menger sponge data structure
   */
  public initMenger(): void {
    
    this.sponge.setLevel(1);
    
    /* Alias context for syntactic convenience */
    const gl: WebGLRenderingContext = this.ctx;

    
    /* Compile Shaders */
    this.mengerProgram = WebGLUtilities.createProgram(
      gl,
      defaultVSText,
      defaultFSText
    );
    gl.useProgram(this.mengerProgram);

    /* Create VAO for Menger Sponge */
    this.mengerVAO = this.extVAO.createVertexArrayOES() as WebGLVertexArrayObjectOES;
    this.extVAO.bindVertexArrayOES(this.mengerVAO);

    /* Create and setup positions buffer*/
    // Returns a number that indicates where 'vertPosition' is in the shader program
    this.mengerPosAttribLoc = gl.getAttribLocation(
      this.mengerProgram,
      "vertPosition"
    );
    /* Ask WebGL to create a buffer */
    this.mengerPosBuffer = gl.createBuffer() as WebGLBuffer;
    /* Tell WebGL that you are operating on this buffer */
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mengerPosBuffer);
    /* Fill the buffer with data */
    gl.bufferData(gl.ARRAY_BUFFER, this.sponge.positionsFlat(), gl.STATIC_DRAW);
    /* Tell WebGL how to read the buffer and where the data goes */
    gl.vertexAttribPointer(
      this.mengerPosAttribLoc /* Essentially, the destination */,
      4 /* Number of bytes per primitive */,
      gl.FLOAT /* The type of data */,
      false /* Normalize data. Should be false. */,
      4 *
        Float32Array.BYTES_PER_ELEMENT /* Number of bytes to the next element */,
      0 /* Initial offset into buffer */
    );
    /* Tell WebGL to enable to attribute */
    gl.enableVertexAttribArray(this.mengerPosAttribLoc);

    /* Create and setup normals buffer*/
    this.mengerNormAttribLoc = gl.getAttribLocation(
      this.mengerProgram,
      "aNorm"
    );
    this.mengerNormBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mengerNormBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.sponge.normalsFlat(), gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      this.mengerNormAttribLoc,
      4,
      gl.FLOAT,
      false,
      4 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(this.mengerNormAttribLoc);

    /* Create and setup index buffer*/
    this.mengerIndexBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mengerIndexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      this.sponge.indicesFlat(),
      gl.STATIC_DRAW
    );

    /* End VAO recording */
    this.extVAO.bindVertexArrayOES(this.mengerVAO);

    /* Get uniform locations */
    this.mengerWorldUniformLocation = gl.getUniformLocation(
      this.mengerProgram,
      "mWorld"
    ) as WebGLUniformLocation;
    this.mengerViewUniformLocation = gl.getUniformLocation(
      this.mengerProgram,
      "mView"
    ) as WebGLUniformLocation;
    this.mengerProjUniformLocation = gl.getUniformLocation(
      this.mengerProgram,
      "mProj"
    ) as WebGLUniformLocation;
    this.mengerLightUniformLocation = gl.getUniformLocation(
      this.mengerProgram,
      "lightPosition"
    ) as WebGLUniformLocation;

    /* Bind uniforms */
    gl.uniformMatrix4fv(
      this.mengerWorldUniformLocation,
      false,
      new Float32Array(this.sponge.uMatrix().all())
    );
    gl.uniformMatrix4fv(
      this.mengerViewUniformLocation,
      false,
      new Float32Array(Mat4.identity.all())
    );
    gl.uniformMatrix4fv(
      this.mengerProjUniformLocation,
      false,
      new Float32Array(Mat4.identity.all())
    );
    gl.uniform4fv(this.mengerLightUniformLocation, this.lightPosition.xyzw);
  }

  /**
   * Sets up the floor and floor drawing
   */
  public initFloor(): void {
      
      // TODO: your code to set up the floor rendering
  }

  /**
   * Draws a single frame
   */
  public draw(): void {

    const gl: WebGLRenderingContext = this.ctx;

    /* Clear canvas */
    const bg: Vec4 = this.backgroundColor;
    gl.clearColor(bg.r, bg.g, bg.b, bg.a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    /* Menger - Update/Draw */
    const modelMatrix = this.sponge.uMatrix();
    gl.useProgram(this.mengerProgram);

    this.extVAO.bindVertexArrayOES(this.mengerVAO);

    /* Update menger buffers */
    if (this.sponge.isDirty()) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.mengerPosBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        this.sponge.positionsFlat(),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(
        this.mengerPosAttribLoc,
        4,
        gl.FLOAT,
        false,
        4 * Float32Array.BYTES_PER_ELEMENT,
        0
      );
      gl.enableVertexAttribArray(this.mengerPosAttribLoc);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.mengerNormBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.sponge.normalsFlat(), gl.STATIC_DRAW);
      gl.vertexAttribPointer(
        this.mengerNormAttribLoc,
        4,
        gl.FLOAT,
        false,
        4 * Float32Array.BYTES_PER_ELEMENT,
        0
      );
      gl.enableVertexAttribArray(this.mengerNormAttribLoc);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mengerIndexBuffer);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        this.sponge.indicesFlat(),
        gl.STATIC_DRAW
      );

      this.sponge.setClean();
    }

    /* Update menger uniforms */
    gl.uniformMatrix4fv(
      this.mengerWorldUniformLocation,
      false,
      new Float32Array(modelMatrix.all())
    );
    gl.uniformMatrix4fv(
      this.mengerViewUniformLocation,
      false,
      new Float32Array(this.gui.viewMatrix().all())
    );
    gl.uniformMatrix4fv(
      this.mengerProjUniformLocation,
      false,
      new Float32Array(this.gui.projMatrix().all())
    );
	
	console.log("Drawing ", this.sponge.indicesFlat().length, " triangles");


    /* Draw menger */
    gl.drawElements(
      gl.TRIANGLES,
      this.sponge.indicesFlat().length,
      gl.UNSIGNED_INT,
      0
    );

    // TODO: draw the floor
    
  }

  public setLevel(level: number): void {
    this.sponge.setLevel(level);
  }

  public getGUI(): GUI {
    return this.gui;
  }
}

export function initializeCanvas(): void {
  const canvas = document.getElementById("glCanvas") as HTMLCanvasElement;
  /* Start drawing */
  const canvasAnimation: MengerAnimation = new MengerAnimation(canvas);
  mengerTests.registerDeps(canvasAnimation);
  mengerTests.registerDeps(canvasAnimation);
  canvasAnimation.start();
}
