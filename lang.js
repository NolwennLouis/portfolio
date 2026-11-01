/* =========================================================================
   lang.js — LES TEXTES DE L'INTERFACE, EN FRANÇAIS ET EN ANGLAIS
   -------------------------------------------------------------------------
   Ce fichier contient tous les textes "fixes" du site (boutons, intitulés,
   titres des onglets...), dans les deux langues, côte à côte.
   Les textes qui te concernent (présentation, formation, descriptions
   d'œuvres...) sont, eux, dans about.js et works.js.

   COMMENT MODIFIER UN TEXTE
   Trouve la ligne dans la partie "fr" ET dans la partie "en", change le
   texte entre guillemets, sauvegarde.

   {name} est remplacé automatiquement par ton nom (champ "name" de about.js).
   Tu n'as donc jamais besoin de réécrire ton nom ici.

   TITRES DES ONGLETS DU NAVIGATEUR (clés "meta.…")
   - meta.index.title   → onglet de la page d'accueil
   - meta.work.title    → onglet de la page Work
   - meta.about.title   → onglet de la page About
   Les "description" servent aux moteurs de recherche et à l'aperçu quand
   on partage le lien. Le titre de l'onglet d'une œuvre est automatique
   (titre de l'œuvre + ton nom).

   LANGUE PAR DÉFAUT
   "auto" = la langue du navigateur du visiteur (français si son navigateur
   est en français, anglais sinon). Tu peux aussi forcer "fr" ou "en".
   Un visiteur qui clique sur FR / EN garde son choix sur les autres pages.
   Pour envoyer un lien directement en anglais : ton-site.netlify.app/?lang=en
   ========================================================================= */

const DEFAULT_LANGUAGE = "auto";   // "auto", "fr" ou "en"

const UI = {
  fr: {
    "meta.index.title": "{name} — Character Design, Illustration, Animation 2D",
    "meta.index.description": "Portfolio de {name}, étudiant en BUT MMI, orienté character design, illustration et animation 2D. Actuellement à la recherche d'un stage.",
    "meta.work.title": "Work — {name}",
    "meta.work.description": "Portfolio complet : character design, illustration, animation 2D, storyboard, sketchbook et autres projets.",
    "meta.about.title": "About — {name}",
    "meta.about.description": "À propos de {name}, étudiant en BUT MMI, character designer et illustrateur à la recherche d'un stage.",

    "hero.lookingIn": "— dans un studio d'animation, d'illustration ou de character design.",
    "hero.cta": "Voir le portfolio",

    "about.education": "Formation",
    "about.looking": "Recherche",
    "about.software": "Logiciels",
    "about.email": "Email",

    "artwork.tools": "Outils —",
    "artwork.notFound": "Œuvre introuvable.",
    "artwork.back": "Retour au portfolio",
    "artwork.watchOn": "Voir sur {platform} ↗",

    "cv.label": "CV",

    "aria.mainNav": "Navigation principale",
    "aria.selection": "Sélection d'œuvres",
    "aria.filters": "Filtrer par catégorie",
    "aria.artworkNav": "Œuvre précédente ou suivante"
  },

  en: {
    "meta.index.title": "{name} — Character Design, Illustration, 2D Animation",
    "meta.index.description": "Portfolio of {name}, BUT MMI student focused on character design, illustration and 2D animation. Currently looking for an internship.",
    "meta.work.title": "Work — {name}",
    "meta.work.description": "Full portfolio: character design, illustration, 2D animation, storyboard, sketchbook and other projects.",
    "meta.about.title": "About — {name}",
    "meta.about.description": "About {name}, BUT MMI student, character designer and illustrator looking for an internship.",

    "hero.lookingIn": "— at an animation, illustration or character design studio.",
    "hero.cta": "View portfolio",

    "about.education": "Education",
    "about.looking": "Looking for",
    "about.software": "Software",
    "about.email": "Email",

    "artwork.tools": "Tools —",
    "artwork.notFound": "Artwork not found.",
    "artwork.back": "Back to portfolio",
    "artwork.watchOn": "Watch on {platform} ↗",

    "cv.label": "CV",

    "aria.mainNav": "Main navigation",
    "aria.selection": "Selected works",
    "aria.filters": "Filter by category",
    "aria.artworkNav": "Previous or next artwork"
  }
};
