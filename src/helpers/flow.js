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
  MAT: { label: "Maternite", code: "MAT" },
  SIN: { label: "Soins Intensifs", code: "SIN" },
  SOP: { label: "Salle d'OP", code: "SOP" },
};

export const USER_LEVELS = ["ADM", "AGE", "REC"];
