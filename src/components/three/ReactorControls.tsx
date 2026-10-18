import { useState } from 'react';
import { Camera, Gauge, Layers, Eye, ChevronDown, ChevronUp } from 'lucide-react';

export interface ReactorSettings {
  preset: 'macro' | 'exploded' | 'flow' | 'zen';
  speed: number;
  state: 'normal' | 'surge' | 'staking';
  wireframe: boolean;
  particlesCount: number;
}

interface ReactorControlsProps {
  settings: ReactorSettings;
  onChange: (settings: ReactorSettings) => void;
}

export default function ReactorControls({ settings, onChange }: ReactorControlsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const setPreset = (preset: ReactorSettings['preset']) => {
    onChange({ ...settings, preset });
  };

  const setSpeed = (speed: number) => {
    onChange({ ...settings, speed });
  };

  const setState = (state: ReactorSettings['state']) => {
    onChange({ ...settings, state });
  };

  const toggleWireframe = () => {
    onChange({ ...settings, wireframe: !settings.wireframe });
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center w-[94%] max-w-[820px] pointer-events-auto">
      {/* Drawer Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-2 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 text-slate-700 text-xs font-medium border border-slate-200/90 shadow-sm hover:bg-white hover:text-slate-900 transition-all cursor-pointer"
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Show Dock</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Hide Controls</span>
          </>
        )}
      </button>

      {/* Dock Container */}
      {!isCollapsed && (
        <div className="w-full bg-white/90 border border-slate-200/80 rounded-2xl md:rounded-3xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-slate-800">
          {/* Camera Presets */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
              <Camera className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Camera</span>
            </div>
            {(['macro', 'exploded', 'flow', 'zen'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  settings.preset === p
                    ? 'bg-[rgba(30,50,90,0.9)] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Engine State Mode */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">State</span>
            </div>
            {(['normal', 'surge', 'staking'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setState(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  settings.state === s
                    ? 'bg-[rgba(30,50,90,0.9)] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Right Group: Speed & Wireframe */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
              <Gauge className="w-3.5 h-3.5 ml-1.5 text-slate-500" />
              {([0.5, 1.0, 2.0] as const).map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSpeed(sp)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    settings.speed === sp
                      ? 'bg-white text-[rgba(30,50,90,0.95)] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {sp}x
                </button>
              ))}
            </div>

            <button
              onClick={toggleWireframe}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                settings.wireframe
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wireframe</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
