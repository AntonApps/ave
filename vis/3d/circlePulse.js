globalThis.AVE3D_CIRCLE = {

  program: null,
  segments: 120,

  init(gl) {

    const vs = `
      attribute vec2 position;
      uniform float time;
      uniform float intensity;

      varying float vIntensity;

      void main() {
        float dist = length(position);
        float wave = sin(dist * 10.0 - time * 3.0) * intensity;

        vIntensity = intensity;

        gl_Position = vec4(position * (1.0 + wave), 0.0, 1.0);
      }
    `;

    const fs = `
      precision mediump float;

      varying float vIntensity;

      void main() {
        vec3 base = vec3(1.0, 0.2, 0.2);
        vec3 color = base + vIntensity * 0.8;

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

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);

    // 🔷 geometría
    const vertices = [];

    for (let i = 0; i < this.segments; i++) {
      const a = (i / this.segments) * Math.PI * 2;
      vertices.push(Math.cos(a) * 0.5, Math.sin(a) * 0.5);
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    this.timeLoc = gl.getUniformLocation(program, "time");
    this.intensityLoc = gl.getUniformLocation(program, "intensity");

    this.program = program;
  },

  render(gl, data, t) {

    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];

    const avg = sum / data.length / 255;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);

    gl.uniform1f(this.timeLoc, t * 0.001);
    gl.uniform1f(this.intensityLoc, avg);

    gl.drawArrays(gl.LINE_LOOP, 0, this.segments);
  }
};