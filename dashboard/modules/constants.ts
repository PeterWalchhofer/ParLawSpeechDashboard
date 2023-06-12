import { Index } from "./types";

export const BLUE = "#71b7f4";
export const BLACK = "#1B1B1E";
export const GRAY = "#D8DBE2";

export function sd(array: number[]) {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
}

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function roundDateToYear(date: Date) {
  const roundedDate = new Date(date);

  if (roundedDate.getMonth() >= 6) {
    roundedDate.setFullYear(roundedDate.getFullYear() + 1);
  }

  roundedDate.setMonth(0);
  roundedDate.setDate(1);

  return roundedDate;
}

export function parseKeywords(keywords: string[]) {
  return Object.fromEntries(keywords.map((k, i) => [`q${i}`, k]));
}

export type PartyItem = {
  party: string;
  n: number;
};

function rgbToHsl(r: number, g: number, b: number) {
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = (max + min) / 2;
  let s = h;
  let l = h;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
}

export function hexToHsl(color: string = "#ffffff") {
  var r = parseInt(color.substring(1, 2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
  var g = parseInt(color.substring(3, 2), 16);
  var b = parseInt(color.substring(5, 2), 16);

  return rgbToHsl(r, g, b);
}

export const INDEX_LABELS = {
  speeches_austria: {
    country: "Austria",
    countryFrom: "Austrian",
  },
  speeches_germany: {
    country: "Germany",
    countryFrom: "German",
  },
  speeches_spain: {
    country: "Spain",
    countryFrom: "Spanish",
  },
  speeches_ep: {
    country: "EU",
    countryFrom: "EU",
  },
  speeches_cz: {
    country: "Czech Republic",
    countryFrom: "Czech",
  },
  speeches_croatia: {
    country: "Croatia",
    countryFrom: "Croatian",
  },
};

export const PARTY_COLORS: Record<Index, Record<string, string>> = {
  speeches_germany: {
    "CDU/CSU": "#000000",
    SPD: "#E4002B",
    FDP: "#FFCE00",
    "BÜNDNIS 90/DIE GRÜNEN": "#008A00",
    "DIE LINKE": "#DC4405",
    AfD: "#00A1DE",
    PIRATEN: "#00A1DE",
  },
  speeches_austria: {
    ÖVP: "#000000",
    SPÖ: "#E4002B",
    FPÖ: "#205CA5",
    Grüne: "#008A00",
    NEOS: "#E84188",
    KPÖ: "#00A1DE",
    PILZ: "#CCCCCC",
    JETZT: "#CCCCCC",
    BZÖ: "#EE7F00",
    LIF: "#FECD00",
    STRONACH: "#f8d323",
  },
  speeches_cz: {
    ANO: "#261060",
    ODS: "#034EA2",
    KSČM: "#BF0202",
    ČSSD: "#EC5800",
    TOP09: "#993366",
    "KDU-ČSL": "#FFD700",
    STAN: "#7EC192",
    SPD: "#1074BC",
    Piráti: "#000000",
  },
  speeches_croatia: {
    HDZ: "#025EB1",
    SDP: "#ED1C24",
    HSS: "#02B14B",
    IDS: "#0CB14B",
    HSU: "#FFFFFF",
    HSP: "#000000",
    HDS: "#1974D2",
    HSLS: "#FEDE00",
    HRAST: "#5299E1",
  },
  speeches_spain: {
    PP: "#0054A6",
    PSOE: "#FF0000",
    Vox: "#5B2C82",
    UP: "#6B2E68",
    Cs: "#FF8200",
    ERC: "#F7B62C",
    JxCat: "#FFD700",
    PNV: "#008080",
    Más: "#7EB852",
    CUP: "#5BB62C",
    PACMA: "#FA7268",
    Bildu: "#800080",
    "CC-NC": "#FAA61A",
    "Navarra Suma": "#FFD700",
    PRC: "#FF8200",
    "Teruel Existe": "#B31B1B",
    BNG: "#00FF00",
    NC: "#00BFFF",
    PAR: "#009BDB",
    Foro: "#FF0000",
    Compromís: "#50C878",
    PDeCAT: "#008080",
    PCAS: "#800000",
    "PR+": "#00BFFF",
    PLIB: "#2E8B57",
    PA: "#FF0000",
    PH: "#C0C0C0",
  },
  speeches_ep: {
    ALDE: "#FDBB30",
    ECR: "#0087BD",
    EFDD: "#5E4A9D",
    ENF: "#DB0000",
    "GUE/NGL": "#DB0000",
    NA: "#808080",
    NI: "#808080",
    PPE: "#3399CC",
    "S&D": "#EC1C24",
    "Verts/ALE": "#00A859",
  },
};
