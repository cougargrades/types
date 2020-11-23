export interface StandardDeviation {
  n: number;
  delta: number;
  mean: number;
  M2: number;
  ddof: number;
}

export function include(self: StandardDeviation, x: number): StandardDeviation {
  self.n += 1;
  self.delta = x - self.mean;
  self.mean += self.delta / self.n;
  self.M2 += self.delta * (x - self.mean);
  return self;
}

export function value(self: StandardDeviation): number {
  return Math.sqrt(self.M2 / (self.n - self.ddof));
}

export function init(): StandardDeviation {
  return {
    n: 0,
    delta: 0,
    mean: 0,
    M2: 0,
    ddof: 0,
  };
}
