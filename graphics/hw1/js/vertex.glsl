// Vertex shader program
precision mediump float;

// attributes recieves data from a buffer
attribute vec4 aVertPos;
attribute vec3 aColour;
// varyings pass data to the fragment shader
varying vec3 vPos;
varying vec3 vColour;
// uniforms contain shared vertex data from the CPU
uniform float uTime;
uniform vec2 uAngle;

void main() {

    // Set rotation angles
    float rx = uAngle.y * 2.;
    float ry = uAngle.x * 2. + uTime;
    float rz = 0.;

    // Rotation Matricies
    mat3 xRot = mat3(
        vec3(1., 0., 0.),
        vec3(0., cos(rx), -sin(rx)),
        vec3(0., sin(rx), cos(rx))
    );

    mat3 yRot = mat3(
        vec3(cos(ry), 0., sin(ry)),
        vec3(0., 1., 0.),
        vec3(-sin(ry), 0., cos(ry))
    );

    mat3 zRot = mat3(
        vec3(cos(rz), -sin(rz), 0.),
        vec3(sin(rz), cos(rz), 0.),
        vec3(0., 0., 1.)
    );

    // Pass varyings to the fragment shader
    vColour = aColour;
    vPos = aVertPos.xyz;

    // Apply the rotations to each vertex, and scale down slightly
    gl_Position = vec4(xRot * yRot * zRot * aVertPos.xyz, 1.2);
}
