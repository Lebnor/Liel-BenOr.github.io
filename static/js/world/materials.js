import * as T from "../../vendor/three.module.min.js";

/** Surfaces and repeated geometry shared by both eras of the same world. */
export function createMaterials(renderer, invalidate) {
  const loader = new T.TextureLoader();
  const texture = (name, color = false) => {
    const map = loader.load(`/static/world/concrete-${name}.webp`, invalidate);
    map.wrapS = map.wrapT = T.RepeatWrapping;
    map.repeat.set(2, 2);
    map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    if (color) map.colorSpace = T.SRGBColorSpace;
    return map;
  };
  const stone = new T.MeshStandardMaterial({
    color: "#c2c3b5",
    map: texture("diffuse", true),
    roughnessMap: texture("rough"),
    roughness: 0.86,
  });
  applyWorldTexture(stone);
  const metal = new T.MeshStandardMaterial({
    color: "#333b39",
    metalness: 0.8,
    roughness: 0.36,
  });
  const brass = new T.MeshStandardMaterial({
    color: "#977b4d",
    metalness: 0.75,
    roughness: 0.32,
  });
  const porcelain = new T.MeshStandardMaterial({
    color: "#a8b9b0",
    metalness: 0.35,
    roughness: 0.45,
  });
  const dark = new T.MeshStandardMaterial({
    color: "#11191a",
    metalness: 0.35,
    roughness: 0.65,
  });
  const amber = new T.MeshBasicMaterial({ color: "#edbd7c" });
  const cyan = new T.MeshBasicMaterial({ color: "#b7eee0" });
  const floor = stone.clone();
  applyWorldTexture(floor);
  floor.color.set("#858b80");
  floor.roughness = 0.63;
  return { stone, metal, brass, porcelain, dark, amber, cyan, floor };
}

const box = new T.BoxGeometry(1, 1, 1);
const transform = new T.Object3D();

/** Collect repeated architectural pieces into one draw call per surface. */
export function createArchitecture(parent, materials) {
  const batches = new Map();
  return {
    box(surface, x, y, z, w, h, d, rotation = 0) {
      if (!batches.has(surface)) batches.set(surface, []);
      batches.get(surface).push({ x, y, z, w, h, d, rotation });
    },
    finish() {
      for (const [surface, pieces] of batches) {
        const mesh = new T.InstancedMesh(
          box,
          materials[surface],
          pieces.length,
        );
        pieces.forEach((p, i) => {
          transform.position.set(p.x, p.y, p.z);
          transform.scale.set(p.w, p.h, p.d);
          transform.rotation.set(0, p.rotation, 0);
          transform.updateMatrix();
          mesh.setMatrixAt(i, transform.matrix);
        });
        mesh.castShadow = surface !== "amber" && surface !== "cyan";
        mesh.receiveShadow = true;
        parent.add(mesh);
      }
    },
  };
}

/** A mesh for singular objects whose position changes during the journey. */
export function block(parent, material, position, scale) {
  const mesh = new T.Mesh(box, material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

/** A soft pool of light without a full-screen postprocessing pass. */
export function glowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const c = canvas.getContext("2d");
  const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "#ffffffbb");
  g.addColorStop(0.2, "#ffffff40");
  g.addColorStop(1, "#ffffff00");
  c.fillStyle = g;
  c.fillRect(0, 0, 128, 128);
  return new T.CanvasTexture(canvas);
}

export function createEnvironment(renderer) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const c = canvas.getContext("2d");
  const g = c.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "#acb9b6");
  g.addColorStop(0.4, "#6a797a");
  g.addColorStop(0.53, "#363e3b");
  g.addColorStop(1, "#171a18");
  c.fillStyle = g;
  c.fillRect(0, 0, 512, 256);
  c.fillStyle = "#fff3d9";
  c.fillRect(180, 30, 65, 60);
  const map = new T.CanvasTexture(canvas);
  map.mapping = T.EquirectangularReflectionMapping;
  map.colorSpace = T.SRGBColorSpace;
  const generator = new T.PMREMGenerator(renderer);
  const result = generator.fromEquirectangular(map).texture;
  map.dispose();
  generator.dispose();
  return result;
}

/** World-space mapping preserves concrete scale on tall columns and small fragments. */
function applyWorldTexture(material) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
      varying vec3 vSurfacePosition;
      varying vec3 vSurfaceNormal;`,
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <project_vertex>",
      `#include <project_vertex>
      vec4 surfacePosition = vec4(transformed, 1.0);
      vec3 surfaceNormal = objectNormal;
      #ifdef USE_INSTANCING
        surfacePosition = instanceMatrix * surfacePosition;
        surfaceNormal = mat3(instanceMatrix) * surfaceNormal;
      #endif
      vSurfacePosition = (modelMatrix * surfacePosition).xyz;
      vSurfaceNormal = normalize(mat3(modelMatrix) * surfaceNormal);`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
      varying vec3 vSurfacePosition;
      varying vec3 vSurfaceNormal;`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `
      #ifdef USE_MAP
        vec3 weights = pow(abs(normalize(vSurfaceNormal)), vec3(6.0));
        weights /= weights.x + weights.y + weights.z;
        vec3 p = vSurfacePosition * 0.28;
        vec4 grain = texture2D(map, p.yz) * weights.x + texture2D(map, p.xz) * weights.y + texture2D(map, p.xy) * weights.z;
        diffuseColor *= grain;
      #endif`,
    );
  };
  material.customProgramCacheKey = () => "world-concrete-v1";
}
