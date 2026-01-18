import randu from '@stdlib/random/base/randu';

export function sampleImpactParameter(maxB) {
  return randu() * maxB;
}
