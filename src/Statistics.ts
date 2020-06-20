import { start } from 'repl';

export interface IncrementallyComputable {
  include(x: number): void;
  value?(): number | object;
}

export class GPA implements IncrementallyComputable {
  average: number = 0;
  standardDeviation: number = 0;
  maximum: number = 0;
  minimum: number = 0;
  range: number = 0;
  median: number = 0;
  private _average: Average = new Average();
  private _standardDeviation: StandardDeviation = new StandardDeviation();
  private _mmr: MaxMinRange = new MaxMinRange();
  include(x: number) {
    this._average.include(x);
    this._standardDeviation.include(x);
    this._mmr.include(x);
    this.average = this._average.value();
    this.standardDeviation = this._standardDeviation.value();
    this.maximum = this._mmr.maximum;
    this.minimum = this._mmr.minimum;
    this.range = this._mmr.range;
  }
}

export class Average implements IncrementallyComputable {
  n: number = 0;
  sum: number = 0;

  include(x: number): void {
    this.n += 1;
    this.sum += x;
  }
  value(): number {
    return this.sum / this.n;
  }
}

export class StandardDeviation implements IncrementallyComputable {
  n: number = 0;
  delta: number = 0;
  mean: number = 0;
  M2: number = 0;
  ddof: number = 0;

  include(x: number): void {
    this.n += 1;
    this.delta = x - this.mean;
    this.mean += this.delta / this.n;
    this.M2 += this.delta * (x - this.mean);
  }
  value(): number {
    return Math.sqrt(this.M2 / (this.n - this.ddof));
  }
}

export class MaxMinRange implements IncrementallyComputable {
  maximum: number = Number.MIN_VALUE;
  minimum: number = Number.MAX_VALUE;
  range: number = this.maximum - this.minimum;

  include(x: number): void {
    this.maximum = this.maximum < x ? x : this.maximum;
    this.minimum = this.minimum > x ? x : this.minimum;
    this.range = this.maximum - this.minimum;
  }
}
