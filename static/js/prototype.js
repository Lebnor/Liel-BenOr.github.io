/* ==========================================================================
   Torn page interactions
   - Default: narrow center reveal
   - Hover left/right: reveal that side from the tear
   ========================================================================== */

(function () {
  "use strict";

  var wrapper = document.getElementById("prototype-wrapper");
  if (!wrapper) {
    return;
  }

  var container = document.getElementById("prototype-container");
  var layerOld = wrapper.querySelector(".layer-old");
  var layerNew = wrapper.querySelector(".layer-new");
  var activeSide = "";
  var isMobile = window.matchMedia("(max-width: 900px)").matches;
  var hasHover = window.matchMedia("(hover: hover)").matches;
  var navToggles = document.querySelectorAll(".nav-toggle");
  var navLinks = document.querySelectorAll(".nav__link");

  function sideFromX(x) {
    return x < window.innerWidth / 2 ? "left" : "right";
  }

  function clearState() {
    activeSide = "";
    wrapper.classList.remove("hover-left", "hover-right");
  }

  function syncContainerHeight() {
    if (!container || !layerOld || !layerNew) {
      return;
    }

    var oldHeight = layerOld.scrollHeight;
    var newHeight = layerNew.scrollHeight;
    container.style.height = Math.max(oldHeight, newHeight) + "px";
  }

  function setSide(side) {
    if (isMobile || !hasHover) {
      clearState();
      return;
    }

    if (side === activeSide) {
      return;
    }

    activeSide = side;
    wrapper.classList.toggle("hover-left", side === "left");
    wrapper.classList.toggle("hover-right", side === "right");
  }

  function onPointerMove(event) {
    if (isMobile || !hasHover) {
      return;
    }
    setSide(sideFromX(event.clientX));
  }

  function onResize() {
    isMobile = window.matchMedia("(max-width: 900px)").matches;
    hasHover = window.matchMedia("(hover: hover)").matches;
    syncContainerHeight();
    if (isMobile || !hasHover) {
      clearState();
    }
  }

  function onTouchStart(event) {
    if (!isMobile) {
      return;
    }

    var touch = event.touches && event.touches[0];
    if (!touch) {
      return;
    }

    wrapper.classList.toggle("hover-left", sideFromX(touch.clientX) === "left");
    wrapper.classList.toggle("hover-right", sideFromX(touch.clientX) === "right");
  }

  function onTouchEnd() {
    if (isMobile) {
      clearState();
    }
  }

  wrapper.addEventListener("pointermove", onPointerMove);
  wrapper.addEventListener("pointerleave", clearState);
  window.addEventListener("resize", onResize);
  window.addEventListener("blur", clearState);
  window.addEventListener("load", syncContainerHeight);

  wrapper.addEventListener("touchstart", onTouchStart, { passive: true });
  wrapper.addEventListener("touchend", onTouchEnd, { passive: true });
  wrapper.addEventListener("touchcancel", onTouchEnd, { passive: true });

  navToggles.forEach(function (button) {
    button.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      document.body.classList.remove("nav-open");
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      setSide("left");
    }

    if (event.key === "ArrowRight") {
      setSide("right");
    }

    if (event.key === "Escape") {
      clearState();
    }
  });

  syncContainerHeight();
  window.setTimeout(syncContainerHeight, 250);
})();
