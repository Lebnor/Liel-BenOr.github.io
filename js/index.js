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

window.onscroll = () => {
    let a = document.head.scrollTop;
    let b = document.head.scroll;
    let c = document.head.scrollHeight;

    if (a > 50) {
        let h2 = document.querySelectorAll("h2");
        h2.forEach((element) => (element.style.color = "red"));
    }
};
