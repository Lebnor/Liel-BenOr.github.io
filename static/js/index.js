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
  // intro typewriter effect for mobile
  let isMobile = window.matchMedia(
    "only screen and (max-width: 442px)"
  ).matches;

  if (isMobile) {
    // we want to cancel intro animations for mobile because they won't fit
    let children = document.getElementsByClassName("typewriter-container")[0]
      .children;
    for (let i = 0; i < children.length; i++) {
      children[i].innerText = "";
    }

    let head = "Hi, I am";
    let sub = " Liel Ben-Or";

    let headElem = document.querySelector("h1.typewriter.head");
    let subElem = document.querySelector("h1.typewriter.sub");

    // intro header
    const headTimeout = setInterval(() => {
      if (head) {
        const char = head[0];
        headElem.textContent = headElem.textContent + char;
        head = head.substring(1);
      } else {
        clearInterval(headTimeout);
      }
    }, 500);

    // intro subtitle
    const subStartAnimating = setTimeout(() => {
      const writeToSub = setInterval(() => {
        if (sub) {
          const char = sub[0];
          subElem.textContent = subElem.textContent + char;
          sub = sub.substring(1);
        } else {
          clearInterval(writeToSub);
        }
      }, 500);
    }, 5000);
  }
});

// effects on page scroll
window.onscroll = () => {
  let a = document.head.scrollTop;
  let b = document.head.scroll;
  let c = document.head.scrollHeight;

  if (a > 50) {
    let h2 = document.querySelectorAll("h2");
    h2.forEach((element) => (element.style.color = "red"));
  }
};
