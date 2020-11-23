export interface MaxMinRange {
  maximum: number;
  minimum: number;
  range: number;
}

export function include(self: MaxMinRange, x: number): MaxMinRange {
  self.maximum = self.maximum < x ? x : self.maximum;
  self.minimum = self.minimum > x ? x : self.minimum;
  self.range = self.maximum - self.minimum;
  return self;
}

export function init(): MaxMinRange {
  return {
    maximum: Number.MIN_VALUE,
    minimum: Number.MAX_VALUE,
    range: Number.MIN_VALUE - Number.MAX_VALUE,
  };
}
