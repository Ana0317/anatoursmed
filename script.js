/* ============================================================
   Ana María · Frutas Exóticas — Interacción
   ============================================================ */
const WA = "573197333300";
// Fotos reales de la experiencia de Ana María (Airbnb, exp. 4054609).
const AIRBNB = "https://a0.muscache.com/im/pictures/Mt/MtTemplate-4054609/original/";
const img = (id, w = 1000) => `${AIRBNB}${id}.jpeg?im_w=${w}`;

/* ---------- Data ---------- */
// Gallery: real photos from the tour. No repeats.
const GALLERY = [
  { id: "8f17681b-769b-4b1d-9c87-a6c0cdb7292b", cap: "Tree tomato, freshly cut open", cls: "tall" },
  { id: "d6b608f3-4052-4913-92c0-602538d57ab5", cap: "Travelers with Ana María at the market", cls: "wide" },
  { id: "5e57f20f-935e-4822-8d9d-495bc0edb315", cap: "Fresh fruit, sliced on the spot" },
  { id: "1cad6461-4d6e-4181-83c8-8f8b987c93d4", cap: "The colors of the market", cls: "tall" },
  { id: "1b5c9655-32b8-44bc-b729-ddb871631fea", cap: "Inside Plaza Minorista", cls: "wide" },
  { id: "9bcb4c96-1171-4049-bdb2-da1d4a273d65", cap: "Ana María shares a taste" },
];

const TASTES = {
  tropical: { fruits: "Passion fruit, granadilla & mango.", desc: "Bright sweetness, gentle acidity, and aromas that fill the whole walk." },
  citrico: { fruits: "Lulo, mandarin & tree tomato.", desc: "Tart, sparkling freshness — perfect to wake up your palate." },
  cremoso: { fruits: "Soursop, mangosteen & sapote.", desc: "Soft, enveloping textures, almost like a natural dessert." },
  aromatico: { fruits: "Pitaya, feijoa & banana passionfruit.", desc: "Delicate perfumes and floral notes that surprise with every bite." },
};

const REVIEWS = [
  { text: "Ana María was fantastic. Accommodating, flexible, and she helped us get around easily. Her knowledge of fruits, herbs, spices, and the market was incredible.", name: "Nick", city: "San Francisco", tags: "familia conocimiento" },
  { text: "As someone who loves fruit, this tour was incredibly fun. I tried so many kinds of fruit I'd never had before.", name: "Brian", city: "San Francisco", tags: "hambre" },
  { text: "Ana is an amazing guide. She's very knowledgeable about the market and the variety of produce you can find.", name: "Alexa", city: "Chicago", tags: "conocimiento" },
  { text: "Ana's tour is a must. We learned so much about the different fruits in Colombia and tasted more than we expected.", name: "Jon", city: "San Diego", tags: "conocimiento hambre" },
  { text: "Ana María is a lovely host. Just make sure you don't eat too much beforehand — the fruits are very filling!", name: "Milan", city: "San Francisco", tags: "hambre" },
  { text: "It was a wonderful experience. We loved it, everything was delicious, and Ana María organized it all perfectly.", name: "Iana", city: "Argentina", tags: "familia" },
];

const STEPS = [
  "Meeting point at the main entrance of Plaza Minorista. Ana María greets the group, shares the story of the place, and sets the pace for the tour.",
  "You walk among the fruit stalls. Ana María chats with the vendors and picks the freshest, most unusual fruits of the day.",
  "Live tasting: Ana María opens each fruit, explains how to eat it, and you share sweet, tart, and creamy flavors that surprise you.",
  "Wrap-up with culinary tips: ideas for juices, snacks, and desserts, plus recommendations to keep exploring Colombian fruit.",
];

/* ---------- Utilidades ---------- */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
const handleBrokenImg = (el) => {
  el.addEventListener("error", () => {
    const wrap = el.closest(".gallery-item") || el.parentElement;
    if (wrap) wrap.style.display = "none";
  });
};

/* ---------- Header + progreso de scroll ---------- */
const header = $("[data-header]");
const progress = $("[data-progress]");
const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 20);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${Math.min((y / h) * 100, 100)}%`;
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Menú móvil ---------- */
const navToggle = $("[data-nav-toggle]");
const nav = $("[data-nav]");
navToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});
$$("[data-nav] a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.14 }
);
const observeReveals = () => $$(".reveal:not(.visible)").forEach((el) => io.observe(el));

/* ---------- Contadores animados ---------- */
const animateCount = (el) => {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const dur = 1400;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals) + suffix;
  };
  requestAnimationFrame(tick);
};
const countIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateCount(e.target);
        countIO.unobserve(e.target);
      }
    });
  },
  { threshold: 0.6 }
);
$$("[data-count]").forEach((el) => countIO.observe(el));

/* ---------- Galería + Lightbox ---------- */
const galleryEl = $("[data-gallery]");
GALLERY.forEach((item, i) => {
  const fig = document.createElement("figure");
  fig.className = `gallery-item ${item.cls || ""}`.trim();
  fig.dataset.caption = item.cap;
  fig.dataset.index = i;
  const image = document.createElement("img");
  image.src = img(item.id, 720);
  image.alt = item.cap;
  image.loading = "lazy";
  handleBrokenImg(image);
  fig.appendChild(image);
  fig.addEventListener("click", () => openLightbox(i));
  galleryEl.appendChild(fig);
});

const lb = $("[data-lightbox]");
const lbImg = $("[data-lb-image]");
const lbCap = $("[data-lb-caption]");
let lbIndex = 0;

const renderLb = () => {
  const item = GALLERY[lbIndex];
  lbImg.src = img(item.id, 1440);
  lbImg.alt = item.cap;
  lbCap.textContent = item.cap;
};
const openLightbox = (i) => {
  lbIndex = i;
  renderLb();
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};
const closeLightbox = () => {
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};
const step = (dir) => {
  lbIndex = (lbIndex + dir + GALLERY.length) % GALLERY.length;
  renderLb();
};
$("[data-lb-close]").addEventListener("click", closeLightbox);
$("[data-lb-next]").addEventListener("click", () => step(1));
$("[data-lb-prev]").addEventListener("click", () => step(-1));
lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});

/* ---------- Explora sabores ---------- */
const tasteResult = $("[data-taste-result]");
const renderTaste = (key) => {
  const t = TASTES[key];
  tasteResult.innerHTML = `<div class="taste-fruits">${t.fruits}</div><div class="taste-desc">${t.desc}</div>`;
  // reinicia animación
  tasteResult.style.animation = "none";
  void tasteResult.offsetWidth;
  tasteResult.style.animation = "";
};
$$(".taste-tab").forEach((tab) =>
  tab.addEventListener("click", () => {
    $$(".taste-tab").forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    renderTaste(tab.dataset.taste);
  })
);
renderTaste("tropical");

/* ---------- Timeline ---------- */
const stepDetail = $("[data-step-detail]");
const renderStep = (i) => {
  stepDetail.textContent = STEPS[i];
  stepDetail.style.animation = "none";
  void stepDetail.offsetWidth;
  stepDetail.style.animation = "";
};
$$(".timeline-item").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$(".timeline-item").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderStep(parseInt(btn.dataset.step, 10));
  })
);
renderStep(0);

/* ---------- Reseñas ---------- */
const reviewsEl = $("[data-reviews]");
const renderReviews = () => {
  reviewsEl.innerHTML = "";
  REVIEWS.forEach((r) => {
    const card = document.createElement("article");
    card.className = "review-card reveal";
    card.dataset.tags = r.tags;
    card.innerHTML = `
      <div class="review-stars">★★★★★</div>
      <p>“${r.text}”</p>
      <div class="review-author">
        <span class="review-avatar">${r.name.charAt(0)}</span>
        <span><strong>${r.name}</strong>${r.city}</span>
      </div>`;
    reviewsEl.appendChild(card);
  });
  observeReveals();
};
renderReviews();

$$(".filter-chip").forEach((chip) =>
  chip.addEventListener("click", () => {
    $$(".filter-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const f = chip.dataset.filter;
    $$(".review-card").forEach((card) => {
      const match = f === "all" || card.dataset.tags.includes(f);
      card.classList.toggle("hide", !match);
    });
  })
);

/* ---------- Foto de anfitriona (fallback) ---------- */
$$("img[data-fallback]").forEach((el) =>
  el.addEventListener("error", () => {
    el.parentElement.style.background = "linear-gradient(135deg, var(--clay-soft), var(--gold))";
    el.style.display = "none";
  })
);

/* ---------- Formulario WhatsApp ---------- */
const form = $("[data-message-form]");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const date = (data.get("date") || "").toString().trim();
  const people = (data.get("people") || "").toString().trim();
  const message = (data.get("message") || "").toString().trim();
  let text = message;
  if (people) text += `\nPeople: ${people}.`;
  if (date) text += `\nPreferred date: ${date}.`;
  const url = `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener");
});

/* ---------- Init ---------- */
observeReveals();
