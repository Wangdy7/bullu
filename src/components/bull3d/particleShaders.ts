export const bullParticleVertexShader = /* glsl */ `
  uniform float uForm;
  uniform float uRun;
  uniform float uCharge;
  uniform float uImpact;
  uniform float uFade;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec3 aStart;
  attribute vec3 aDir;
  attribute float aSeed;
  attribute float aPart;

  varying vec3 vColor;
  varying float vAlpha;

  float easeOutCubic(float value) {
    return 1.0 - pow(1.0 - value, 3.0);
  }

  void main() {
    float form = smoothstep(0.0, 1.0, uForm);
    vec3 p = mix(aStart, position, easeOutCubic(form));

    // A little swirl while the cloud is still finding the body.
    float settle = 1.0 - form;
    p.x += sin(aSeed * 31.0 + form * 9.0) * settle * 0.34;
    p.z += cos(aSeed * 23.0 + form * 7.0) * settle * 0.34;

    float run = clamp(uRun, 0.0, 1.0);
    float phase = 0.0;
    float hipY = 1.02;
    float hipZ = 0.7;

    if (aPart > 1.5 && aPart < 2.5) {
      phase = 3.14159265;
    } else if (aPart > 2.5 && aPart < 3.5) {
      phase = 3.14159265;
      hipZ = -0.7;
    } else if (aPart > 3.5 && aPart < 4.5) {
      hipZ = -0.7;
    }

    // The mesh has no armature. These four regions act as procedural
    // hips so the particle silhouette can still gallop.
    if (aPart > 0.5 && aPart < 4.5) {
      float angle = sin(uTime * 8.5 + phase) * 0.58 * run;
      float dy = p.y - hipY;
      float dz = p.z - hipZ;
      float ca = cos(angle);
      float sa = sin(angle);
      p.z = hipZ + dz * ca - dy * sa;
      p.y = hipY + dz * sa + dy * ca;
    } else if (aPart > 4.5 && aPart < 5.5) {
      // Head: the mesh is already low, so only a small breathing bob.
      p.y += sin(uTime * 7.0 + 1.4) * 0.028 * run;
      p.z += sin(uTime * 5.2) * 0.018 * run;
    } else if (aPart > 5.5) {
      // Tail loop: a slow lateral sway.
      p.x += sin(uTime * 4.6 + 2.0) * 0.19 * run;
      p.y += sin(uTime * 6.1 + 0.7) * 0.035 * run;
    } else {
      // Body bounce.
      p.y += sin(uTime * 8.5) * 0.024 * run;
    }

    // Charge toward the camera, then burst through the screen.
    p *= 1.0 + uCharge * 0.18;
    p.z += uCharge * 1.3;

    float burst = smoothstep(0.0, 1.0, uImpact);
    p += aDir * pow(burst, 1.45) * 4.0;
    p.x *= 1.0 + burst * 0.22;
    p.y *= 1.0 + burst * 0.16;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * uPixelRatio * (4.8 / max(1.0, -mvPosition.z)) * (0.72 + aSeed * 0.62);

    float heat = smoothstep(0.52, 0.98, aSeed);
    vColor = mix(vec3(1.0, 0.055, 0.075), vec3(1.0, 0.48, 0.3), heat);
    vAlpha = (0.28 + 0.72 * aSeed) * uFade * (1.0 - burst * 0.24);
  }
`

export const bullParticleFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 centered = gl_PointCoord - 0.5;
    float distanceToCenter = length(centered);
    if (distanceToCenter > 0.5) discard;
    float falloff = smoothstep(0.5, 0.06, distanceToCenter);
    gl_FragColor = vec4(vColor, vAlpha * falloff);
  }
`
