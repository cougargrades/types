export interface Average {
  n: number;
  sum: number;
}

export function include(self: Average, x: number): Average {
  self.n += 1;
  self.sum += x;
  return self;
}

export function value(self: Average): number {
  return self.sum / self.n;
}

export function init(): Average {
  return {
    n: 0,
    sum: 0,
  };
}
