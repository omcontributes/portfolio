// Reads everything from data.js and builds the page.
const p = portfolio;
const $ = (id) => document.getElementById(id);

// Basic info
document.title = `${p.name} | Portfolio`;
$("logo").textContent = p.name;
$("hero-name").textContent = p.name;
$("hero-title").textContent = p.title;
$("hero-tagline").textContent = p.tagline;
$("about-text").textContent = p.about;
$("footer-name").textContent = p.name;
$("year").textContent = new Date().getFullYear();

// Resume button
if (p.resumeLink) $("resume-btn").href = p.resumeLink;
else $("resume-btn").style.display = "none";

// Skills
$("skills").innerHTML = p.skills.map((s) => `<li>${s}</li>`).join("");

// ---------- Java code window (built from your data.js) ----------
(function buildCodeWindow() {
  const esc = (x) => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const kw = (x) => `<span class="kw">${x}</span>`;   // keywords
  const ty = (x) => `<span class="ty">${x}</span>`;   // types / class names
  const st = (x) => `<span class="st">${esc(x)}</span>`; // strings
  const fn = (x) => `<span class="fn">${x}</span>`;   // methods
  const cm = (x) => `<span class="cm">${x}</span>`;   // comments

  const className = (p.name || "Portfolio").replace(/[^a-zA-Z0-9]/g, "") || "Portfolio";
  const skills = p.skills.slice(0, 4).map((s) => st(`"${s}"`)).join(", ");

  const lines = [
    cm("// Hello from my portfolio"),
    `${kw("public")} ${kw("class")} ${ty(className)} {`,
    "",
    `    ${kw("private")} ${ty("String")} role = ${st(`"${p.title}"`)};`,
    `    ${kw("private")} ${ty("String")}[] skills = {${skills}};`,
    "",
    `    ${kw("public")} ${kw("static")} ${kw("void")} ${fn("main")}(${ty("String")}[] args) {`,
    `        ${ty("System")}.out.${fn("println")}(${st('"Hello, World!"')});`,
    `    }`,
    `}`,
  ];

  const code = lines
    .map(
      (l, i) =>
        `<div class="line" style="animation-delay:${0.25 + i * 0.12}s"><span class="ln">${i + 1}</span>${l || " "}</div>`
    )
    .join("");

  $("code-window").innerHTML = `
    <div class="code-bar">
      <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
      <span class="file">${esc(className)}.java</span>
    </div>
    <div class="code-body">${code}</div>
    <div class="console">
      <div><span class="prompt">$</span> java ${esc(className)}</div>
      <div class="out">Hello, World!<span class="cursor"></span></div>
    </div>`;
})();

// Projects
$("project-grid").innerHTML = p.projects
  .map(
    (pr, i) => `
    <article class="card">
      <div class="card-top">
        <span class="folder">📁</span>
        <span class="num">${String(i + 1).padStart(2, "0")}</span>
      </div>
      <h4>${pr.title}</h4>
      <p>${pr.description}</p>
      <ul class="chips">${pr.tech.map((t) => `<li>${t}</li>`).join("")}</ul>
      <div class="links">
        ${pr.live ? `<a href="${pr.live}" target="_blank" rel="noopener">Live demo ↗</a>` : ""}
        ${pr.code ? `<a href="${pr.code}" target="_blank" rel="noopener">GitHub ↗</a>` : ""}
      </div>
    </article>`
  )
  .join("");

// Contact
const c = p.contact;
if (c.email) {
  $("contact-email").textContent = c.email;
  $("contact-email").href = `mailto:${c.email}`;
} else {
  $("contact-email").style.display = "none";
}
$("contact-links").innerHTML = `
  ${c.email ? `<a class="btn" href="mailto:${c.email}">Email me</a>` : ""}
  ${c.github ? `<a class="btn btn-outline" href="${c.github}" target="_blank" rel="noopener">GitHub</a>` : ""}
  ${c.linkedin ? `<a class="btn btn-outline" href="${c.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ""}
`;

// ---------- Scroll effects ----------
// 1) Sections fade in as you scroll down
const revealEls = document.querySelectorAll("section:not(.hero)");
revealEls.forEach((el) => el.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// 2) Navbar highlights the section you are viewing
if ("IntersectionObserver" in window) {
  const navLinks = document.querySelectorAll(".nav nav a[href^='#']");
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`)
          );
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  document.querySelectorAll("#about, #projects, #contact").forEach((s) => navObserver.observe(s));
}

// ---------- Dark / light theme (remembers choice) ----------
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme-v2");
  root.setAttribute("data-theme", saved || "dark"); // dark is the default
} catch (e) {
  root.setAttribute("data-theme", "dark");
}
$("theme-toggle").addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme-v2", next); } catch (e) {}
});