// navigator button
(function navigator() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav__link");

  navToggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
    });
  });
})();

window.addEventListener("DOMContentLoaded", () => {
  let isMobile = window.matchMedia(
    "only screen and (max-width: 450px)"
  ).matches;

  // "what i do" section fade-up effect when scrolled into view
  const servicesObserver = new IntersectionObserver(
    (elements) => {
      if (elements[0]["isIntersecting"] === true) {
        document.getElementsByClassName(
          "fade-up-container"
        )[0].style.animationPlayState = "running";
        servicesObserver.disconnect();
      }
    },
    { threshold: [isMobile ? 0.01 : 0.15] }
  );
  servicesObserver.observe(document.getElementsByClassName("services")[0]);

  // "about me" section fade-right effect when scrolled into view
  const aboutMeObserver = new IntersectionObserver(
    (elements) => {
      if (elements[0]["isIntersecting"] === true) {
        document.getElementById("about-me").style.animationPlayState =
          "running";
        aboutMeObserver.disconnect();
      }
    },
    { threshold: [isMobile ? 0.01 : 0.15] }
  );
  aboutMeObserver.observe(document.getElementById("about-me"));
});

// effects on page scroll
window.onscroll = () => {};
