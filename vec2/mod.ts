export interface T {
  x: number;
  y: number;
}

export const make = (x: number, y: number): T => {
  return { x: x, y: y };
};

export const add = (a: T, b: T): T => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
};

export const sub = (a: T, b: T): T => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
};

export const scale = (alpha: number, a: T): T => {
  return {
    x: alpha * a.x,
    y: alpha * a.y,
  };
};

export const length = (a: T): number => {
  return Math.sqrt(a.x * a.x + a.y * a.y);
};

export const equal = (a: T, b: T): boolean => {
  return a.x === b.x && a.y === b.y;
};
