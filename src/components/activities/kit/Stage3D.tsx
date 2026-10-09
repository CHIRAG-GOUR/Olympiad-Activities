"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Layers, MonitorOff } from "lucide-react";

/**
 * Shared 3D stage for the Olympiad's simulations.
 *
 * Every paper's `World3D` delegates here, so a fix to lighting, sharpness or failure
 * handling reaches all of them at once.
 *
 * Three things this does that a bare `<Canvas>` does not:
 *
 *   • WebGL is checked before mounting, and any error inside the scene is caught. A
 *     device with WebGL switched off gets a readable message; previously the exception
 *     escaped and took the whole exam page down with it, so the candidate could not even
 *     navigate to the next question.
 *   • `dpr={[1, 2]}` renders at the display's own pixel density. Without it the canvas is
 *     drawn at 1× and scaled up, which is why the simulations looked soft on phones and
 *     Retina screens while the SVG activities beside them stayed crisp.
 *   • `shadows` is set on the canvas. Several packs asked lights to `castShadow` without
 *     it, so the shadows were computed and then never drawn.
 */

function webglAvailable(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      (canvas.getContext("webgl2") as unknown) || (canvas.getContext("webgl") as unknown)
    );
  } catch {
    return false;
  }
}

function Unavailable({ reason }: { reason: "webgl" | "error" }) {
  return (
    <div className="absolute inset-0 grid place-items-center p-5 text-center">
      <div className="max-w-[300px]">
        <MonitorOff className="mx-auto mb-2 h-6 w-6 text-indigo-400" strokeWidth={2} />
        <p className="text-[12.5px] font-semibold leading-snug text-indigo-900">
          {reason === "webgl"
            ? "This simulation needs 3D graphics, which this browser has switched off."
            : "This simulation could not start."}
        </p>
        <p className="mt-1 text-[11.5px] leading-snug text-indigo-500">
          Try another browser, or turn on hardware acceleration. The rest of the question
          still works.
        </p>
      </div>
    </div>
  );
}

/** Keeps a scene-level exception inside the canvas instead of unmounting the question. */
class SceneBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[Stage3D] scene failed", error);
  }

  render() {
    return this.state.failed ? <Unavailable reason="error" /> : this.props.children;
  }
}

export interface Stage3DProps {
  children: React.ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
  /** Any CSS length. Left responsive by the caller's wrapper when omitted. */
  height?: string;
  controls?: boolean;
  autoRotate?: boolean;
  background?: string;
  /** The small corner label; pass null to hide it. */
  badge?: string | null;
  className?: string;
  /** Read-only review renders at 1× — nothing moves, so the sharper pass is wasted. */
  readOnly?: boolean;
  /**
   * "studio": scenes that bring their own image-based lighting get a softer base rig, so
   * metals and glass are lit by reflections rather than flat fill light.
   */
  lighting?: "default" | "studio";
  /** Orbit target and limits, for scenes not centred on the origin. */
  orbit?: { target?: [number, number, number]; minDistance?: number; maxDistance?: number; maxPolarAngle?: number };
}

export function Stage3D({
  children,
  camera = { position: [0, 5, 8], fov: 45 },
  height,
  controls = true,
  autoRotate = false,
  background,
  badge = "3D Studio",
  className = "",
  readOnly = false,
  lighting = "default",
  orbit,
}: Stage3DProps) {
  const studio = lighting === "studio";
  const [ok, setOk] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // WebGL can only be probed in the browser, so the first client pass decides.
  useEffect(() => setOk(webglAvailable()), []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  return (
    <div
      style={height ? { height } : undefined}
      className={`relative w-full overflow-hidden rounded-2xl border-2 border-indigo-100 bg-gradient-to-b from-indigo-50/50 via-white to-violet-50/50 shadow-inner ${
        height ? "" : "h-[clamp(240px,42vw,380px)]"
      } ${className}`}
    >
      {ok === false && <Unavailable reason="webgl" />}

      {ok && (
        <SceneBoundary>
          <Canvas
            camera={{ position: camera.position, fov: camera.fov ?? 45 }}
            style={{ background: background ?? "transparent" }}
            shadows
            // Match the display's pixel density, capped at 2 so a 3× phone does not
            // render nine times the pixels for no visible gain.
            dpr={readOnly ? 1 : [1, 2]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
          >
            {background && <color attach="background" args={[background]} />}

            <ambientLight intensity={studio ? 0.18 : 0.75} />
            <hemisphereLight intensity={studio ? 0.3 : 0.55} groundColor="#e0e7ff" />
            <directionalLight
              position={[10, 15, 10]}
              intensity={studio ? 1.1 : 1.2}
              castShadow
              shadow-mapSize-width={studio ? 2048 : 1024}
              shadow-mapSize-height={studio ? 2048 : 1024}
              shadow-bias={-0.0004}
            />
            {/* Cool rim light, so edges read against the pale background. */}
            <directionalLight position={[-10, 8, -5]} intensity={studio ? 0.25 : 0.4} color="#818cf8" />

            <Suspense fallback={null}>{children}</Suspense>

            {controls && (
              <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.05}
                enablePan={false}
                autoRotate={autoRotate && !reducedMotion}
                autoRotateSpeed={1}
                maxPolarAngle={orbit?.maxPolarAngle ?? Math.PI / 2 + 0.1}
                target={orbit?.target}
                minDistance={orbit?.minDistance}
                maxDistance={orbit?.maxDistance}
              />
            )}
          </Canvas>
        </SceneBoundary>
      )}

      {badge && ok !== false && (
        <div className="pointer-events-none absolute right-2.5 top-2.5 flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-indigo-900 shadow-sm backdrop-blur-md">
          <Layers className="h-3.5 w-3.5 text-indigo-600" />
          <span>{badge}</span>
        </div>
      )}
    </div>
  );
}
