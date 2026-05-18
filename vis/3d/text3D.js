globalThis.AVE3D_TEXT = {

  program: null,
  rotation: 0,

  init(gl) {

    const vs = `
      attribute vec3 position;
      uniform float angle;

      varying float vZ;

      void main() {

        float c = cos(angle);
        float s = sin(angle);

        // rotación Y (3D real)
        vec3 pos = vec3(
          position.x * c - position.z * s,
          position.y,
          position.x * s + position.z * c
        );

        vZ = pos.z;

        // perspectiva simple
        float scale = 1.0 / (1.0 + pos.z * 0.5);

        gl_Position = vec4(pos.xy * scale, 0.0, 1.0);
      }
    `;

    const fs = `
      precision mediump float;

      uniform float intensity;
      varying float vZ;

      void main() {

        vec3 base = vec3(0.2, 0.6, 1.0);

        // color dinámico + profundidad
        vec3 color = base + vec3(intensity, vZ * 0.2, intensity * 0.5);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function compile(gl, type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);

    gl.useProgram(program);

    // 🔥 GEOMETRÍA: letras "3D" (bloques)
    // cada letra = cubos simples

    function cube(x, y, z, w, h, d) {
      return [
        // frente
        x,y,z,  x+w,y,z,  x+w,y+h,z,
        x,y,z,  x+w,y+h,z,  x,y+h,z,

        // atrás
        x,y,z+d,  x+w,y,z+d,  x+w,y+h,z+d,
        x,y,z+d,  x+w,y+h,z+d,  x,y+h,z+d,
      ];
    }

    let vertices = [];

    // "3"
    vertices.push(...cube(-0.6, -0.3, -0.1, 0.2, 0.1, 0.2));
    vertices.push(...cube(-0.6, 0.0, -0.1, 0.2, 0.1, 0.2));
    vertices.push(...cube(-0.6, 0.3, -0.1, 0.2, 0.1, 0.2));

    // "D"
    vertices.push(...cube(0.2, -0.3, -0.1, 0.2, 0.6, 0.2));

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);

    this.angleLoc = gl.getUniformLocation(program, "angle");
    this.intensityLoc = gl.getUniformLocation(program, "intensity");

    this.vertexCount = vertices.length / 3;
    this.program = program;
  },

  render(gl, data, t) {

    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    const avg = sum / data.length / 255;

    this.rotation += 0.01 + avg * 0.05;

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);

    gl.uniform1f(this.angleLoc, this.rotation);
    gl.uniform1f(this.intensityLoc, avg);

    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
  }
};