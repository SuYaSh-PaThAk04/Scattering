import sqrt from "@stdlib/math/base/special/sqrt";
import pow from "@stdlib/math/base/special/pow";

import { ELEMENTARY_CHARGE as e, COULOMB_CONSTANT as k } from "./constants";

/**
 * Compute Coulomb acceleration on projectile
 */
export function acceleration({ x, y, Z1, Z2, mass }) {
  // Validate inputs
  if (
    !isFinite(x) ||
    !isFinite(y) ||
    !isFinite(Z1) ||
    !isFinite(Z2) ||
    !isFinite(mass) ||
    isNaN(x) ||
    isNaN(y) ||
    mass <= 0
  ) {
    return { ax: 0, ay: 0 };
  }

  const r2 = x * x + y * y;

  // Prevent division by zero
  if (r2 < 1e-30) {
    return { ax: 0, ay: 0 };
  }

  const r = sqrt(r2);

  // Check for valid r
  if (!isFinite(r) || r <= 0) {
    return { ax: 0, ay: 0 };
  }

  const forceMag = (k * Z1 * Z2 * e * e) / r2;

  // Validate force magnitude
  if (!isFinite(forceMag) || isNaN(forceMag)) {
    return { ax: 0, ay: 0 };
  }

  const ax = (forceMag * x) / (r * mass);
  const ay = (forceMag * y) / (r * mass);

  // Final validation
  if (!isFinite(ax) || !isFinite(ay) || isNaN(ax) || isNaN(ay)) {
    return { ax: 0, ay: 0 };
  }

  return { ax, ay };
}
