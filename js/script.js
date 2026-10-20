const root = document.documentElement;

// Theme toggle: follows the system until the visitor picks one
const themeToggle = document.getElementById("theme-toggle");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

function currentTheme() {
  return root.getAttribute("data-theme") || (systemDark.matches ? "dark" : "light");
}

themeToggle.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
});

// Mobile menu
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

function setMenu(open) {
  navLinks.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
}

menuToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// Nav border once the page scrolls
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Highlight the section currently in view
const sections = document.querySelectorAll("main section[id]");
const linkFor = (id) => navLinks.querySelector(`a[href="#${id}"]`);

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.querySelectorAll("a").forEach((a) => a.classList.remove("is-current"));
        const link = linkFor(entry.target.id);
        if (link) link.classList.add("is-current");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  // Fade sections in as they enter the viewport
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        reveal.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".section-head, .tl-item, .research, .card, .skill-group, .edu-item, .contact-box").forEach((el) => {
    el.classList.add("reveal");
    reveal.observe(el);
  });
}

// Project filters
const chips = document.querySelectorAll(".chip");
const cards = document.querySelectorAll(".projects .card");

chips.forEach((chip) =>
  chip.addEventListener("click", () => {
    const filter = chip.dataset.filter;
    chips.forEach((c) => {
      const active = c === chip;
      c.classList.toggle("is-active", active);
      c.setAttribute("aria-pressed", String(active));
    });
    cards.forEach((card) => {
      card.hidden = filter !== "all" && !card.dataset.cat.split(" ").includes(filter);
    });
  })
);

document.getElementById("year").textContent = new Date().getFullYear();
