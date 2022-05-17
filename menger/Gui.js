import { Camera } from "../lib/webglutils/Camera.js";
import { Mat4, Vec3, Vec4 } from "../lib/TSM.js";
/**
 * Handles Mouse and Button events along with
 * the the camera.
 */
export class GUI {
    /**
     *
     * @param canvas required to get the width and height of the canvas
     * @param animation required as a back pointer for some of the controls
     * @param sponge required for some of the controls
     */
    constructor(canvas, animation, sponge) {
        this.height = canvas.height;
        this.width = canvas.width;
        this.prevX = 0;
        this.prevY = 0;
        this.sponge = sponge;
        this.animation = animation;
        this.reset();
        this.registerEventListeners(canvas);
    }
    /**
     * Resets the state of the GUI
     */
    reset() {
        this.fps = true;
        this.dragging = false;
        /* Create camera setup */
        this.camera = new Camera(new Vec3([0, 0, -6]), new Vec3([0, 0, 0]), new Vec3([0, 1, 0]), 45, this.width / this.height, 0.1, 1000.0);
    }
    resetUp() {
        this.fps = false;
        this.dragging = false;
        /* Create camera setup */
        this.camera = new Camera(new Vec3([0, 6, 0]), new Vec3([0, 0, 0]), new Vec3([1, 0, 0]), 45, this.width / this.height, 0.1, 1000.0);
    }
    resetRight() {
        this.fps = false;
        this.dragging = false;
        /* Create camera setup */
        this.camera = new Camera(new Vec3([-6, 0, 0]), new Vec3([0, 0, 0]), new Vec3([0, 0, 1]), 45, this.width / this.height, 0.1, 1000.0);
    }
    /**
     * Sets the GUI's camera to the given camera
     * @param cam a new camera
     */
    setCamera(pos, target, upDir, fov, aspect, zNear, zFar) {
        this.camera = new Camera(pos, target, upDir, fov, aspect, zNear, zFar);
    }
    /**
     * Returns the view matrix of the camera
     */
    viewMatrix() {
        return this.camera.viewMatrix();
    }
    /**
     * Returns the projection matrix of the camera
     */
    projMatrix() {
        return this.camera.projMatrix();
    }
    /**
     * Callback function for the start of a drag event.
     * @param mouse
     */
    dragStart(mouse) {
        this.dragging = true;
        this.prevX = mouse.screenX;
        this.prevY = mouse.screenY;
    }
    /**
     * The callback function for a drag event.
     * This event happens after dragStart and
     * before dragEnd.
     * @param mouse
     */
    drag(mouse) {
        let currX = mouse.screenX;
        let currY = mouse.screenY;
        if (this.dragging) {
            let delta_x = currX - this.prevX;
            let delta_y = currY - this.prevY;
            this.prevX = currX;
            this.prevY = currY;
            if (delta_x == 0 && delta_y == 0) {
                return;
            }
            let origin = this.camera.pos();
            let x = this.camera.right();
            let y = this.camera.up();
            let z = this.camera.forward();
            let o = this.camera.pos();
            let vals = [x.x, x.y, x.z, 0,
                y.x, y.y, y.z, 0,
                z.x, z.y, z.z, 0,
                o.x, o.y, o.z, 1];
            let mat = new Mat4(vals);
            let vec = new Vec4([-1 * delta_x, delta_y, this.camera.zFar(), 0]); // 1 to 0
            let result = mat.multiplyVec4(vec);
            let axis = Vec3.cross(this.camera.forward(), new Vec3([result.x, result.y, result.z]));
            if (this.fps) {
                this.camera.rotate(axis, GUI.rotationSpeed);
            }
            else {
                this.camera.rotate(axis, GUI.rotationSpeed, this.camera.target());
            }
        }
    }
    /**
     * Callback function for the end of a drag event
     * @param mouse
     */
    dragEnd(mouse) {
        this.dragging = false;
        this.prevX = 0;
        this.prevY = 0;
    }
    zoom(wheel) {
        let deltaX = wheel.deltaX;
        let deltaY = wheel.deltaY;
        let zoomAmount = 1.0 + GUI.zoomSpeed;
        if (deltaY < 0) { // Scroll up  /zoomAmount
            this.camera.zoom(1 / zoomAmount);
        }
        else if (deltaY > 0) { // Scroll down  *zoomAmount
            this.camera.zoom(zoomAmount);
        }
        console.log("Scroll amount: " + deltaY);
    }
    /**
     * Callback function for a key press event
     * @param key
     */
    onKeydown(key) {
        /*
           Note: key.code uses key positions, i.e a QWERTY user uses y where
                 as a Dvorak user must press F for the same action.
           Note: arrow keys are only registered on a KeyDown event not a
           KeyPress event
           We can use KeyDown due to auto repeating.
         */
        // TOOD: Your code for key handling
        switch (key.code) {
            case "KeyW": {
                this.camera.offset(this.camera.forward().negate(), GUI.zoomSpeed, true);
                break;
            }
            case "KeyA": {
                this.camera.offset(this.camera.right().negate(), GUI.zoomSpeed, true);
                break;
            }
            case "KeyS": {
                this.camera.offset(this.camera.forward(), GUI.zoomSpeed, true);
                break;
            }
            case "KeyD": {
                this.camera.offset(this.camera.right(), GUI.zoomSpeed, true);
                break;
            }
            case "KeyR": {
                this.reset();
                break;
            }
            case "KeyT": {
                this.resetUp();
                break;
            }
            case "KeyY": {
                this.resetRight();
                break;
            }
            case "ArrowLeft": {
                this.camera.roll(GUI.rollSpeed, false);
                break;
            }
            case "ArrowRight": {
                this.camera.roll(GUI.rollSpeed, true);
                break;
            }
            case "ArrowUp": {
                this.camera.offset(this.camera.up(), GUI.zoomSpeed, true);
                break;
            }
            case "ArrowDown": {
                this.camera.offset(this.camera.up().negate(), GUI.zoomSpeed, true);
                break;
            }
            case "Digit1": {
                this.sponge.setLevel(1);
                break;
            }
            case "Digit2": {
                this.sponge.setLevel(2);
                break;
            }
            case "Digit3": {
                this.sponge.setLevel(3);
                break;
            }
            case "Digit4": {
                this.sponge.setLevel(4);
                break;
            }
            case "Digit5": {
                this.sponge.setLevel(5);
                break;
            }
            case "Digit6": {
                this.sponge.setLevel(6);
                break;
            }
            case "Digit7": {
                this.sponge.setLevel(7);
                break;
            }
            case "Digit8": {
                this.sponge.setLevel(8);
                break;
            }
            case "Digit9": {
                this.sponge.setLevel(9);
                break;
            }
            case "Digit0": {
                this.sponge.setLevel(0);
                break;
            }
            default: {
                console.log("Key : '", key.code, "' was pressed.");
                break;
            }
        }
    }
    /**
     * Registers all event listeners for the GUI
     * @param canvas The canvas being used
     */
    registerEventListeners(canvas) {
        /* Event listener for key controls */
        window.addEventListener("keydown", (key) => this.onKeydown(key));
        /* Event listener for mouse controls */
        canvas.addEventListener("mousedown", (mouse) => this.dragStart(mouse));
        canvas.addEventListener("mousemove", (mouse) => this.drag(mouse));
        canvas.addEventListener("mouseup", (mouse) => this.dragEnd(mouse));
        canvas.addEventListener("wheel", (wheel) => this.zoom(wheel));
        /* Event listener to stop the right click menu */
        canvas.addEventListener("contextmenu", (event) => event.preventDefault());
    }
}
GUI.rotationSpeed = 0.05;
GUI.zoomSpeed = 0.1;
GUI.rollSpeed = 0.1;
GUI.panSpeed = 0.1;
//# sourceMappingURL=Gui.js.map