import * as T from "../../vendor/three.module.min.js";
import { createArchitecture, block } from "./materials.js";
import { createTerminal } from "./terminal.js";
import { createSign } from "./atmosphere.js";

/** The fixed, weighty architecture of the first era. */
export function createHall(scene, m) {
  const hall = new T.Group();
  scene.add(hall);
  const a = createArchitecture(hall, m);
  a.box("floor", 0, -0.5, -15, 40, 1, 80);
  for (let z = 15; z >= -39; z -= 8) {
    for (const side of [-1, 1]) {
      const x = side * 11;
      a.box("stone", x, 7, z, 1.55, 14, 1.75);
      a.box("stone", x, 0.3, z, 2.2, 0.6, 2.4);
      a.box("metal", x + side * 0.81, 6.7, z, 0.12, 11.8, 1.9);
      a.box("brass", x - side * 0.82, 6.9, z + 0.1, 0.07, 12, 0.08);
      a.box("stone", side * 15, 6, z, 1, 12, 7.7);
      a.box("metal", side * 14.45, 6, z, 0.15, 10, 0.15);
      a.box("amber", side * 14.4, 5.8, z, 0.04, 0.07, 5.3);
      a.box("stone", side * 13, 12.7, z, 7, 0.8, 2.1);
      for (let h = 1; h < 12; h += 2)
        a.box("dark", side * 14.4, h, z + 2, 0.05, 0.035, 3.2);
      for (const d of [-0.5, 0.5])
        a.box("brass", x - side * 0.8, 0.9, z + d, 0.03, 0.09, 0.09);
    }
    a.box("metal", 0, 14, z, 25, 0.8, 1.2);
    a.box("stone", 0, 15, z, 30, 1.1, 3.8);
    a.box("amber", 0, 13.55, z, 11, 0.035, 0.09);
    a.box("dark", 0, 0.015, z, 21, 0.03, 0.045);
  }
  for (const x of [-6.5, 6.5]) {
    a.box("brass", x, 0.015, -13, 0.035, 0.03, 59);
    a.box("dark", x + 0.22, 0.01, -13, 0.09, 0.02, 59);
    for (let z = 12; z > -40; z -= 1.3)
      a.box("metal", x + 0.35, 0.025, z, 0.55, 0.035, 0.08);
  }
  for (const side of [-1, 1]) {
    for (let z = -1; z > -34; z -= 8) {
      const x = side * 8.2;
      a.box("metal", x, 2.3, z, 2.1, 4.6, 2.5);
      a.box("dark", x, 2.35, z + 1.27, 1.75, 4.15, 0.08);
      a.box("brass", x - 0.91, 2.4, z + 1.29, 0.035, 4.15, 0.02);
      for (let i = 0; i < 12; i++) {
        a.box("metal", x, 0.6 + i * 0.3, z + 1.34, 1.5, 0.21, 0.13);
        a.box("amber", x - 0.52, 0.6 + i * 0.3, z + 1.42, 0.04, 0.035, 0.025);
        for (let v = 0; v < 5; v++)
          a.box(
            "dark",
            x + 0.05 + v * 0.15,
            0.6 + i * 0.3,
            z + 1.415,
            0.07,
            0.035,
            0.02,
          );
      }
      a.box("stone", x, 0.1, z, 2.6, 0.2, 3);
    }
    for (let z = 9; z > -34; z -= 16) {
      a.box("metal", side * 12.2, 1.1, z, 0.08, 2.2, 0.08);
      a.box("metal", side * 12.2, 1.1, z - 6, 0.08, 2.2, 0.08);
      a.box("metal", side * 12.2, 2.1, z - 3, 0.08, 0.06, 6);
      a.box("metal", side * 12.2, 1.3, z - 3, 0.08, 0.04, 6);
    }
  }
  a.finish();
  createTerminal(hall, m);
  createSign(hall, "THE FIRST EXPLORATIONS / 2022", [0, 14.1, -35.45], 13);
  createSign(
    hall,
    "CURIOSITY IS THE BEGINNING",
    [3.2, 0.38, -4.48],
    3.9,
    "#b6a17e",
  );
  const pipes = new T.Group();
  hall.add(pipes);
  for (const x of [-8.5, -8, 8, 8.5]) {
    const pipe = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 67, 8), m.brass);
    pipe.rotation.x = Math.PI / 2;
    pipe.position.set(x, 11.8, -12);
    pipes.add(pipe);
    for (let z = 18; z > -44; z -= 4) {
      const ring = new T.Mesh(new T.TorusGeometry(0.15, 0.025, 4, 8), m.metal);
      ring.position.set(x, 11.8, z);
      pipes.add(ring);
    }
  }
  const portal = new T.Group();
  hall.add(portal);
  for (const x of [-8.8, 8.8]) block(portal, m.stone, [x, 7, -37], [2, 14, 3]);
  block(portal, m.stone, [0, 14, -37], [19.5, 2, 3]);
  for (const x of [-7.7, 7.7])
    block(portal, m.amber, [x, 7, -35.4], [0.04, 13, 0.03]);
  block(portal, m.amber, [0, 13.4, -35.4], [15.4, 0.04, 0.03]);
  const wall = new T.Group();
  scene.add(wall);
  const pieces = [];
  for (let row = 0; row < 7; row++)
    for (let col = 0; col < 8; col++) {
      const x = (col - 3.5) * 1.85,
        y = row * 1.82 + 0.9;
      const mesh = block(
        wall,
        (row + col) % 5 === 0 ? m.metal : m.stone,
        [x, y, -37],
        [1.79, 1.76, 0.8 + ((row * 3 + col) % 4) * 0.17],
      );
      const angle = Math.atan2(y - 6, x);
      pieces.push({ mesh, x, y, angle, index: row * 8 + col });
    }
  return {
    update(open) {
      for (const p of pieces) {
        const stagger = T.MathUtils.smoothstep(
          open,
          (p.index % 5) * 0.045,
          0.7 + (p.index % 3) * 0.1,
        );
        p.mesh.position.set(
          p.x + Math.cos(p.angle) * stagger * 16,
          p.y + Math.sin(p.angle) * stagger * 9 + stagger * 4,
          -37 - stagger * (8 + (p.index % 7)),
        );
        p.mesh.rotation.set(
          stagger * 0.35 * Math.sin(p.index),
          stagger * 0.9 * Math.cos(p.index),
          stagger * 0.3 * Math.sin(p.index * 2),
        );
      }
      hall.visible = open < 0.999;
      wall.visible = open < 0.999;
    },
  };
}
