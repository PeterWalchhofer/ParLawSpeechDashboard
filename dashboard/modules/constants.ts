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