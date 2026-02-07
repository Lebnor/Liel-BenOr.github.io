/* ==========================================================================
   Torn page interactions
   - Default: 50/50 split with neutral center zone
   - Hover left/right: reveal that side style across whole page
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
  var neutralZoneHalfWidth = 110;
  var navToggles = document.querySelectorAll(".nav-toggle");
  var navLinks = document.querySelectorAll(".nav__link");

  function updateNeutralZoneWidth() {
    var rootStyles = window.getComputedStyle(document.documentElement);
    var configured = parseInt(rootStyles.getPropertyValue("--neutral-zone-width"), 10);
    if (!Number.isNaN(configured) && configured > 0) {
      neutralZoneHalfWidth = Math.round(configured / 2);
    } else {
      neutralZoneHalfWidth = 110;
    }
  }

  function sideFromX(x) {
    var mid = window.innerWidth / 2;
    if (Math.abs(x - mid) <= neutralZoneHalfWidth) {
      return "center";
    }
    return x < window.innerWidth / 2 ? "left" : "right";
  }

  function clearState() {
    activeSide = "";
    wrapper.classList.remove("hover-left", "hover-right", "hover-center");
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
    wrapper.classList.toggle("hover-center", side === "center");
  }

  function onPointerMove(event) {
    if (isMobile || !hasHover) {
      return;
    }

    if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
      return;
    }

    setSide(sideFromX(event.clientX));
  }

  function onResize() {
    isMobile = window.matchMedia("(max-width: 900px)").matches;
    hasHover = window.matchMedia("(hover: hover)").matches;
    updateNeutralZoneWidth();
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

    setSide(sideFromX(touch.clientX));
  }

  function onTouchEnd() {
    if (isMobile) {
      clearState();
    }
  }

  window.addEventListener("pointermove", onPointerMove);
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
  updateNeutralZoneWidth();
  window.setTimeout(syncContainerHeight, 250);

})();
