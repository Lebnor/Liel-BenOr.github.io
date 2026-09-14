import * as T from "../../vendor/three.module.min.js";
import { createArchitecture, glowTexture } from "./materials.js";
import { createInstallation } from "./installations.js";
import { createEngine } from "./engine.js";

/** The same architectural vocabulary, released from the old world's constraints. */
export function createPossibility(scene, m, invalidate, projects) {
  const group = new T.Group();
  scene.add(group);
  const a = createArchitecture(group, m);
  const engine = createEngine(group, m);
  const structures = [];
  const positions = [
    [-13, 1, -62],
    [13, 4, -70],
    [-5, -1, -91],
    [20, -3, -100],
    [-24, 6, -100],
  ];
  positions.forEach(([x, y, z], index) => {
    const platform = new T.Group();
    platform.position.set(x, y, z);
    group.add(platform);
    const b = createArchitecture(platform, m);
    const width = index < 3 ? 8 : 6;
    b.box("stone", 0, -0.65, 0, width, 1.3, width);
    b.box("metal", 0, -1.55, 0, width * 0.83, 0.5, width * 0.83);
    b.box("brass", 0, -0.04, 0, width + 0.04, 0.055, width + 0.04);
    b.box("dark", 0, 0, 0, width - 0.15, 0.05, width - 0.15);
    for (const side of [-1, 1]) {
      b.box(
        "cyan",
        side * (width / 2 - 0.2),
        0.06,
        0,
        0.025,
        0.02,
        width - 0.4,
      );
      b.box(
        "cyan",
        0,
        0.06,
        side * (width / 2 - 0.2),
        width - 0.4,
        0.02,
        0.025,
      );
      b.box(
        "metal",
        side * (width / 2 - 0.3),
        0.7,
        -width / 2,
        0.07,
        1.4,
        0.07,
      );
    }
    const height = index < 3 ? 1 : 11;
    b.box("metal", 0, height / 2, -1, 2.8, height, 2.2);
    for (let i = 0; i < height; i++) {
      b.box("porcelain", 0.25 * Math.sin(i), i + 0.3, -1, 3.1, 0.65, 2.7);
      b.box("cyan", 0.25 * Math.sin(i), i + 0.65, 0.38, 2.4, 0.025, 0.025);
      for (const side of [-1, 1])
        b.box("brass", side * 1.2, i + 0.3, 0.38, 0.035, 0.7, 0.04);
    }
    b.box("stone", 0, height + 0.3, -1, 3.5, 0.6, 3.2);
    b.finish();
    createInstallation(platform, m, index, invalidate, projects);
    structures.push({ platform, y, index });
  });
  for (let i = 0; i < 72; i++) {
    const angle = i * 2.39996;
    const radius = 24 + ((i * 17) % 31);
    const x = Math.cos(angle) * radius;
    const z = -105 - Math.abs(Math.sin(angle)) * radius;
    const height = 6 + ((i * 7) % 25);
    a.box(
      i % 6 === 0 ? "metal" : "stone",
      x,
      -10 + height / 2,
      z,
      1.1 + (i % 3),
      height,
      1.8 + (i % 2),
    );
    if (i % 3 === 0)
      a.box(
        "cyan",
        x + 0.58,
        -7 + height / 2,
        z + 1,
        0.045,
        height * 0.6,
        0.025,
      );
  }
  a.finish();
  const bridges = [
    [
      [-13, 1.15, -62],
      [13, 4.15, -70],
    ],
    [
      [13, 4.15, -70],
      [-5, -0.85, -91],
    ],
  ];
  for (const [from, to] of bridges) {
    const start = new T.Vector3(...from),
      end = new T.Vector3(...to);
    const center = start.clone().lerp(end, 0.5);
    center.y -= 3;
    const curve = new T.QuadraticBezierCurve3(start, center, end);
    group.add(
      new T.Mesh(new T.TubeGeometry(curve, 40, 0.045, 5, false), m.cyan),
    );
    for (const offset of [-0.45, 0.45]) {
      const line = new T.Mesh(
        new T.TubeGeometry(curve, 40, 0.06, 5, false),
        m.brass,
      );
      line.position.x = offset;
      group.add(line);
    }
  }
  const haze = new T.Sprite(
    new T.SpriteMaterial({
      map: glowTexture(),
      color: "#7fcdc2",
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      blending: T.AdditiveBlending,
    }),
  );
  haze.position.set(0, 11, -86);
  haze.scale.set(38, 38, 1);
  group.add(haze);
  const pool = new T.Mesh(
    new T.CircleGeometry(95, 64),
    new T.MeshStandardMaterial({
      color: "#284344",
      metalness: 0.75,
      roughness: 0.28,
    }),
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(0, -13, -85);
  group.add(pool);
  return {
    update(progress, time, ambient) {
      group.visible = progress > 0.15;
      engine.update(progress, time, ambient);
      for (const item of structures)
        item.platform.position.y =
          item.y + (ambient ? Math.sin(time * 0.35 + item.index) * 0.14 : 0);
    },
  };
}
