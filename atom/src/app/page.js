'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import useSimulationController from './components/SimulationController';
import StatisticsPanel from './components/StatisticsPanel';

// Dynamically import 3D component to avoid SSR issues
const Simulation3D = dynamic(() => import('./components/Simulation3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
      <div className="text-white text-lg">Loading 3D Renderer...</div>
    </div>
  ),
});

export default function Home() {
  const [particles, setParticles] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const handleSimulationUpdate = useCallback((newParticles) => {
    setParticles(newParticles);
  }, []);

  const handleStatisticsUpdate = useCallback((newStatistics) => {
    setStatistics(newStatistics);
  }, []);

  const controller = useSimulationController({
    onSimulationUpdate: handleSimulationUpdate,
    onStatisticsUpdate: handleStatisticsUpdate,
  });

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-cyan-950/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Sleek top bar */}
        <div className="border-b border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/50">
                <span className="text-xl">⚛</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Atomic Scattering Simulator
                </h1>
                <p className="text-xs text-gray-500">Computational Physics Engine</p>
              </div>
            </div>
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium hover:shadow-lg hover:shadow-violet-500/20"
            >
              {isPanelOpen ? '← Hide Controls' : 'Show Controls →'}
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex relative overflow-hidden">
          {/* Full-screen 3D Visualization */}
          <div className="flex-1 relative">
            <Simulation3D
              particles={particles}
              showTrails={controller.showTrails}
              showPoints={controller.showPoints}
              cameraPosition={[0, 0, 15]}
            />
            
            {/* Floating statistics overlay */}
            {statistics && (
              <div className="absolute top-6 left-6 max-w-sm">
                <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide">Live Statistics</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Total Particles</span>
                      <span className="text-sm font-mono font-bold text-violet-400">{statistics.totalParticles}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Active</span>
                      <span className="text-sm font-mono font-bold text-cyan-400">{statistics.activeParticles}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Avg Scattering</span>
                      <span className="text-sm font-mono font-bold text-pink-400">{statistics.avgScatteringAngle}°</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Max Angle</span>
                      <span className="text-sm font-mono font-bold text-amber-400">{statistics.maxScatteringAngle}°</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Simulation status indicator */}
            <div className="absolute bottom-6 left-6">
              <div className="bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 px-4 py-2 flex items-center gap-2 shadow-xl">
                <div className={`w-2 h-2 rounded-full ${controller.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-xs font-medium text-gray-300">
                  {controller.isRunning ? 'Simulation Running' : 'Simulation Paused'}
                </span>
              </div>
            </div>

            {/* Controls hint */}
            <div className="absolute bottom-6 right-6">
              <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/5 px-4 py-2">
                <p className="text-xs text-gray-400">
                  🖱️ Rotate • 🔍 Zoom • 🖐️ Pan
                </p>
              </div>
            </div>
          </div>

          {/* Sliding Control Panel */}
          <div className={`absolute top-0 right-0 h-full w-96 transform transition-transform duration-300 ease-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full bg-black/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Parameters Section */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-8 w-1 bg-gradient-to-b from-violet-500 to-cyan-500 rounded-full"></div>
                    <h2 className="text-lg font-bold text-gray-200">Simulation Parameters</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Particle Count */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-300">Particle Flux</label>
                        <span className="text-base font-bold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-lg border border-violet-500/20">
                          {controller.particleCount}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={controller.particleCount}
                        onChange={(e) => controller.setParticleCount(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer slider-violet"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Individual</span>
                        <span>Patterns</span>
                      </div>
                    </div>

                    {/* Z1 Control */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-300">Projectile Charge (Z₁)</label>
                        <span className="text-base font-bold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-lg border border-violet-500/20">
                          {controller.Z1}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={controller.Z1}
                        onChange={(e) => controller.setZ1(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer slider-violet"
                      />
                    </div>

                    {/* Z2 Control */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-300">Target Charge (Z₂)</label>
                        <span className="text-base font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
                          {controller.Z2}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={controller.Z2}
                        onChange={(e) => controller.setZ2(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer slider-cyan"
                      />
                    </div>

                    {/* Energy Control */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-300">Energy</label>
                        <span className="text-xs font-mono text-pink-400 bg-pink-500/10 px-3 py-1 rounded-lg border border-pink-500/20">
                          {controller.energy.toExponential(2)} J
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-15"
                        max="-9"
                        step="0.1"
                        value={Math.log10(controller.energy)}
                        onChange={(e) => controller.setEnergy(Math.pow(10, Number(e.target.value)))}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer slider-pink"
                      />
                    </div>

                    {/* Impact Parameter */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-300">Max Impact Parameter</label>
                        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
                          {controller.maxImpactParameter.toExponential(2)} m
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-16"
                        max="-12"
                        step="0.1"
                        value={Math.log10(controller.maxImpactParameter)}
                        onChange={(e) => controller.setMaxImpactParameter(Math.pow(10, Number(e.target.value)))}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer slider-cyan"
                      />
                    </div>

                    {/* Speed */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-300">Simulation Speed</label>
                        <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                          {controller.simulationSpeed.toFixed(1)}×
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={controller.simulationSpeed}
                        onChange={(e) => controller.setSimulationSpeed(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer slider-amber"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                {/* Visualization Options */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                    <h2 className="text-lg font-bold text-gray-200">Visualization</h2>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={controller.showTrails}
                          onChange={(e) => controller.setShowTrails(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-11 h-6 rounded-full transition-colors ${controller.showTrails ? 'bg-violet-500' : 'bg-white/10'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${controller.showTrails ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`}></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Show Trajectories</span>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={controller.showPoints}
                          onChange={(e) => controller.setShowPoints(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-11 h-6 rounded-full transition-colors ${controller.showPoints ? 'bg-cyan-500' : 'bg-white/10'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${controller.showPoints ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`}></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Show Particle Points</span>
                    </label>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                {/* Control Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={controller.handleStart}
                    disabled={controller.isRunning}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/50 disabled:hover:shadow-none flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">▶</span>
                    Run Simulation
                  </button>
                  
                  <button
                    onClick={controller.handleStop}
                    disabled={!controller.isRunning}
                    className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/50 disabled:hover:shadow-none flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">⏹</span>
                    Stop
                  </button>
                  
                  <button
                    onClick={controller.handleReset}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">↻</span>
                    Reset
                  </button>
                </div>

                {/* Physics Info */}
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <span className="text-violet-400 font-semibold">Model:</span> Classical Coulomb scattering using F = kZ₁Z₂e²/r²
                  </p>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    <span className="text-cyan-400 font-semibold">Method:</span> Euler integration with adaptive timesteps
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .slider-violet::-webkit-slider-thumb {
          background: linear-gradient(135deg, #8b5cf6, #a78bfa);
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.6);
        }
        
        .slider-cyan::-webkit-slider-thumb {
          background: linear-gradient(135deg, #06b6d4, #22d3ee);
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.6);
        }
        
        .slider-pink::-webkit-slider-thumb {
          background: linear-gradient(135deg, #ec4899, #f472b6);
          box-shadow: 0 0 12px rgba(236, 72, 153, 0.6);
        }
        
        .slider-amber::-webkit-slider-thumb {
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.6);
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </main>
  );
}