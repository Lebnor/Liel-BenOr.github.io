import * as T from "../../vendor/three.module.min.js";
import { createMaterials, createEnvironment } from "./materials.js";
import { createHall } from "./hall.js";
import { createPossibility } from "./possibility.js";
import { createLightShafts, createWorldLight } from "./atmosphere.js";
import { createCameraJourney, restingProgress } from "./camera.js";

const ease = (a, b, value) => T.MathUtils.smoothstep(value, a, b);
/** Owns rendering lifecycle, resource limits, and interaction with the 3D world. */
export function createWorld(
  container,
  { onReady, onError, onProject, projects },
) {
  let renderer;
  try {
    renderer = new T.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "low-power",
    });
  } catch (error) {
    onError(error);
    return null;
  }
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(51, 1, 0.2, 180);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.24;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  container.append(renderer.domElement);
  let dirty = true,
    alive = true,
    paused = false,
    reduced = false,
    frame = 0,
    last = 0,
    smoothed = 0,
    target = 0,
    lastInput = 0;
  let budget = Math.min(devicePixelRatio, 1.15),
    slowFrames = 0,
    framesRendered = 0;
  const request = () => {
    dirty = true;
    if (!frame && alive && !document.hidden)
      frame = requestAnimationFrame(render);
  };
  const m = createMaterials(renderer, request);
  scene.environment = createEnvironment(renderer);
  scene.environmentIntensity = 0.75;
  const lighting = createWorldLight(scene);
  const hall = createHall(scene, m);
  const possibility = createPossibility(scene, m, request, projects);
  const shafts = createLightShafts(scene);
  renderer.shadowMap.needsUpdate = true;
  const raycaster = new T.Raycaster();
  const screens = [];
  scene.traverse((object) => {
    if (object.userData.project) screens.push(object);
  });
  const mouse = new T.Vector2();
  const journey = createCameraJourney(camera, mouse);

  function resize() {
    const width = innerWidth,
      height = innerHeight;
    const cap = Math.sqrt(1350000 / (width * height));
    renderer.setPixelRatio(Math.min(budget, cap));
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.fov = width < 760 ? 65 : 51;
    camera.updateProjectionMatrix();
    request();
  }
  function render(now) {
    frame = 0;
    if (!alive || document.hidden) return;
    const moving = Math.abs(target - smoothed) > 0.00005;
    const active = now - lastInput < 1200;
    const interval = moving || active ? 1000 / 30 : 1000 / 12;
    if (now - last < interval) {
      frame = requestAnimationFrame(render);
      return;
    }
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    smoothed = paused ? target : T.MathUtils.damp(smoothed, target, 6, dt);
    const progress = T.MathUtils.clamp(smoothed, 0, 1);
    const opening = ease(0.29, 0.68, progress);
    journey.update(progress, paused);
    hall.update(opening);
    possibility.update(progress, now / 1000, !paused);
    shafts.update(progress);
    lighting.update(progress, now / 1000, paused);
    const started = performance.now();
    renderer.render(scene, camera);
    renderer.domElement.dataset.frames = ++framesRendered;
    renderer.domElement.dataset.renderMs = (
      performance.now() - started
    ).toFixed(1);
    renderer.domElement.dataset.progress = progress.toFixed(4);
    renderer.domElement.dataset.drawCalls = renderer.info.render.calls;
    renderer.domElement.dataset.triangles = renderer.info.render.triangles;
    renderer.domElement.dataset.pixelRatio = renderer
      .getPixelRatio()
      .toFixed(2);
    if (performance.now() - started > 48) slowFrames++;
    else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames > 12 && budget > 0.65) {
      budget = Math.max(0.65, budget - 0.2);
      slowFrames = 0;
      resize();
    }
    if (dirty) {
      dirty = false;
      onReady();
    }
    // Idle scenery settles after 12 seconds. Scrolling wakes it immediately.
    if (moving || (!paused && now - lastInput < 12000))
      frame = requestAnimationFrame(render);
  }
  function pick(event) {
    if (
      smoothed < 0.65 ||
      smoothed > 0.99 ||
      event.target.closest("a,button,dialog,.chapter-copy")
    )
      return null;
    raycaster.setFromCamera(
      new T.Vector2(
        (event.clientX / innerWidth) * 2 - 1,
        1 - (event.clientY / innerHeight) * 2,
      ),
      camera,
    );
    return raycaster.intersectObjects(screens, false)[0]?.object.userData
      .project;
  }
  window.addEventListener("click", (event) => {
    const id = pick(event);
    if (id) onProject(id);
  });
  function move(event) {
    document.body.style.cursor = pick(event) ? "pointer" : "";
    if (paused || event.pointerType === "touch") return;
    mouse.set(
      event.clientX / innerWidth - 0.5,
      0.5 - event.clientY / innerHeight,
    );
    request();
  }
  function visibility() {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else request();
  }
  renderer.domElement.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    alive = false;
    cancelAnimationFrame(frame);
    onError(new Error("Graphics context lost"));
  });
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  resize();
  return {
    setProgress(value) {
      const next = reduced ? restingProgress(value) : value;
      if (target === next) return;
      target = next;
      lastInput = performance.now();
      request();
    },
    setReducedMotion(value) {
      reduced = value;
    },
    setPaused(value) {
      paused = value;
      if (!paused) lastInput = performance.now();
      request();
    },
    inspect() {
      return {
        progress: smoothed,
        paused,
        rendering: !!frame,
        pixelRatio: renderer.getPixelRatio(),
        drawCalls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
      };
    },
  };
}
