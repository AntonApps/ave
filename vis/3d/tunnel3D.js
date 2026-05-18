globalThis.AVE3D_TUNNEL = {

  program: null,
  segments: 64,
  rings: 40,

  init(gl) {

    const vs = `
      attribute vec3 position;

      uniform float time;
      uniform float intensity;

      varying float vDepth;

      void main() {

        vec3 pos = position;

        // mover hacia cámara (efecto túnel)
        pos.z += mod(time * 2.0, 10.0);

        // perspectiva simple
        float scale = 1.0 / (1.0 + pos.z * 0.3);

        vDepth = pos.z;

        gl_Position = vec4(pos.xy * scale, 0.0, 1.0);
      }
    `;

    const fs = `
      precision mediump float;

      uniform float intensity;
      varying float vDepth;

      void main() {

        float glow = 1.0 - (vDepth * 0.1);

        vec3 color = vec3(
          0.2 + intensity,
          0.4 + glow,
          1.0 - glow
        );

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

    // =========================================
    // 🔥 GEOMETRÍA: anillos del túnel
    // =========================================

    const vertices = [];

    for (let z = 0; z < this.rings; z++) {

      const depth = z * 0.3;

      for (let i = 0; i < this.segments; i++) {

        const a = (i / this.segments) * Math.PI * 2;

        const x = Math.cos(a) * 0.7;
        const y = Math.sin(a) * 0.7;

        vertices.push(x, y, depth);
      }
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);

    this.timeLoc = gl.getUniformLocation(program, "time");
    this.intensityLoc = gl.getUniformLocation(program, "intensity");

    this.vertexCount = vertices.length / 3;
    this.program = program;
  },

  render(gl, data, t) {

    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    const avg = sum / data.length / 255;

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);

    gl.uniform1f(this.timeLoc, t * 0.001);
    gl.uniform1f(this.intensityLoc, avg);

    // 🔥 dibujar como líneas (tipo Winamp)
    for (let r = 0; r < this.rings; r++) {
      gl.drawArrays(gl.LINE_LOOP, r * this.segments, this.segments);
    }
  }
};