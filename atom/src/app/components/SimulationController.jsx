"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { runSimulation } from "../physics/simulation.js";

/**
 * Simulation Controller Hook
 * Manages the physics simulation and provides controls
 */
export default function useSimulationController({
  onSimulationUpdate,
  onStatisticsUpdate,
}) {
  const [particleCount, setParticleCount] = useState(50);
  const [Z1, setZ1] = useState(2);
  const [Z2, setZ2] = useState(79);
  const [energy, setEnergy] = useState(1e-12);
  const [maxImpactParameter, setMaxImpactParameter] = useState(1e-14);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [showTrails, setShowTrails] = useState(true);
  const [showPoints, setShowPoints] = useState(true);

  const simulationRef = useRef(null);
  const animationFrameRef = useRef(null);

  const runPhysicsSimulation = useCallback(() => {
    const result = runSimulation({
      particleCount,
      Z1,
      Z2,
      energy,
      maxImpactParameter,
      mass: 6.644e-27, // Alpha particle mass (kg)
      dt: 1e-22 * simulationSpeed,
      maxSteps: 10000,
    });

    if (onSimulationUpdate) {
      onSimulationUpdate(result.particles);
    }

    if (onStatisticsUpdate) {
      onStatisticsUpdate(result.statistics);
    }

    simulationRef.current = result;
  }, [
    particleCount,
    Z1,
    Z2,
    energy,
    maxImpactParameter,
    simulationSpeed,
    onSimulationUpdate,
    onStatisticsUpdate,
  ]);

  const handleStart = () => {
    setIsRunning(true);
    runPhysicsSimulation();
  };

  const handleStop = () => {
    setIsRunning(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleReset = () => {
    handleStop();
    if (onSimulationUpdate) {
      onSimulationUpdate([]);
    }
    if (onStatisticsUpdate) {
      onStatisticsUpdate(null);
    }
  };

  return {
    // State
    particleCount,
    Z1,
    Z2,
    energy,
    maxImpactParameter,
    isRunning,
    simulationSpeed,
    showTrails,
    showPoints,

    // Setters
    setParticleCount,
    setZ1,
    setZ2,
    setEnergy,
    setMaxImpactParameter,
    setSimulationSpeed,
    setShowTrails,
    setShowPoints,

    // Actions
    handleStart,
    handleStop,
    handleReset,
    runPhysicsSimulation,

    // Current simulation result
    simulationResult: simulationRef.current,
  };
}
