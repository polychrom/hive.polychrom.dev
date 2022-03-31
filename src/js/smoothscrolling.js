document.querySelectorAll('a[href*="#chapter"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "start",
    });
  });
});
