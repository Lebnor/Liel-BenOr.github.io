const projects = {
  operations: {
    title: "Betec",
    category: "Brand & web experience",
    description:
      "A Hebrew-first website presenting Betec’s engineering services, digital products, and selected work.",
    image: "workflow-platform.png",
    alt: "Betec business workflow interface",
  },
  discovery: {
    title: "Geographic Discovery",
    category: "Research & automation",
    description:
      "A map-first research workspace that transforms a search area into an actionable business dataset.",
    image: "business-discovery.png",
    alt: "Map and business results in Geographic Discovery",
  },
  vehicle: {
    title: "Interactive Vehicle Studio",
    category: "Product experiences",
    description:
      "A responsive product viewer that gives customers a fluid, detailed look from every angle.",
    image: "vehicle-viewer.png",
    alt: "Interactive vehicle presentation with multiple viewing angles",
  },
  data: {
    title: "Structured Data Workbench",
    category: "Developer tools",
    description:
      "A focused browser tool for inspecting, comparing and reshaping complex data contracts.",
    image: "data-workbench.png",
    alt: "Data contract inspection and transformation interface",
  },
};
const chapters = [...document.querySelectorAll(".chapter")];
const chapterLinks = [...document.querySelectorAll(".chapter-navigation a")];
const work = document.querySelector("#work");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const motionButton = document.querySelector("#motion-control");
let paused = reducedMotion.matches,
  world = null,
  scrollFrame = 0;

/** Maps ordinary document scrolling to a reversible journey through the world. */
function updateJourney() {
  scrollFrame = 0;
  const end = work.offsetTop - innerHeight * 0.65;
  const progress = Math.max(0, Math.min(1, scrollY / end));
  world?.setProgress(progress);
  document.querySelector("#journey-progress").style.transform =
    `scaleX(${progress})`;
  document.body.classList.toggle(
    "at-work",
    scrollY > work.offsetTop - innerHeight * 0.4,
  );
  let active = 0;
  chapters.forEach((chapter, index) => {
    const local = scrollY - chapter.offsetTop;
    if (local > -innerHeight * 0.45) active = index;
    const copy = chapter.querySelector(".chapter-copy");
    const enter =
      index === 0
        ? 1
        : Math.max(
            0,
            Math.min(1, (local + innerHeight * 0.65) / (innerHeight * 0.45)),
          );
    const exit = Math.max(
      0,
      Math.min(
        1,
        (chapter.offsetHeight - innerHeight * 0.4 - local) /
          (innerHeight * 0.6),
      ),
    );
    copy.style.opacity = enter * exit;
    copy.style.transform = reducedMotion.matches
      ? "none"
      : `translateY(${(1 - enter) * 32 - (1 - exit) * 24}px)`;
  });
  chapterLinks.forEach((link, index) => {
    if (index === active) link.setAttribute("aria-current", "step");
    else link.removeAttribute("aria-current");
  });
}
function queueScroll() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateJourney);
}
function updateMotion() {
  motionButton.setAttribute("aria-pressed", String(paused));
  motionButton.innerHTML = `<span aria-hidden="true">${paused ? "▷" : "Ⅱ"}</span><span>${paused ? "Resume motion" : "Pause motion"}</span>`;
  world?.setReducedMotion(reducedMotion.matches);
  world?.setPaused(paused);
}
motionButton.addEventListener("click", () => {
  paused = !paused;
  updateMotion();
});
reducedMotion.addEventListener("change", () => {
  paused = reducedMotion.matches;
  updateMotion();
});
window.addEventListener("scroll", queueScroll, { passive: true });
window.addEventListener("resize", queueScroll);

/** The project details use native dialog focus handling and Escape dismissal. */
const dialog = document.querySelector("#project-dialog");
function openProject(id) {
  const project = projects[id];
  if (!project) return;
  document.querySelector("#project-title").textContent = project.title;
  document.querySelector("#project-category").textContent = project.category;
  document.querySelector("#project-description").textContent =
    project.description;
  const image = document.querySelector("#project-image");
  image.src = `/app-site/static/img/work/${project.image}`;
  image.alt = project.alt;
  dialog.showModal();
  document.body.style.overflow = "hidden";
  world?.setPaused(true);
}
document
  .querySelectorAll("[data-project]")
  .forEach((button) =>
    button.addEventListener("click", () => openProject(button.dataset.project)),
  );
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => {
  document.body.style.overflow = "";
  world?.setPaused(paused);
});
updateMotion();
updateJourney();

function fallback(error) {
  console.warn("The 3D environment could not be displayed.", error);
  document.body.classList.add("no-world");
  document.querySelector("#world canvas")?.remove();
  motionButton.hidden = true;
}
import("./world/world.js")
  .then(({ createWorld }) => {
    world = createWorld(document.querySelector("#world"), {
      onReady: () => document.body.classList.add("world-ready"),
      onError: fallback,
      onProject: openProject,
      projects: Object.entries(projects).map(([id, project]) => ({
        id,
        title: project.title,
        image: `/app-site/static/img/work/${project.image}`,
      })),
    });
    updateMotion();
    updateJourney();
  })
  .catch(fallback);
