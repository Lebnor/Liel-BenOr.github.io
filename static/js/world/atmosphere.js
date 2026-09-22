import * as T from "../../vendor/three.module.min.js";
import { glowTexture } from "./materials.js";

/** Soft shafts crossing the hall make the architectural depth legible. */
export function createLightShafts(scene) {
  const group = new T.Group();
  scene.add(group);
  const material = new T.ShaderMaterial({
    uniforms: {
      color: { value: new T.Color("#ffe2ac") },
      strength: { value: 0.06 },
    },
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec2 vUv; uniform vec3 color; uniform float strength;
      void main(){float edge=pow(sin(vUv.x*3.14159),2.);float falloff=pow(vUv.y,.7);gl_FragColor=vec4(color,edge*falloff*strength);}`,
    transparent: true,
    depthWrite: false,
    side: T.DoubleSide,
    blending: T.AdditiveBlending,
  });
  for (let i = 0; i < 5; i++) {
    const geometry = new T.BufferGeometry();
    const z = 5 - i * 8;
    geometry.setAttribute(
      "position",
      new T.Float32BufferAttribute(
        [-8, 14, z, -2, 14, z, 12, 0.1, z + 5, 3, 0.1, z + 5],
        3,
      ),
    );
    geometry.setAttribute(
      "uv",
      new T.Float32BufferAttribute([0, 1, 1, 1, 1, 0, 0, 0], 2),
    );
    geometry.setIndex([0, 1, 2, 0, 2, 3]);
    group.add(new T.Mesh(geometry, material));
  }
  return {
    update(progress) {
      group.visible = progress < 0.68;
      material.uniforms.strength.value =
        0.07 * (1 - T.MathUtils.smoothstep(progress, 0.45, 0.68));
    },
  };
}

/** Surface lettering belongs to the physical environment, not the page navigation. */
export function createSign(parent, text, position, width, color = "#b6c3b6") {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 128;
  const c = canvas.getContext("2d");
  c.fillStyle = color;
  c.font = "44px monospace";
  c.fillText(text, 16, 82);
  const map = new T.CanvasTexture(canvas);
  map.colorSpace = T.SRGBColorSpace;
  const mesh = new T.Mesh(
    new T.PlaneGeometry(width, width / 8),
    new T.MeshBasicMaterial({
      map,
      transparent: true,
      depthWrite: false,
      opacity: 0.65,
    }),
  );
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

/** Light and atmosphere change together as the visitor leaves the computing hall. */
export function createWorldLight(scene) {
  const warm = new T.Color("#45473f"),
    cool = new T.Color("#345359");
  scene.background = warm.clone();
  scene.fog = new T.FogExp2(warm.clone(), 0.022);
  const ambient = new T.HemisphereLight("#c4d3c5", "#292418", 2.2);
  scene.add(ambient);
  const sun = new T.DirectionalLight("#ffe0ab", 4.8);
  sun.position.set(-14, 26, -22);
  sun.target.position.set(4, 0, -12);
  scene.add(sun, sun.target);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {
    left: -28,
    right: 28,
    top: 32,
    bottom: -32,
    near: 1,
    far: 90,
  });
  sun.shadow.bias = -0.0015;
  sun.shadow.normalBias = 0.05;
  const fill = new T.DirectionalLight("#719692", 1.6);
  fill.position.set(12, 10, 12);
  scene.add(fill);
  const doorLight = new T.PointLight("#e8bb7c", 100, 35, 2);
  doorLight.position.set(0, 10, -31);
  scene.add(doorLight);
  const dust = makeDust(scene);
  return {
    update(progress, time, paused) {
      const daylight = T.MathUtils.smoothstep(progress, 0.4, 0.78);
      scene.background.copy(warm).lerp(cool, daylight);
      scene.fog.color.copy(scene.background);
      scene.fog.density = 0.022 - daylight * 0.012;
      sun.color.set("#ffe0ab").lerp(new T.Color("#d1f5ef"), daylight);
      sun.intensity = 4.8 - daylight * 1.2;
      dust.rotation.y = paused ? 0 : time * 0.009;
      dust.material.opacity = 0.24 + daylight * 0.12;
    },
  };
}

function makeDust(scene) {
  const points = new Float32Array(240 * 3);
  let seed = 76;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < points.length; i += 3) {
    points[i] = (random() - 0.5) * 70;
    points[i + 1] = random() * 25;
    points[i + 2] = 15 - random() * 120;
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute("position", new T.BufferAttribute(points, 3));
  const material = new T.PointsMaterial({
    color: "#dddbc4",
    size: 0.065,
    map: glowTexture(),
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    blending: T.AdditiveBlending,
  });
  const cloud = new T.Points(geometry, material);
  scene.add(cloud);
  return cloud;
}
