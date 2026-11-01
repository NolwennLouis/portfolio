/* =========================================================================
   script.js — COMPORTEMENTS DU SITE
   -------------------------------------------------------------------------
   Tu ne devrais normalement jamais avoir besoin de modifier ce fichier :
   il lit simplement le contenu de works.js, about.js et lang.js et l'affiche.

   Ce fichier est découpé en parties indépendantes :
     0. Langue (FR / EN) : choix de la langue, bouton, traduction des textes
     1. Remplissage automatique des infos perso (about.js)
     2. Génération de la galerie d'œuvres (works.js)
     3. Filtres par catégorie (page Work)
     4. Page de détail d'une œuvre (oeuvre.html)
   ========================================================================= */

const LANGUAGES = ["fr", "en"];
const LANG_STORAGE_KEY = "portfolio-lang";
let currentLang = detectLanguage();

document.addEventListener("DOMContentLoaded", () => {
  setupLanguageSwitch();
  renderAll(false);
  setupFilters(document.querySelector("[data-gallery]"));
});

/* Affiche (ou réaffiche, après un changement de langue) tout le contenu. */
function renderAll(isLanguageChange) {
  document.documentElement.lang = currentLang;
  applyStaticTranslations();
  applyPageMeta();
  fillAboutInfo();
  const gallery = renderGallery();
  if (gallery && isLanguageChange) gallery.classList.add("no-fade");
  applyCurrentFilter(gallery);
  setupScrollReveal(isLanguageChange);
  renderArtworkPage();
  updateSwitchState();
}

/* -------------------------------------------------------------------------
   0. LANGUE (FR / EN)
   Ordre de priorité pour choisir la langue au chargement :
     1. ?lang=en (ou ?lang=fr) dans l'adresse de la page
     2. le dernier choix du visiteur (mémorisé dans son navigateur)
     3. DEFAULT_LANGUAGE dans lang.js ; si "auto" : la langue du navigateur
        (français si son navigateur est en français, anglais sinon)
   ----------------------------------------------------------------------- */
function detectLanguage() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (LANGUAGES.includes(fromUrl)) {
      saveLanguage(fromUrl);
      return fromUrl;
    }
  } catch (e) { /* on continue */ }

  try {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (LANGUAGES.includes(saved)) return saved;
  } catch (e) { /* stockage indisponible : on continue */ }

  const configured = typeof DEFAULT_LANGUAGE !== "undefined" ? DEFAULT_LANGUAGE : "auto";
  if (LANGUAGES.includes(configured)) return configured;

  const browserLang = (navigator.language || "").toLowerCase();
  return browserLang.startsWith("fr") ? "fr" : "en";
}

function saveLanguage(code) {
  try { window.localStorage.setItem(LANG_STORAGE_KEY, code); } catch (e) { /* pas grave */ }
}

function setLanguage(code) {
  if (!LANGUAGES.includes(code) || code === currentLang) return;
  currentLang = code;
  saveLanguage(code);
  renderAll(true);
}

/* Crée le bouton FR / EN dans la navigation (aucun HTML à écrire). */
function setupLanguageSwitch() {
  const host = document.querySelector(".site-nav") || document.querySelector(".site-header");
  if (!host) return;

  const group = document.createElement("div");
  group.className = "lang-switch";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", "Langue / Language");

  const names = { fr: "Français", en: "English" };
  LANGUAGES.forEach((code) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = code.toUpperCase();
    button.setAttribute("data-lang", code);
    button.setAttribute("lang", code);
    button.setAttribute("aria-label", names[code]);
    button.addEventListener("click", () => setLanguage(code));
    group.appendChild(button);
  });

  host.appendChild(group);
}

function updateSwitchState() {
  document.querySelectorAll(".lang-switch [data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.getAttribute("data-lang") === currentLang));
  });
}

/* t(valeur) : choisit le texte dans la langue courante.
   - un texte simple ("Krita") est renvoyé tel quel, quelle que soit la langue ;
   - un texte à deux versions ({ fr: "...", en: "..." }) renvoie la bonne ;
   - une liste est traduite élément par élément ;
   - si la langue demandée manque, on prend l'autre (français d'abord). */
function t(value) {
  if (Array.isArray(value)) return value.map(t);
  if (value && typeof value === "object") {
    const picked = value[currentLang] !== undefined
      ? value[currentLang]
      : (value.fr !== undefined ? value.fr : value.en);
    return t(picked);
  }
  return value;
}

/* ui("clé") : texte de l'interface tiré de lang.js. {name} est remplacé par
   ton nom. Renvoie "" si la clé n'existe pas (le texte du HTML reste alors). */
function ui(key, vars) {
  if (typeof UI === "undefined") return "";
  const text = (UI[currentLang] && UI[currentLang][key] !== undefined)
    ? UI[currentLang][key]
    : (UI.fr ? UI.fr[key] : undefined);
  if (typeof text !== "string") return "";

  const values = Object.assign({ name: typeof ABOUT !== "undefined" ? t(ABOUT.name) : "" }, vars);
  return text.replace(/\{(\w+)\}/g, (match, name) => (values[name] !== undefined ? values[name] : match));
}

/* Textes fixes écrits dans les pages HTML :
   data-i18n="clé"             → remplace le texte de l'élément
   data-i18n-aria-label="clé"  → remplace son aria-label */
function applyStaticTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const text = ui(el.getAttribute("data-i18n"));
    if (text) el.textContent = text;
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const text = ui(el.getAttribute("data-i18n-aria-label"));
    if (text) el.setAttribute("aria-label", text);
  });
}

/* Titre de l'onglet et descriptions (clés "meta.<page>.…" de lang.js).
   La page est reconnue grâce à <body data-page="...">. */
function applyPageMeta() {
  const page = document.body.getAttribute("data-page");
  if (!page) return;

  const title = ui(`meta.${page}.title`);
  const description = ui(`meta.${page}.description`);

  if (title) {
    document.title = title;
    setMeta('meta[property="og:title"]', title);
  }
  if (description) {
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:description"]', description);
  }
}

function setMeta(selector, content) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute("content", content);
}

/* -------------------------------------------------------------------------
   1. INFOS PERSO
   Tout élément HTML avec un attribut data-about="xxx" est automatiquement
   rempli avec la valeur correspondante de about.js.
   Exemple : <span data-about="email"></span> affichera l'email.
   Champs disponibles : name, status, email, internshipNote.
   Pour "links" et "softwares" et "bio" (listes), voir plus bas.
   Chaque champ peut être un texte simple ou { fr: "...", en: "..." }.
   ----------------------------------------------------------------------- */
function fillAboutInfo() {
  if (typeof ABOUT === "undefined") return;

  document.querySelectorAll("[data-about]").forEach((el) => {
    const value = t(ABOUT[el.getAttribute("data-about")]);
    if (typeof value === "string") el.textContent = value;
  });

  // Tagline (3 disciplines) → un <span> par discipline
  const taglineEl = document.querySelector("[data-about-tagline]");
  const tagline = t(ABOUT.tagline);
  if (taglineEl && Array.isArray(tagline)) {
    taglineEl.innerHTML = "";
    tagline.forEach((word) => {
      const span = document.createElement("span");
      span.textContent = word;
      taglineEl.appendChild(span);
    });
  }

  // Bio (page About) → un <p> par paragraphe
  const bioEl = document.querySelector("[data-about-bio]");
  const bio = t(ABOUT.bio);
  if (bioEl && Array.isArray(bio)) {
    bioEl.innerHTML = "";
    bio.forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      bioEl.appendChild(p);
    });
  }

  // Logiciels (page About) → liste horizontale
  const softwaresEl = document.querySelector("[data-about-softwares]");
  const softwares = t(ABOUT.softwares);
  if (softwaresEl && Array.isArray(softwares)) {
    softwaresEl.textContent = softwares.join(", ");
  }

  // Liens (CV, LinkedIn, Instagram...) → utilisé dans le footer et la page About.
  // Le lien CV pointe vers le fichier de la langue choisie (champ "cv" de about.js).
  const links = (ABOUT.links || []).map((link) => ({ label: t(link.label), url: link.url }));
  const cvPath = t(ABOUT.cv);
  if (typeof cvPath === "string" && cvPath) {
    links.unshift({ label: ui("cv.label") || "CV", url: cvPath });
  }

  document.querySelectorAll("[data-about-links]").forEach((container) => {
    container.innerHTML = "";
    links.forEach((link) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link.url;
      a.textContent = link.label;
      a.target = "_blank";
      a.rel = "noopener";
      li.appendChild(a);
      container.appendChild(li);
    });
  });

  // Email en tant que lien mailto, partout où on trouve [data-about-email-link]
  document.querySelectorAll("[data-about-email-link]").forEach((a) => {
    a.href = "mailto:" + ABOUT.email;
    a.textContent = ABOUT.email;
  });

  // Dessin en fond de la page d'accueil (derrière le titre).
  // Défini dans about.js via le champ "heroBackground".
  const heroBg = document.querySelector("[data-hero-bg]");
  if (heroBg && ABOUT.heroBackground) {
    heroBg.style.backgroundImage = `url("${ABOUT.heroBackground}")`;
  }
}

/* -------------------------------------------------------------------------
   2. GALERIE
   Cherche un élément avec [data-gallery] et y génère automatiquement une
   vignette par œuvre de works.js.
   - Sur la Home, on ajoute data-featured-only sur cet élément pour n'afficher
     que les œuvres marquées "featured: true".
   - La mise en page en colonnes (façon Pinterest) est entièrement gérée par
     le CSS (voir style.css, section "GALERIE") : ce script se contente de
     créer les blocs dans l'ordre.
   - Pour une vidéo hébergée sur YouTube/Vimeo (type "embed"), la vignette
     est une image : "poster" si tu en donnes une, sinon la miniature
     YouTube automatique.
   ----------------------------------------------------------------------- */
function renderGallery() {
  const container = document.querySelector("[data-gallery]");
  if (!container || typeof WORKS === "undefined") return null;

  const featuredOnly = container.hasAttribute("data-featured-only");
  const items = featuredOnly ? WORKS.filter((w) => w.featured) : WORKS;

  container.innerHTML = "";

  items.forEach((work) => {
    const title = t(work.title) || "";

    const item = document.createElement("article");
    item.className = "gallery-item";
    item.setAttribute("data-category", categoriesOf(work).join(" "));

    const link = document.createElement("a");
    link.href = `oeuvre.html?id=${encodeURIComponent(work.id)}`;

    if (work.type === "video") {
      const video = document.createElement("video");
      video.src = work.media;
      if (work.poster) video.poster = work.poster;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute("aria-hidden", "true");
      link.appendChild(video);
    } else if (work.type === "embed") {
      const info = getEmbedInfo(work.media);
      const img = document.createElement("img");
      img.src = work.poster || (info && info.thumb) || "";
      img.alt = title;
      img.loading = "lazy";
      // Si la miniature YouTube haute définition n'existe pas, on prend la standard.
      if (!work.poster && info && info.thumbFallback) {
        img.addEventListener("error", () => { img.src = info.thumbFallback; }, { once: true });
      }
      link.appendChild(img);
    } else {
      const img = document.createElement("img");
      img.src = work.media;
      img.alt = title;
      img.loading = "lazy";
      link.appendChild(img);
    }

    const caption = document.createElement("div");
    caption.className = "gallery-caption";
    caption.innerHTML = `
      <div class="title">${escapeHtml(title)}</div>
      <div class="category">${escapeHtml(categoryLabels(work))} — ${escapeHtml(work.year)}</div>
    `;
    link.appendChild(caption);

    item.appendChild(link);
    container.appendChild(item);
  });

  return container;
}

/* -------------------------------------------------------------------------
   3. FILTRES (page Work)
   Cherche les boutons [data-filter] et affiche/masque les œuvres de la
   galerie en fonction de la catégorie choisie, sans recharger la page.
   Le filtre choisi est conservé quand on change de langue.
   ----------------------------------------------------------------------- */
function setupFilters(gallery) {
  const buttons = document.querySelectorAll("[data-filter]");
  if (!buttons.length || !gallery) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
      applyCurrentFilter(gallery);
    });
  });
}

function applyCurrentFilter(gallery) {
  const active = document.querySelector("[data-filter][aria-pressed='true']");
  if (!active || !gallery) return;

  const filter = active.getAttribute("data-filter");
  gallery.querySelectorAll(".gallery-item").forEach((item) => {
    const match = matchesFilter(item.getAttribute("data-category"), filter);
    item.classList.toggle("is-hidden", !match);
  });
}

/* -------------------------------------------------------------------------
   Apparition douce des vignettes au scroll (CSS + petit script d'appui).
   Respecte prefers-reduced-motion (voir style.css).
   ----------------------------------------------------------------------- */
function setupScrollReveal(showImmediately) {
  const items = document.querySelectorAll(".gallery-item");
  if (!items.length) return;

  if (showImmediately || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

/* -------------------------------------------------------------------------
   4. PAGE D'UNE ŒUVRE (oeuvre.html)
   Lit l'identifiant de l'œuvre dans l'URL (?id=...) et affiche ses infos.
   Une seule page HTML sert donc à toutes les œuvres.
   ----------------------------------------------------------------------- */
function renderArtworkPage() {
  const root = document.querySelector("[data-artwork-page]");
  if (!root || typeof WORKS === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const work = WORKS.find((w) => w.id === id);

  if (!work) {
    root.innerHTML = `
      <div class="not-found">
        <p>${escapeHtml(ui("artwork.notFound") || "Œuvre introuvable.")}</p>
        <p><a class="button" href="work.html">${escapeHtml(ui("artwork.back") || "Retour au portfolio")}</a></p>
      </div>
    `;
    return;
  }

  const title = t(work.title) || "";
  const tools = t(work.tools);

  document.title = `${title} — ${t(ABOUT.name)}`;

  document.querySelector("[data-artwork-category]").textContent =
    `${categoryLabels(work)} — ${work.year}`;
  document.querySelector("[data-artwork-title]").textContent = title;
  document.querySelector("[data-artwork-description]").textContent = t(work.description) || "";

  const toolsEl = document.querySelector("[data-artwork-tools]");
  if (toolsEl) toolsEl.textContent = Array.isArray(tools) ? tools.join(", ") : (tools || "");

  // Médias : on utilise "gallery" si présent (plusieurs images/vidéos),
  // sinon simplement le média principal (media/poster/type).
  const mediaContainer = document.querySelector("[data-artwork-media]");
  mediaContainer.innerHTML = "";

  const mediaList = Array.isArray(work.gallery) && work.gallery.length
    ? work.gallery
    : [{ src: work.media, caption: null, type: work.type, poster: work.poster }];

  mediaList.forEach((item) => {
    const figure = document.createElement("figure");
    const caption = t(item.caption);

    // Le type est déduit de l'élément lui-même : lien YouTube/Vimeo → lecteur
    // intégré, fichier .mp4/.webm → lecteur vidéo, sinon → image.
    const embed = (item.type === "embed" || !item.type) ? getEmbedInfo(item.src) : null;
    const isVideo = item.type === "video" || /\.(mp4|webm)$/i.test(item.src);

    if (embed) {
      const wrapper = document.createElement("div");
      wrapper.className = "embed-wrapper";
      const iframe = document.createElement("iframe");
      iframe.src = embed.embedUrl;
      iframe.title = caption || title;
      iframe.loading = "lazy";
      iframe.allow = "fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      wrapper.appendChild(iframe);
      figure.appendChild(wrapper);

      // Lien de secours : si le lecteur intégré est bloqué chez un visiteur
      // (bloqueur de pub, navigateur strict...), il peut ouvrir la vidéo directement.
      const fallback = document.createElement("a");
      fallback.className = "embed-link";
      fallback.href = embed.watchUrl;
      fallback.target = "_blank";
      fallback.rel = "noopener";
      fallback.textContent = ui("artwork.watchOn", { platform: embed.label }) || `Voir sur ${embed.label} ↗`;
      figure.appendChild(fallback);
    } else if (isVideo) {
      const video = document.createElement("video");
      video.src = item.src;
      video.controls = true;
      video.playsInline = true;
      if (item.poster || work.poster) video.poster = item.poster || work.poster;
      figure.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = caption || title;
      img.loading = "lazy";
      figure.appendChild(img);
    }

    if (caption) {
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = caption;
      figure.appendChild(figcaption);
    }

    mediaContainer.appendChild(figure);
  });

  // Navigation "œuvre précédente / suivante"
  const index = WORKS.findIndex((w) => w.id === id);
  const prev = WORKS[(index - 1 + WORKS.length) % WORKS.length];
  const next = WORKS[(index + 1) % WORKS.length];

  const prevLink = document.querySelector("[data-artwork-prev]");
  const nextLink = document.querySelector("[data-artwork-next]");
  if (prevLink) { prevLink.href = `oeuvre.html?id=${prev.id}`; prevLink.textContent = `← ${t(prev.title)}`; }
  if (nextLink) { nextLink.href = `oeuvre.html?id=${next.id}`; nextLink.textContent = `${t(next.title)} →`; }
}

/* -------------------------------------------------------------------------
   Vidéos hébergées sur YouTube ou Vimeo (pour les fichiers trop lourds).
   On colle simplement le lien normal de la vidéo dans works.js ; cette
   fonction le transforme en lien "intégrable" (embed) et, pour YouTube,
   trouve la miniature automatiquement. Renvoie null si le lien n'est pas
   reconnu. Pour la confidentialité, YouTube est chargé via youtube-nocookie.com.
   ----------------------------------------------------------------------- */
function getEmbedInfo(url) {
  if (typeof url !== "string") return null;

  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) {
    const id = yt[1];
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
      label: "YouTube",
      thumb: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      thumbFallback: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    };
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([A-Za-z0-9]+))?/);
  if (vimeo) {
    // Lien Vimeo "non répertorié" : l'identifiant privé (hash) est conservé s'il existe.
    const hash = vimeo[2] ? `?h=${vimeo[2]}` : "";
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}${hash}`,
      watchUrl: `https://vimeo.com/${vimeo[1]}${vimeo[2] ? "/" + vimeo[2] : ""}`,
      label: "Vimeo",
      thumb: null,
      thumbFallback: null
    };
  }

  return null;
}

/* -------------------------------------------------------------------------
   Utilitaires
   ----------------------------------------------------------------------- */
/* Une œuvre peut avoir UNE catégorie ("sketchbook") ou PLUSIEURS
   (["sketchbook", "character-design"]). Ces trois fonctions gèrent les deux
   cas. Une œuvre multi-catégories n'est affichée qu'une seule fois dans
   "All" et apparaît dans chacun de ses filtres. */
function categoriesOf(work) {
  return Array.isArray(work.category) ? work.category : [work.category];
}

function categoryLabels(work) {
  return categoriesOf(work).map(categoryLabel).join(" / ");
}

function matchesFilter(categoryAttribute, filter) {
  return filter === "all" || (categoryAttribute || "").split(" ").includes(filter);
}

function categoryLabel(category) {
  const labels = {
    "character-design": "Character Design",
    "animation": "Animation",
    "storyboard": "Storyboard",
    "sketchbook": "Sketchbook",
    "other": "Other"
  };
  // Catégorie ajoutée plus tard sans être listée ci-dessus : on met simplement
  // une majuscule ("mon-theme" devient "Mon theme").
  const fallback = String(category).replace(/-/g, " ");
  return labels[category] || fallback.charAt(0).toUpperCase() + fallback.slice(1);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
