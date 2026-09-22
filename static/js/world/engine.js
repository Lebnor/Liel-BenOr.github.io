import * as T from "../../vendor/three.module.min.js";

/** A machined, suspended engine: the monumental centerpiece of the new era. */
export function createEngine(parent, m) {
  const assembly = new T.Group();
  assembly.position.set(0, 11, -78);
  assembly.rotation.y = -0.18;
  parent.add(assembly);
  const transform = new T.Object3D();
  const parts = [
    {
      count: 64,
      radius: 12.4,
      scale: [0.95, 1.65, 1.7],
      z: 0,
      material: m.stone,
    },
    {
      count: 64,
      radius: 12.4,
      scale: [0.76, 1.45, 0.065],
      z: 0.89,
      material: m.metal,
    },
    {
      count: 64,
      radius: 12.4,
      scale: [0.68, 1.1, 0.035],
      z: 0.94,
      material: m.brass,
    },
    {
      count: 64,
      radius: 11.65,
      scale: [0.23, 0.027, 0.035],
      z: 0.9,
      material: m.cyan,
    },
    {
      count: 128,
      radius: 13.1,
      scale: [0.06, 0.06, 0.09],
      z: 0.94,
      material: m.brass,
    },
  ];
  for (const part of parts) {
    const mesh = new T.InstancedMesh(
      new T.BoxGeometry(1, 1, 1),
      part.material,
      part.count,
    );
    for (let i = 0; i < part.count; i++) {
      const angle = (i / part.count) * Math.PI * 2;
      transform.position.set(
        Math.cos(angle) * part.radius,
        Math.sin(angle) * part.radius,
        part.z,
      );
      transform.rotation.set(0, 0, angle - Math.PI / 2);
      transform.scale.set(...part.scale);
      transform.updateMatrix();
      mesh.setMatrixAt(i, transform.matrix);
    }
    assembly.add(mesh);
  }
  for (const radius of [10.9, 11.1, 13.6]) {
    const hoop = new T.Mesh(
      new T.TorusGeometry(radius, 0.065, 6, 128),
      m.brass,
    );
    hoop.position.z = -0.3;
    assembly.add(hoop);
  }
  const core = new T.Group();
  assembly.add(core);
  for (let i = 0; i < 3; i++) {
    const axis = new T.Group();
    axis.rotation.set(i * 0.8, i * 0.9, i * 0.4);
    core.add(axis);
    for (const offset of [-0.12, 0.12]) {
      const hoop = new T.Mesh(
        new T.TorusGeometry(3.4 + i * 0.55, 0.06, 8, 96),
        m.brass,
      );
      hoop.position.z = offset;
      axis.add(hoop);
    }
    const rim = new T.Mesh(
      new T.TorusGeometry(3.4 + i * 0.55, 0.018, 5, 96),
      m.cyan,
    );
    axis.add(rim);
  }
  const heart = new T.Mesh(
    new T.IcosahedronGeometry(1.4, 1),
    new T.MeshStandardMaterial({
      color: "#d0dad1",
      metalness: 0.95,
      roughness: 0.19,
    }),
  );
  core.add(heart);
  const seams = new T.LineSegments(
    new T.EdgesGeometry(heart.geometry),
    new T.LineBasicMaterial({
      color: "#9bccbd",
      transparent: true,
      opacity: 0.65,
    }),
  );
  heart.add(seams);
  return {
    update(progress, time, ambient) {
      assembly.rotation.z = -0.05 + progress * 0.13;
      core.rotation.y = progress * 1.8 + (ambient ? time * 0.035 : 0);
      heart.rotation.z = progress * 0.5;
    },
  };
}
