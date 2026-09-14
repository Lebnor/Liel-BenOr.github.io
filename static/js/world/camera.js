import * as T from "../../vendor/three.module.min.js";
const ease = (a, b, value) => T.MathUtils.smoothstep(value, a, b);
const CAMERA_STOPS = [
  { at: 0, eye: [10, 5.8, 17], look: [-0.4, 4.9, -17] },
  { at: 0.24, eye: [5, 4.6, 8], look: [0, 5.6, -29] },
  { at: 0.43, eye: [2, 5.5, -13], look: [0, 6.8, -39] },
  { at: 0.59, eye: [0, 7, -31], look: [0, 8, -68] },
  { at: 0.77, eye: [17, 13, -40], look: [-2, 8, -77] },
  { at: 1, eye: [21, 17, -46], look: [-1, 9, -80] },
];

/** Camera choreography can change independently from scene assets and rendering policy. */
export function createCameraJourney(camera, mouse) {
  const eye = new T.Vector3(),
    look = new T.Vector3();
  function update(progress, paused) {
    const next = CAMERA_STOPS.findIndex((stop) => stop.at >= progress);
    const right = CAMERA_STOPS[Math.max(1, next)];
    const left = CAMERA_STOPS[Math.max(0, next - 1)];
    const t = ease(left.at, right.at, progress);
    eye.fromArray(left.eye).lerp(new T.Vector3(...right.eye), t);
    look.fromArray(left.look).lerp(new T.Vector3(...right.look), t);
    if (innerWidth < 760) {
      eye.x *= 0.22 + progress * 0.23;
      eye.y += 0.8;
      look.y -= 1;
    }
    if (!paused) {
      eye.x += mouse.x * 0.22;
      eye.y += mouse.y * 0.12;
    }
    camera.position.copy(eye);
    camera.lookAt(look);
  }

  return { update };
}

export function restingProgress(progress) {
  const shots = [
    { until: 0.32, at: 0 },
    { until: 0.63, at: 0.5 },
    { until: Infinity, at: 0.82 },
  ];
  return shots.find((shot) => progress < shot.until).at;
}
