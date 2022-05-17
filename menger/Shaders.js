export let defaultVSText = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    attribute vec4 aNorm;
    
    varying vec4 lightDir;
    varying vec4 normal;   
 
    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
	uniform mat4 mProj;

    void main () {
		//  Convert vertex to camera coordinates and the NDC
        gl_Position = mProj * mView * mWorld * vec4 (vertPosition, 1.0);
        
        //  Compute light direction (world coordinates)
        lightDir = lightPosition - vec4(vertPosition, 1.0);
		
        //  Pass along the vertex normal (world coordinates)
        normal = aNorm;
    }
`;
// TODO: Write the fragment shader
export let defaultFSText = `
    precision mediump float;

    varying vec4 lightDir;
    varying vec4 normal;    
	
    
    void main () {
        vec4 color = normalize(abs(normal));

        gl_FragColor = color * dot(normalize(lightDir), normalize(normal));
        gl_FragColor[3] = 1.0;
    }
`;
// TODO: floor shaders
export let floorVSText = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    attribute vec4 aNorm;

    varying vec4 lightDir;
    varying vec4 normal;   
    varying vec4 vert;

    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main () {
        //  Convert vertex to camera coordinates and the NDC
        vec4 vertVec = vec4(vertPosition, 1.0);
        vert = vertVec;
        gl_Position = mProj * mView * mWorld * vertVec;
        
        //  Compute light direction (world coordinates)
        lightDir = lightPosition - vertVec;
        
        //  Pass along the vertex normal (world coordinates)
        normal = aNorm;
    }
`;
export let floorFSText = `
    precision mediump float;

    varying vec4 lightDir;
    varying vec4 normal;    
    varying vec4 vert;

    void main () {
        vec4 color;
        float scale = 0.2; // amount from floor
        float a = floor(vert.x * scale);
        float b = floor(vert.y * scale);
        float c = floor(vert.z * scale);
        if (mod(a + b + c, 2.0) > 0.5) { 
            color = vec4(0.0, 0.0, 0.0, 1.0); 
        }
        else { 
            color = vec4(1.0, 1.0, 1.0, 1.0); 
        }

        gl_FragColor = color * dot(normalize(lightDir), normalize(normal));
        gl_FragColor[3] = 1.0;
    }
`;
//# sourceMappingURL=Shaders.js.map