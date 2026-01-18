import { simulateParticle } from "./stimulate.js";
import { sampleImpactParameter } from "./montecards.js";
import { ELEMENTARY_CHARGE, COULOMB_CONSTANT } from "./constants.js";

/**
 * Generate initial conditions for a particle
 */
export function generateInitialConditions({
  Z1,
  Z2,
  energy,
  maxImpactParameter,
  mass = 6.644e-27, // Alpha particle mass (kg)
  randomSeed = null,
}) {
  // Sample impact parameter
  const b = sampleImpactParameter(maxImpactParameter);

  // Calculate initial velocity from energy: E = 0.5 * m * v^2
  const v0 = Math.sqrt((2 * energy) / mass);

  // Initial position: far to the left, offset by impact parameter
  const x0 = -50e-15; // Start far from target (50 fm)
  const y0 = b;

  // Initial velocity: moving right (positive x direction)
  const vx0 = v0;
  const vy0 = 0;

  return {
    x0,
    y0,
    vx0,
    vy0,
    b, // impact parameter
  };
}

/**
 * Calculate scattering angle from trajectory
 */
export function calculateScatteringAngle(trajectory) {
  if (trajectory.length < 2) return 0;

  const start = trajectory[0];
  const end = trajectory[trajectory.length - 1];

  // Initial direction (rightward)
  const initialDir = { x: 1, y: 0 };

  // Final direction
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 1e-20) return 0;

  const finalDir = { x: dx / dist, y: dy / dist };

  // Calculate angle using dot product
  const dot = initialDir.x * finalDir.x + initialDir.y * finalDir.y;
  const angle = Math.acos(Math.max(-1, Math.min(1, dot)));

  return angle;
}

/**
 * Run a complete simulation with N particles
 */
export function runSimulation({
  particleCount,
  Z1,
  Z2,
  energy,
  maxImpactParameter,
  mass,
  dt = 1e-22, // Time step (seconds)
  maxSteps = 10000,
  minDistance = 1e-15, // Stop if too close to avoid singularity
}) {
  const particles = [];
  const angles = [];

  for (let i = 0; i < particleCount; i++) {
    const initial = generateInitialConditions({
      Z1,
      Z2,
      energy,
      maxImpactParameter,
      mass,
    });

    // Simulate trajectory
    const trajectory = simulateParticle({
      Z1,
      Z2,
      mass,
      x0: initial.x0,
      y0: initial.y0,
      vx0: initial.vx0,
      vy0: initial.vy0,
      dt,
      steps: maxSteps,
    });

    // Calculate scattering angle
    const angle = calculateScatteringAngle(trajectory);

    particles.push({
      id: i,
      trajectory,
      initialConditions: initial,
      scatteringAngle: angle,
      finalPosition: trajectory[trajectory.length - 1],
    });

    angles.push(angle);
  }

  // Calculate statistics
  const meanAngle = angles.reduce((a, b) => a + b, 0) / angles.length;
  const variance =
    angles.reduce((sum, angle) => {
      return sum + Math.pow(angle - meanAngle, 2);
    }, 0) / angles.length;
  const stdDev = Math.sqrt(variance);

  return {
    particles,
    statistics: {
      meanAngle,
      stdDev,
      minAngle: Math.min(...angles),
      maxAngle: Math.max(...angles),
      particleCount: particles.length,
    },
  };
}
