import * as T from "../../vendor/three.module.min.js";
import { block } from "./materials.js";

/** The recognizable human-scale workstation that anchors the opening. */
export function createTerminal(parent, materials) {
  const desk = new T.Group();
  desk.position.set(3.2, 0, -6);
  desk.rotation.y = -0.12;
  parent.add(desk);
  block(desk, materials.stone, [0, 0.35, 0], [4.8, 0.7, 3]);
  for (const x of [-1.65, 1.65])
    block(desk, materials.metal, [x, 1, 0], [0.3, 1.7, 1.5]);
  block(desk, materials.metal, [0, 1.85, 0], [4.8, 0.17, 2.5]);
  block(desk, materials.brass, [0, 1.76, 1.2], [4.8, 0.045, 0.03]);
  block(desk, materials.porcelain, [0, 2.08, -0.15], [1.35, 0.35, 0.75]);
  block(desk, materials.porcelain, [0, 2.84, -0.28], [2.15, 1.55, 1.25]);
  block(desk, materials.dark, [0, 2.87, 0.36], [1.83, 1.21, 0.06]);
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 512;
  const c = canvas.getContext("2d");
  c.fillStyle = "#101f1b";
  c.fillRect(0, 0, 768, 512);
  c.fillStyle = "#b5d2a0";
  c.font = "23px monospace";
  [
    "LIEL / FIRST EXPLORATIONS",
    "------------------------------",
    "",
    "> hello, world.",
    "",
    "> build something.",
    "> understand it.",
    "> build something better.",
    "",
    "                          _",
  ].forEach((line, i) => c.fillText(line, 40, 65 + i * 39));
  for (let y = 0; y < 512; y += 4) {
    c.fillStyle = "#00000025";
    c.fillRect(0, y, 768, 1);
  }
  const map = new T.CanvasTexture(canvas);
  map.colorSpace = T.SRGBColorSpace;
  const screen = new T.Mesh(
    new T.PlaneGeometry(1.67, 1.06),
    new T.MeshBasicMaterial({ map }),
  );
  screen.position.set(0, 2.87, 0.402);
  desk.add(screen);
  block(desk, materials.porcelain, [0, 1.99, 0.84], [2.3, 0.1, 0.68]);
  const key = new T.BoxGeometry(0.115, 0.06, 0.1);
  const keys = new T.InstancedMesh(key, materials.dark, 60);
  const matrix = new T.Matrix4();
  for (let i = 0; i < 60; i++) {
    matrix.makeTranslation(
      ((i % 15) - 7) * 0.14,
      2.06,
      0.6 + Math.floor(i / 15) * 0.14,
    );
    keys.setMatrixAt(i, matrix);
  }
  desk.add(keys);
  for (let i = 0; i < 7; i++)
    block(
      desk,
      materials.dark,
      [1.035, 2.82 + i * 0.085, -0.42],
      [0.08, 0.03, 0.62],
    );
  block(desk, materials.amber, [0.78, 2.24, 0.36], [0.06, 0.025, 0.02]);
  const cable = new T.CatmullRomCurve3([
    new T.Vector3(0.8, 1.85, -0.9),
    new T.Vector3(1.4, 0.3, -1.4),
    new T.Vector3(2.4, 0.08, -3),
    new T.Vector3(2.8, 0.08, -8),
  ]);
  desk.add(
    new T.Mesh(new T.TubeGeometry(cable, 28, 0.055, 6, false), materials.dark),
  );
  const light = new T.PointLight("#ffca81", 22, 10, 2);
  light.position.set(0, 3.4, 2);
  desk.add(light);
  return desk;
}
