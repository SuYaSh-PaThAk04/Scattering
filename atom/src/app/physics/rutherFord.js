import atan from '@stdlib/math/base/special/atan';
import { ELEMENTARY_CHARGE, COULOMB_CONSTANT } from './constrants.js';

const elementaryCharge = ELEMENTARY_CHARGE;
const coulaombConstant = COULOMB_CONSTANT;
export function scatteringAngle({ Z1, Z2, energy, impact }) {
  return 2 * atan(
    (coulaombConstant * Z1 * Z2 * elementaryCharge ** 2) /
    (2 * energy * impact)
  );
}
