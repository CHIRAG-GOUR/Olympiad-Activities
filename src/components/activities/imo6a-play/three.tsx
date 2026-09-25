"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/**
 * Three.js plumbing for the 3D mini-games.
 *
 * Everything here works offline: labels are painted onto canvas textures rather than
 * fetched as web fonts, and a device without WebGL gets a clear message instead of a
 * blank box.
 */

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

class SceneBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn("[Stage3D] scene failed", err);
  }
  render() {
    return this.state.failed ? <NoWebGL /> : this.props.children;
  }
}

function NoWebGL() {
  return (
    <div className="absolute inset-0 grid place-items-center text-center p-6 text-sm font-semibold text-slate-500">
      This 3D world needs WebGL, which this browser has switched off. Try another browser or enable hardware acceleration.
    </div>
  );
}

export interface Stage3DProps {
  children: React.ReactNode;
  height?: number;
  camera?: { position: [number, number, number]; fov?: number };
  /** Let the student orbit the camera by dragging empty space. */
  orbit?: boolean;
  orbitTarget?: [number, number, number];
  minPolar?: number;
  maxPolar?: number;
  readOnly?: boolean;
  background?: string;
  className?: string;
  /** Overlay rendered on top of the canvas (hints, HUD). */
  overlay?: React.ReactNode;
}

export function Stage3D({
  children,
  height = 340,
  camera = { position: [0, 5, 8], fov: 40 },
  orbit = true,
  orbitTarget = [0, 0, 0],
  minPolar = 0.15,
  maxPolar = Math.PI / 2.05,
  readOnly,
  background = "#f5f3ff",
  className = "",
  overlay,
}: Stage3DProps) {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => setOk(webglAvailable()), []);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border-2 border-indigo-100 ${className}`}
      style={{ height, background, touchAction: "none" }}
    >
      {ok === false && <NoWebGL />}
      {ok && (
        <SceneBoundary>
          <Canvas
            flat
            shadows
            dpr={readOnly ? 1 : [1, 2]}
            frameloop={readOnly ? "demand" : "always"}
            camera={{ position: camera.position, fov: camera.fov ?? 40 }}
            gl={{ antialias: true, preserveDrawingBuffer: true }}
          >
            <color attach="background" args={[background]} />
            <hemisphereLight args={["#ffffff", "#ddd6fe", 1.5]} />
            <ambientLight intensity={0.35} />
            <directionalLight
              position={[5, 9, 6]}
              intensity={1.4}
              castShadow
              shadow-bias={-0.0008}
              shadow-normalBias={0.02}
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-left={-8}
              shadow-camera-right={8}
              shadow-camera-top={8}
              shadow-camera-bottom={-8}
            />
            <directionalLight position={[-6, 4, -4]} intensity={0.35} />
            {children}
            {orbit && (
              <OrbitControls
                makeDefault
                enablePan={false}
                enableZoom={false}
                enabled={!readOnly}
                target={orbitTarget}
                minPolarAngle={minPolar}
                maxPolarAngle={maxPolar}
              />
            )}
          </Canvas>
        </SceneBoundary>
      )}
      {overlay && <div className="pointer-events-none absolute inset-x-0 top-0 p-2">{overlay}</div>}
    </div>
  );
}

/* ── labels ──────────────────────────────────────────────── */

export interface LabelStyle {
  fg?: string;
  bg?: string | null;
  border?: string | null;
  /** Font size relative to texture height (0..1). */
  scale?: number;
  weight?: number;
  width?: number;
  height?: number;
  mirror?: boolean;
  radius?: number;
}

/** A canvas texture with text painted on it. Disposed when it is no longer used. */
export function useTextTexture(text: string, style: LabelStyle = {}) {
  const {
    fg = "#1e1b4b",
    bg = "#ffffff",
    border = null,
    scale = 0.55,
    weight = 800,
    width = 256,
    height = 256,
    mirror = false,
    radius = 0.12,
  } = style;

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, width, height);
    const r = Math.min(width, height) * radius;
    if (bg) {
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.roundRect(4, 4, width - 8, height - 8, r);
      ctx.fill();
    }
    if (border) {
      ctx.strokeStyle = border;
      ctx.lineWidth = Math.max(6, height * 0.04);
      ctx.beginPath();
      ctx.roundRect(8, 8, width - 16, height - 16, r);
      ctx.stroke();
    }
    ctx.fillStyle = fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let size = height * scale;
    ctx.font = `${weight} ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    while (ctx.measureText(text).width > width * 0.88 && size > 8) {
      size -= 2;
      ctx.font = `${weight} ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    }
    if (mirror) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.fillText(text, width / 2, height / 2 + size * 0.04);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [text, fg, bg, border, scale, weight, width, height, mirror, radius]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/** A flat text plate. Faces +z unless rotated; `billboard` keeps it facing the camera. */
export function Label3D({
  text,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [1, 1],
  style,
  billboard = false,
  onClick,
}: {
  text: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  style?: LabelStyle;
  billboard?: boolean;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const aspect = size[0] / size[1];
  const tex = useTextTexture(text, {
    width: Math.round(256 * Math.max(1, aspect)),
    height: Math.round(256 / Math.min(1, aspect)),
    ...style,
  });
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ camera }) => {
    if (billboard && ref.current) ref.current.quaternion.copy(camera.quaternion);
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} onClick={onClick}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ── dragging on a plane ─────────────────────────────────── */

/**
 * Pointer handlers that drag something across a fixed plane in world space. The orbit
 * camera is paused while a drag is in progress so the two gestures never fight.
 */
export function usePlaneDrag({
  plane,
  onDrag,
  onStart,
  onEnd,
  disabled,
}: {
  plane: THREE.Plane;
  onDrag: (p: THREE.Vector3) => void;
  onStart?: (p: THREE.Vector3) => void;
  onEnd?: (p: THREE.Vector3 | null) => void;
  disabled?: boolean;
}) {
  const controls = useThree((s) => s.controls) as unknown as { enabled: boolean } | null;
  const active = useRef(false);
  const last = useRef<THREE.Vector3 | null>(null);
  const hit = useMemo(() => new THREE.Vector3(), []);

  const project = (e: ThreeEvent<PointerEvent>) => {
    const p = e.ray.intersectPlane(plane, hit);
    return p ? p.clone() : null;
  };

  return {
    onPointerDown: (e: ThreeEvent<PointerEvent>) => {
      if (disabled) return;
      e.stopPropagation();
      (e.target as unknown as Element)?.setPointerCapture?.(e.pointerId);
      active.current = true;
      if (controls) controls.enabled = false;
      const p = project(e);
      last.current = p;
      if (p) onStart?.(p);
    },
    onPointerMove: (e: ThreeEvent<PointerEvent>) => {
      if (!active.current) return;
      e.stopPropagation();
      const p = project(e);
      if (p) {
        last.current = p;
        onDrag(p);
      }
    },
    onPointerUp: (e: ThreeEvent<PointerEvent>) => {
      if (!active.current) return;
      e.stopPropagation();
      (e.target as unknown as Element)?.releasePointerCapture?.(e.pointerId);
      active.current = false;
      if (controls) controls.enabled = true;
      onEnd?.(last.current);
    },
  };
}

/** Smoothly approach a target value each frame (critically damped feel). */
export const approach = (current: number, target: number, rate: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-rate * dt));

/** Ground plate with a soft shadow catcher. */
export function Floor({ size = 40, color = "#e4defc", y = 0 }: { size?: number; color?: string; y?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
      <circleGeometry args={[size / 2, 64]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}

export const cursor = (on: boolean, kind: "pointer" | "grab" = "pointer") => {
  if (typeof document !== "undefined") document.body.style.cursor = on ? kind : "auto";
};
