"use client";

export default function StatisticsPanel({ statistics }) {
  if (!statistics) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold mb-4 text-blue-300">Statistics</h3>
        <p className="text-gray-400 text-sm">
          Run simulation to see statistics
        </p>
      </div>
    );
  }

  const meanAngleDeg = (statistics.meanAngle * 180) / Math.PI;
  const stdDevDeg = (statistics.stdDev * 180) / Math.PI;
  const minAngleDeg = (statistics.minAngle * 180) / Math.PI;
  const maxAngleDeg = (statistics.maxAngle * 180) / Math.PI;

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-bold mb-4 text-blue-300 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        Simulation Statistics
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-400/20">
            <div className="text-xs text-gray-400 mb-1">Particles</div>
            <div className="text-2xl font-bold text-purple-300">
              {statistics.particleCount}
            </div>
          </div>

          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-400/20">
            <div className="text-xs text-gray-400 mb-1">Mean Angle</div>
            <div className="text-2xl font-bold text-blue-300">
              {meanAngleDeg.toFixed(2)}°
            </div>
            <div className="text-xs text-gray-400 font-mono mt-1">
              {statistics.meanAngle.toFixed(6)} rad
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-white/10">
          <div className="text-xs text-gray-400 mb-3">Angular Distribution</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Min:</span>
              <span className="text-cyan-300 font-mono">
                {minAngleDeg.toFixed(2)}°
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Max:</span>
              <span className="text-cyan-300 font-mono">
                {maxAngleDeg.toFixed(2)}°
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Std Dev:</span>
              <span className="text-cyan-300 font-mono">
                {stdDevDeg.toFixed(2)}°
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
