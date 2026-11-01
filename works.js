/* =========================================================================
   works.js — LE CONTENU DE TON PORTFOLIO
   -------------------------------------------------------------------------
   Ce fichier est le SEUL endroit où tu dois toucher pour ajouter, modifier
   ou supprimer une œuvre. Tu n'as jamais besoin d'ouvrir index.html,
   work.html, oeuvre.html ou script.js pour ça.

   ┌─────────────────────────────────────────────────────────────────────┐
   │ COMMENT AJOUTER UNE ŒUVRE                                            │
   │ 1. Mets ton image (ou vidéo) dans le dossier /images (ou /videos).   │
   │ 2. Copie-colle un des blocs { ... } ci-dessous, à la fin du tableau. │
   │ 3. Change les informations (titre, catégorie, année...).            │
   │ 4. Donne-lui un "id" unique (pas d'espace, pas d'accent).            │
   │ 5. Sauvegarde. C'est tout : la galerie et les filtres se mettent à   │
   │    jour tout seuls.                                                  │
   │                                                                       │
   │ COMMENT SUPPRIMER UNE ŒUVRE                                          │
   │ Supprime son bloc { ... } entier (avec la virgule qui suit).         │
   │                                                                       │
   │ COMMENT MODIFIER UNE ŒUVRE                                           │
   │ Change simplement les valeurs à l'intérieur de son bloc.             │
   │                                                                       │
   │ COMMENT CHANGER SA CATÉGORIE                                         │
   │ Change la valeur de "category". Les catégories valides sont :        │
   │   "character-design", "animation", "sketchbook", "other"            │
   │ (elles doivent être écrites EXACTEMENT comme ça, en minuscules).     │
   │                                                                       │
   │ COMMENT METTRE UNE ŒUVRE EN AVANT (page d'accueil)                   │
   │ Mets "featured: true". La Home affiche automatiquement les œuvres    │
   │ marquées featured (dans l'ordre où elles apparaissent ici).          │
   │                                                                       │
   │ COMMENT AJOUTER UNE VIDÉO                                            │
   │ Mets "type: 'video'", "media: 'videos/ton-fichier.mp4'" et,          │
   │ si tu veux une image affichée avant que la vidéo ne joue,            │
   │ ajoute "poster: 'images/ton-image.jpg'".                             │
   │                                                                       │
   │ COMMENT AJOUTER PLUSIEURS IMAGES À UNE MÊME ŒUVRE                    │
   │ Utilise "gallery: [ ... ]" (voir l'exemple sur "character-01").      │
   │ Chaque élément a un "src" et une "caption" (légende) optionnelle.    │
   │ L'image/vidéo dans "media" reste l'image principale (la vignette).   │
   └─────────────────────────────────────────────────────────────────────┘
*/

const WORKS = [
  {
    id: "character-01",
    title: "Film d'animation",
    category: "character-design",
    year: "2026",
    tools: ["Krita", "After Effects"],
    description:
      "Réalisation d'un mini film d'animation dans le cadre d'un projet de cours. L'animation a été faite en frame par frame sur Krita et le montage final sur After effects. ",
    type: "image",                  // "image" ou "video"
    media: "images/charadesign-01.png",
    featured: true,                 // true = apparaît sur la page d'accueil
    // Exemple d'œuvre avec plusieurs images (recherches + finale) :
    gallery: [
      { src: "images/charadesign-01.PNG", caption: "Design final" },
      { src: "images/charadesign-01.PNG", caption: "Recherches et explorations de silhouettes" }
    ]
  },
  {
    id: "animation-01",
    title: "CV video",
    category: "animation",
    year: "2025",
    tools: ["Photoshop", "After Effects"],
    description:
      "Réalisation de mon CV vidéo dans le cadre d'un projet de cours, en anglais. J'ai réalisé l'animation, le doublage et le montage. ",
    type: "video",
    media: "videos/CVvideo.mp4",
    poster: "images/minia-CVvideo.png",
    featured: true
  },
  {
    id: "animation-04",
    title: "2D Animation",
    category: "animation",
    year: "2026",
    tools: ["Krita"],
    description:
      "",
    type: "video",
    media: "videos/animation1.gif",
    poster: "videos/animation1.gif",
    featured: true
  },
  {
    id: "storyboard1",
    title: "BD",
    category: "storyboard",
    year: "2026",
    tools: ["Illustrator", "Krita"],
    description:
      "Réalisation d'une page de BD dans le cadre d'un projet de cours, en anglais. J'ai réalisé le design du personnage, le scénario et la colorisation",
    type: "image",
    media: "images/metamorphosis.png",
    featured: true
  },
  {
    id: "storyboard2",
    title: "Vogler",
    category: "storyboard",
    year: "2026",
    tools: ["Krita"],
    description:
      "Réalisation d'un storyboard pour une pub dans le cadre d'un projet de cours. J'ai réalisé l'entiereté du storyboard et participé à l'écriture du scénario",
    type: "image",
    media: "images/Vogler1.png",
    featured: true,
    gallery: [
      { src: "images/Vogler1.png", caption: "Partie1" },
      { src: "images/Vogler2.png", caption: "Partie2" }
    ]
  },
  {
    id: "animation-02",
    title: "cycle de marche",
    category: "animation",
    year: "2025",
    tools: ["Character Animator", "Photoshop"],
    description:
      "Exercice sur le cycle de marche où le personnage devait être animé sur Character Animator. J'ai choisi de créer un personnage original.",
    type: "video",
    media: "videos/cycleMarche.mp4",
    poster: "images/minia-cyclemarche.png",
    featured: false
  },
  {
    id: "animation-03",
    title: "parodieMAIF",
    category: "animation",
    year: "2025",
    tools: ["Character Animator", "After Effects", "Illustrator"],
    description:
      "Réalisation d'une parodie de la marque MAIF dans le cadre d'un projet de cours. Le personnage devait être animé en ulisant Character Animator. J'ai réalisé l'animation, le montage et le doublage.",
    type: "video",
    media: "videos/parodieMAIF.mp4",
    poster: "images/minia-MAIF.png",
    featured: false
  },
  {
    id: "animation-05",
    title: "2D Animation",
    category: "animation",
    year: "2026",
    tools: ["Krita"],
    description:
      "",
    type: "video",
    media: "videos/animation2.gif",
    poster: "videos/animation2.gif",
    featured: true
  },
  {
    id: "other-01",
    title: "Court métrage",
    category: "other",
    year: "2026",
    tools: ["Adobe Illustrator", "After Effects"],
    description:
      "Réalisation d'un court métrage dans le cadre d'un projet de cours. Le projet a été fait par petit groupe dans un délai de 2 mois environ. J'ai participé à l'écriture du script et ai réalisé le générique de fin. ",
    type: "embed",
    media: "https://youtu.be/ZVWlTLYGJ-0",
    poster: "images/minia-Alibi.png",
    featured: true
  },
  {
    id: "other-02",
    title: "WebTV",
    category: "other",
    year: "2025",
    tools: ["Adobe Illustrator", "After Effects"],
    description:
      "Réalisation d'une émission de télévision en ligne dans le cadre d'un projet de cours. J'ai réalisé les third lowers et l'écran d'attente",
    type: "embed",
    media: "https://youtu.be/Q8G7y0D7LiM",
    poster: "images/minia-WebTV.png",
    featured: false
  },
  {
    id: "other-03",
    title: "StopMotion",
    category: "other",
    year: "2026",
    tools: ["Adobe Illustrator", "After Effects"],
    description:
      "Réalisation d'un film d'animation en stop-motion dans le cadre d'un projet de cours. J'ai participé à la conception du personnage, à la réalisation de l'animation, à la scénarisation et au doublage",
    type: "video",
    media: "videos/Stopmotion.mp4",
    poster: "images/minia-Stopmotion.png",
    featured: false
  },
  {
    id: "other-04",
    title: "WebTV2",
    category: "other",
    year: "2025",
    tools: ["Adobe Illustrator", "After Effects"],
    description:
      "Réalisation d'une émission de télévision en ligne dans le cadre d'un projet de cours. J'ai réalisé le design du personnage et des décors pour les génériques de début et de fin",
    type: "video",
    media: "videos/WEBTV2.mp4",
    poster: "images/minia-WebTV2.png",
    featured: false
  },
  {
    id: "other-05",
    title: "CapsuleVideo-01",
    category: "other",
    year: "2025",
    tools: ["Adobe Illustrator", "After Effects"],
    description:
      "Réalisation de capsules vidéos pour le département des Relations Internationales de l'IUT de Lens. J'ai réalisé le motion design.",
    type: "embed",
    media: "https://youtu.be/BWDZ-F9A6eM",
    poster: "images/minia-Capsule-01.png",
    featured: false
  },
  {
    id: "other-07",
    title: "Showcase Insta360",
    category: "other",
    year: "2026",
    tools: ["Insta360Studio"],
    description:
      "Showcase des différentes fonctionnalités d'une caméra 360 réalisées avec Insta360Studio.",
    type: "embed",
    media: "https://youtu.be/aD1sPK0JdkY",
    poster: "images/minia-360.png",
    featured: false
  },
  {
    id: "sketchbook-02",
    title: "Pages de carnet",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-02.jpg",
    featured: true
  },
  {
    id: "sketchbook-03",
    title: "etudes de poses",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-03.jpg",
    featured: true
  },
  {
    id: "sketchbook-04",
    title: "Études de poses",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-04.jpg",
    featured: true
  },
  {
    id: "sketchbook-05",
    title: "Études de poses",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-05.jpg",
    featured: true
  },
  {
    id: "sketchbook-06",
    title: "Études de poses",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-06.jpg",
    featured: true
  },
  {
    id: "sketchbook-07",
    title: "Études de poses",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-07.jpg",
    featured: false
  },
  {
    id: "sketchbook-08",
    title: "Études de poses",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-08.jpg",
    featured: false
  },
  {
    id: "sketchbook-09",
    title: "Études de poses",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-09.jpg",
    featured: true
  },
  {
    id: "sketchbook-10",
    title: "Études de poses",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-10.jpg",
    featured: false
  },
  {
    id: "sketchbook-11",
    title: "Études de poses",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-11.jpg",
    featured: true
  },
  {
    id: "sketchbook-12",
    title: "Études de poses",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-12.jpg",
    featured: false
  },
  {
    id: "sketchbook-13",
    title: "Études de poses",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-13.jpg",
    featured: false
  },
  {
    id: "sketchbook-14",
    title: "Études de poses",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-14.jpg",
    featured: false
  },
  {
    id: "sketchbook-15",
    title: "Études de poses",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-15.jpg",
    featured: false
  },
  {
    id: "sketchbook-16",
    title: "Études de poses",
    category: "sketchbook",
    year: "2025",
    tools: ["Crayon"],
    description: "",
    type: "image",
    media: "images/sketchbook-16.jpg",
    featured: false
  }
];

/* Ne modifie rien en dessous de cette ligne : cette partie exporte
   simplement la liste ci-dessus pour que le reste du site puisse la lire. */
if (typeof module !== "undefined") { module.exports = WORKS; }
