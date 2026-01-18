import { acceleration } from "./dynamics";

/**
 * Simulate one particle trajectory
 */
export function simulateParticle({
  Z1,
  Z2,
  mass,
  x0,
  y0,
  vx0,
  vy0,
  dt,
  steps,
}) {
  let x = x0;
  let y = y0;
  let vx = vx0;
  let vy = vy0;

  const path = [];

  for (let i = 0; i < steps; i++) {
    const { ax, ay } = acceleration({ x, y, Z1, Z2, mass });

    // Validate acceleration values
    if (!isFinite(ax) || !isFinite(ay) || isNaN(ax) || isNaN(ay)) {
      break;
    }

    vx += ax * dt;
    vy += ay * dt;

    // Validate velocity values
    if (!isFinite(vx) || !isFinite(vy) || isNaN(vx) || isNaN(vy)) {
      break;
    }

    x += vx * dt;
    y += vy * dt;

    // Validate position values
    if (!isFinite(x) || !isFinite(y) || isNaN(x) || isNaN(y)) {
      break;
    }

    path.push({ x, y });

    // Stop if particle is too far away (escaped)
    const distance = Math.sqrt(x * x + y * y);
    if (distance > 100e-15) {
      break;
    }

    // Stop if too close to avoid numerical issues
    if (distance < 1e-18) {
      break;
    }
  }

  return path;
}
