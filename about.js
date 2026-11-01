/* =========================================================================
   about.js — TES INFORMATIONS PERSONNELLES
   -------------------------------------------------------------------------
   Modifie les valeurs ci-dessous : elles sont utilisées automatiquement
   sur toutes les pages du site (nom dans l'en-tête, page About, footer...).
   Tu n'as jamais besoin de chercher ces informations dans les fichiers HTML.
   ========================================================================= */

const ABOUT = {
  name: "Nolwenn Louis",
  tagline: ["Character Design", "2D Animation"],

  heroBackground: "images/banniereHaut.png",

  // Paragraphes de présentation (page About). Un paragraphe par ligne.
  bio: [
    { fr: "Étudiante en 3e année de BUT MMI, parcours Création Numérique, je suis une passionnée de dessin et de character design.",
      en: "Currently a 3rd year BUT MMI student, Digital Creation course, I am passionate about drawing and character design." },
    { fr: "Curieuse et créative, j'aime imaginer des personnages, créer des univers et donner vie à mes idées à travers le dessin.",
      en: "Curious and creative, I like to imagine characters, create universes and bring my ideas to life through drawing." }
  ],




  status: { fr : "Étudiante en BUT MMI Création numérique", 
            en : "Student in BUT MMI, digital creation" },
  lookingForInternship: true,
  internshipNote: { fr :"Actuellement à la recherche d'un stage",
                  en : "Currently looking for an internship"},

  softwares: ["Krita", "Photoshop", "After Effects", "Illustrator"],

  email: "nolwenn.louis.nl@gmail.com",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/nolwenn-louis" }
  ],

  cv: { fr: "cv/cv-fr.pdf", en: "cv/cv-en.pdf" },
};

if (typeof module !== "undefined") { module.exports = ABOUT; }
