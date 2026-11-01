/* =========================================================================
   script.js — COMPORTEMENTS DU SITE
   -------------------------------------------------------------------------
   Tu ne devrais normalement jamais avoir besoin de modifier ce fichier :
   il lit simplement le contenu de works.js et about.js et l'affiche.

   Ce fichier est découpé en 4 parties, indépendantes les unes des autres :
     1. Remplissage automatique des infos perso (about.js)
     2. Génération de la galerie d'œuvres (works.js)
     3. Filtres par catégorie (page Work)
     4. Page de détail d'une œuvre (oeuvre.html)
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  fillAboutInfo();
  const gallery = renderGallery();
  setupFilters(gallery);
  setupScrollReveal();
  renderArtworkPage();
});

/* -------------------------------------------------------------------------
   1. INFOS PERSO
   Tout élément HTML avec un attribut data-about="xxx" est automatiquement
   rempli avec la valeur correspondante de about.js.
   Exemple : <span data-about="email"></span> affichera l'email.
   Champs disponibles : name, status, email, internshipNote.
   Pour "links" et "softwares" et "bio" (listes), voir plus bas.
   ----------------------------------------------------------------------- */
function fillAboutInfo() {
  if (typeof ABOUT === "undefined") return;

  document.querySelectorAll("[data-about]").forEach((el) => {
    const field = el.getAttribute("data-about");
    if (typeof ABOUT[field] === "string") {
      el.textContent = ABOUT[field];
    }
  });

  // Tagline (3 disciplines) → un <span> par discipline
  const taglineEl = document.querySelector("[data-about-tagline]");
  if (taglineEl && Array.isArray(ABOUT.tagline)) {
    taglineEl.innerHTML = "";
    ABOUT.tagline.forEach((word) => {
      const span = document.createElement("span");
      span.textContent = word;
      taglineEl.appendChild(span);
    });
  }

  // Bio (page About) → un <p> par paragraphe
  const bioEl = document.querySelector("[data-about-bio]");
  if (bioEl && Array.isArray(ABOUT.bio)) {
    bioEl.innerHTML = "";
    ABOUT.bio.forEach((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      bioEl.appendChild(p);
    });
  }

  // Logiciels (page About) → liste horizontale
  const softwaresEl = document.querySelector("[data-about-softwares]");
  if (softwaresEl && Array.isArray(ABOUT.softwares)) {
    softwaresEl.textContent = ABOUT.softwares.join(", ");
  }

  // Liens (LinkedIn, Instagram...) → utilisé dans le footer et la page About
  document.querySelectorAll("[data-about-links]").forEach((container) => {
    container.innerHTML = "";
    ABOUT.links.forEach((link) => {
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
      img.alt = work.title;
      img.loading = "lazy";
      // Si la miniature YouTube haute définition n'existe pas, on prend la standard.
      if (!work.poster && info && info.thumbFallback) {
        img.addEventListener("error", () => { img.src = info.thumbFallback; }, { once: true });
      }
      link.appendChild(img);
    } else {
      const img = document.createElement("img");
      img.src = work.media;
      img.alt = work.title;
      img.loading = "lazy";
      link.appendChild(img);
    }

    const caption = document.createElement("div");
    caption.className = "gallery-caption";
    caption.innerHTML = `
      <div class="title">${escapeHtml(work.title)}</div>
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
   ----------------------------------------------------------------------- */
function setupFilters(gallery) {
  const buttons = document.querySelectorAll("[data-filter]");
  if (!buttons.length || !gallery) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");

      gallery.querySelectorAll(".gallery-item").forEach((item) => {
        const match = matchesFilter(item.getAttribute("data-category"), filter);
        item.classList.toggle("is-hidden", !match);
      });
    });
  });
}

/* -------------------------------------------------------------------------
   Apparition douce des vignettes au scroll (CSS + petit script d'appui).
   Respecte prefers-reduced-motion (voir style.css).
   ----------------------------------------------------------------------- */
function setupScrollReveal() {
  const items = document.querySelectorAll(".gallery-item");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
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
        <p>Œuvre introuvable.</p>
        <p><a class="button" href="work.html">Retour au portfolio</a></p>
      </div>
    `;
    return;
  }

  document.title = `${work.title} — ${ABOUT.name}`;

  document.querySelector("[data-artwork-category]").textContent =
    `${categoryLabels(work)} — ${work.year}`;
  document.querySelector("[data-artwork-title]").textContent = work.title;
  document.querySelector("[data-artwork-description]").textContent = work.description;

  const toolsEl = document.querySelector("[data-artwork-tools]");
  if (toolsEl) toolsEl.textContent = work.tools.join(", ");

  // Médias : on utilise "gallery" si présent (plusieurs images/vidéos),
  // sinon simplement le média principal (media/poster/type).
  const mediaContainer = document.querySelector("[data-artwork-media]");
  mediaContainer.innerHTML = "";

  const mediaList = Array.isArray(work.gallery) && work.gallery.length
    ? work.gallery
    : [{ src: work.media, caption: null, type: work.type, poster: work.poster }];

  mediaList.forEach((item) => {
    const figure = document.createElement("figure");

    // Le type est déduit de l'élément lui-même : lien YouTube/Vimeo → lecteur
    // intégré, fichier .mp4/.webm → lecteur vidéo, sinon → image.
    const embed = (item.type === "embed" || !item.type) ? getEmbedInfo(item.src) : null;
    const isVideo = item.type === "video" || /\.(mp4|webm)$/i.test(item.src);

    if (embed) {
      const wrapper = document.createElement("div");
      wrapper.className = "embed-wrapper";
      const iframe = document.createElement("iframe");
      iframe.src = embed.embedUrl;
      iframe.title = item.caption || work.title;
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
      fallback.textContent = `Voir sur ${embed.label} ↗`;
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
      img.alt = item.caption || work.title;
      img.loading = "lazy";
      figure.appendChild(img);
    }

    if (item.caption) {
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = item.caption;
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
  if (prevLink) { prevLink.href = `oeuvre.html?id=${prev.id}`; prevLink.textContent = `← ${prev.title}`; }
  if (nextLink) { nextLink.href = `oeuvre.html?id=${next.id}`; nextLink.textContent = `${next.title} →`; }
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
