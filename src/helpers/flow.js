export const PAYMENTS_TYPES = [
  { label: "Fiche consultation médecin", code: "FCM" },
  { label: "Fiche Gynecologie", code: "FGY" },
  { label: "Fiche Soins Intensifs", code: "FSI" },
  { label: "Fiche CPN", code: "CPN" },
  { label: "Fiche CPS", code: "CPS" },
  { label: "Maternite", code: "MAT" },
  { label: "Echographie", code: "ECH" },
  { label: "Soins Intensifs", code: "SIN" },
  { label: "Pharmacie", code: "PHA" },
  { label: "Depense", code: "DEP" },
  { label: "Other", code: "OTH" },
];

export const GET_PAYMENT_TYPE = (code) => {
  return PAYMENTS_TYPES.filter((it) => it.code === code)[0];
};

export function GetPaymentTypeLableFromCode(code) {
  return (
    (PAYMENTS_TYPES.find((it, i) => it.code === code) &&
      PAYMENTS_TYPES.find((it, i) => it.code === code).label) ||
    code
  );
}

export const cltd = "border-b border-l border-neutral-400 p-1 ";

export const MOIS = [
  "All",
  "Jan",
  "Fev",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aou",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const DEPARTEMENTS = {
  MAT: { label: "Maternite", code: "MAT", sub: "MAT" },
  SIN: { label: "Soins Curatifs", code: "SIN", sub: "SIN" },
  SOP: { label: "Salle d'OP", code: "SOP", sub: "SOP" },
};

export const USERS_LEVELS = ["ADM", "AGE", "REC"];

export const CATEGORIES_MEDECINS = [
  { title: "Tous", sub: "Toute la liste", code: "ALL" },
  { title: "Infirmiers", sub: "Liste des infirmiers", code: "INF" },
  { title: "Medecins", sub: "Liste des medecins", code: "MED" },
];

export const CATEGORIES_PATIENTS = [
  { title: "Tous", sub: "Tous les patients", code: "ALL" },
  { title: "Maternite", sub: "", code: "MAT" },
  { title: "Soins Curatifs", sub: "", code: "SIN" },
  { title: "Salle d'OP", sub: "", code: "SOP" },
];

export const GALLERY_IMAGES_URL = [
  {
    original:
      "https://cdn-prod.medicalnewstoday.com/content/images/articles/327/327331/a-radiologist-busy-looking-at-some-x-rays.jpg",
    thumbnail:
      "https://cdn-prod.medicalnewstoday.com/content/images/articles/327/327331/a-radiologist-busy-looking-at-some-x-rays.jpg",
  },
  {
    original: "https://picsum.photos/id/1015/1000/600/",
    thumbnail: "https://picsum.photos/id/1015/250/150/",
  },
];
