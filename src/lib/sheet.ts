// A4 = 210x297mm. Sticker = 49x65mm. Grid = 4 colunas x 4 linhas = 16/folha.
export const STICKER_W_MM = 49;
export const STICKER_H_MM = 65;
export const A4_W_MM = 210;
export const A4_H_MM = 297;
export const COLS = 4;
export const ROWS = 4;
export const PER_SHEET = COLS * ROWS;

export function chunkPages<T>(items: T[]): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += PER_SHEET) {
    pages.push(items.slice(i, i + PER_SHEET));
  }
  return pages;
}
