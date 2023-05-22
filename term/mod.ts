import { ansi_codes } from "../deps.ts";

const textEncoder = new TextEncoder();

export const clearScreen = () => {
  writeSync(ansi_codes.CLEAR_SCREEN);
};

export const hideCursor = () => {
  writeSync(ansi_codes.HIDE_CURSOR);
};

export const showCursor = () => {
  writeSync(ansi_codes.SHOW_CURSOR);
};

export const moveCursor = (row: number, column: number): void => {
  writeSync(ansi_codes.moveCursor(row, column));
};

const writeSync = (s: string) => {
  Deno.writeSync(Deno.stdout.rid, textEncoder.encode(s));
};
