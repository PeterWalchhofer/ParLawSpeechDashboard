import { Index } from "./types";

export const BLUE = "#373F51";
export const BLACK = "#1B1B1E";
export const GRAY = "#D8DBE2";

export function sd (array: number[]) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
  }

export  function randomIntFromInterval(min:number, max:number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
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

export function parseKeywords(keywords: string[]){
  return Object.fromEntries(
    keywords.map((k, i) => [`q${i}`, k])
  );
}

export type PartyItem = {
  party: string;
  n: number;
}

function rgbToHsl(r:number, g:number, b:number){
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = (max + min) / 2;
  let s = h
  let l = h

  if(max == min){
      h = s = 0; // achromatic
  }else{
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  return [h, s, l];
}

export function hexToHsl(color:string = "#ffffff"){
  var r = parseInt(color.substring(1,2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
  var g = parseInt(color.substring(3,2), 16);
  var b = parseInt(color.substring(5,2), 16);

  return rgbToHsl(r, g, b);
}

export const INDEX_LABELS = {
  speeches_austria: {
    country: "Austria",
    countryFrom: "Austrian"  
  },
  speeches_germany: {
    country: "Germany",
    countryFrom: "German"  
  }
}

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
};