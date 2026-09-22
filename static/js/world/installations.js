import * as T from "../../vendor/three.module.min.js";
import { block } from "./materials.js";
import { createSign } from "./atmosphere.js";

/** Real project imagery is exhibited inside the expanded world. */
export function createInstallation(
  parent,
  materials,
  index,
  invalidate,
  projects,
) {
  const project = projects[index];
  if (!project) return;
  const display = new T.Group();
  display.position.set(0, 3.4, 0.8);
  display.rotation.y = 0.18;
  parent.add(display);
  block(display, materials.metal, [0, 0, 0], [5.55, 3.65, 0.3]);
  block(display, materials.brass, [0, -1.78, 0.17], [5.55, 0.045, 0.03]);
  const map = new T.TextureLoader().load(project.image, invalidate);
  map.colorSpace = T.SRGBColorSpace;
  const screen = new T.Mesh(
    new T.PlaneGeometry(5.23, 3.3),
    new T.MeshBasicMaterial({ map, color: "#a9bcb5" }),
  );
  screen.position.z = 0.16;
  screen.userData.project = project.id;
  display.add(screen);
  createSign(
    display,
    project.title.toUpperCase(),
    [-0.1, -2.12, 0.2],
    5.5,
    "#b9e1d6",
  );
  for (const x of [-2.3, 2.3])
    block(parent, materials.brass, [x, 1.1, 0.8], [0.07, 2.2, 0.07]);
}
