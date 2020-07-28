
export interface IncrementallyComputable {
  include(x: number): void;
  value?(): number | object;
}

export interface Cloneable<T> {
  cloneFrom(value: T): T;
}

export class GPA implements IncrementallyComputable, Cloneable<GPA> {
  constructor(
    public average: number = 0,
    public standardDeviation: number = 0,
    public maximum: number = 0,
    public minimum: number = 0,
    public range: number = 0,
    public median: number = 0,
    public _average: Average = new Average(),
    public _standardDeviation: StandardDeviation = new StandardDeviation(),
    public _mmr: MaxMinRange = new MaxMinRange(),
  ) {}
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

  cloneFrom(source: GPA): GPA {
    return new GPA(
      source.average,
      source.standardDeviation,
      source.maximum,
      source.minimum,
      source.range,
      source.median,
      Average.prototype.cloneFrom(source._average),
      StandardDeviation.prototype.cloneFrom(source._standardDeviation),
      MaxMinRange.prototype.cloneFrom(source._mmr)
    );
  }
}

export class Average implements IncrementallyComputable, Cloneable<Average> {
  constructor(
    public n: number = 0,
    public sum: number = 0
  ) {}

  include(x: number): void {
    this.n += 1;
    this.sum += x;
  }
  value(): number {
    return this.sum / this.n;
  }
  cloneFrom(source: Average): Average {
    return new Average(
      source.n,
      source.sum
    );
  }
}

export class StandardDeviation implements IncrementallyComputable, Cloneable<StandardDeviation> {
  constructor(
    public n: number = 0,
    public delta: number = 0,
    public mean: number = 0,
    public M2: number = 0,
    public ddof: number = 0
  ) {}

  include(x: number): void {
    this.n += 1;
    this.delta = x - this.mean;
    this.mean += this.delta / this.n;
    this.M2 += this.delta * (x - this.mean);
  }
  value(): number {
    return Math.sqrt(this.M2 / (this.n - this.ddof));
  }
  cloneFrom(source: StandardDeviation): StandardDeviation {
    return new StandardDeviation(
      source.n,
      source.delta,
      source.mean,
      source.M2,
      source.ddof
    );
  }
}

export class MaxMinRange implements IncrementallyComputable, Cloneable<MaxMinRange> {
  constructor(
    public maximum: number = Number.MIN_VALUE,
    public minimum: number = Number.MAX_VALUE,
    public range: number = Number.MIN_VALUE - Number.MAX_VALUE
  ) {}
  include(x: number): void {
    this.maximum = this.maximum < x ? x : this.maximum;
    this.minimum = this.minimum > x ? x : this.minimum;
    this.range = this.maximum - this.minimum;
  }
  cloneFrom(source: MaxMinRange): MaxMinRange {
    return new MaxMinRange(
      source.maximum,
      source.minimum,
      source.range
    );
  }
}
