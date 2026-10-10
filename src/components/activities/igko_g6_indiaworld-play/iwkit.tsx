"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Label3D } from "../imo6a-play/three";
import { Brass, Wood, Metal, Plastic, Matte } from "../igko_g6_scitech-play/models";

/**
 * Props shared by the India and the World investigations: flags drawn in the browser,
 * folders, plaques and a briefing table — real objects instead of option buttons.
 */

export const IW_BADGE = "IGKO · India and the World · Interactive Investigation";

type V3 = [number, number, number];

/* ── Flags ───────────────────────────────────────────────────── */

export type FlagId = "usa" | "russia" | "uk" | "france" | "china" | "germany" | "india" | "un";

function drawFlag(g: CanvasRenderingContext2D, id: FlagId, w: number, h: number) {
  const bands = (colors: string[], vertical = false) =>
    colors.forEach((c, i) => {
      g.fillStyle = c;
      if (vertical) g.fillRect((i * w) / colors.length, 0, w / colors.length + 1, h);
      else g.fillRect(0, (i * h) / colors.length, w, h / colors.length + 1);
    });
  const star = (cx: number, cy: number, r: number, color: string) => {
    g.fillStyle = color;
    g.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.4 : r;
      g.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a));
    }
    g.closePath();
    g.fill();
  };
  switch (id) {
    case "france":
      bands(["#0055A4", "#FFFFFF", "#EF4135"], true);
      break;
    case "germany":
      bands(["#000000", "#DD0000", "#FFCE00"]);
      break;
    case "russia":
      bands(["#FFFFFF", "#0039A6", "#D52B1E"]);
      break;
    case "india":
      bands(["#FF9933", "#FFFFFF", "#138808"]);
      g.strokeStyle = "#000080";
      g.lineWidth = h * 0.02;
      g.beginPath();
      g.arc(w / 2, h / 2, h * 0.13, 0, Math.PI * 2);
      g.stroke();
      for (let i = 0; i < 24; i++) {
        const a = (i * Math.PI) / 12;
        g.beginPath();
        g.moveTo(w / 2, h / 2);
        g.lineTo(w / 2 + h * 0.13 * Math.cos(a), h / 2 + h * 0.13 * Math.sin(a));
        g.lineWidth = h * 0.006;
        g.stroke();
      }
      break;
    case "china":
      g.fillStyle = "#DE2910";
      g.fillRect(0, 0, w, h);
      star(w * 0.17, h * 0.27, h * 0.15, "#FFDE00");
      [[0.33, 0.1], [0.4, 0.2], [0.4, 0.35], [0.33, 0.45]].forEach(([x, y]) => star(w * x, h * y, h * 0.05, "#FFDE00"));
      break;
    case "usa": {
      for (let i = 0; i < 13; i++) {
        g.fillStyle = i % 2 ? "#FFFFFF" : "#B22234";
        g.fillRect(0, (i * h) / 13, w, h / 13 + 1);
      }
      g.fillStyle = "#3C3B6E";
      g.fillRect(0, 0, w * 0.4, (h * 7) / 13);
      g.fillStyle = "#FFFFFF";
      for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) {
        g.beginPath();
        g.arc(w * 0.035 + c * w * 0.065, h * 0.05 + r * h * 0.1, h * 0.018, 0, Math.PI * 2);
        g.fill();
      }
      break;
    }
    case "uk": {
      g.fillStyle = "#012169";
      g.fillRect(0, 0, w, h);
      g.lineCap = "butt";
      const diag = (width: number, color: string) => {
        g.strokeStyle = color;
        g.lineWidth = width;
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(w, h);
        g.moveTo(w, 0);
        g.lineTo(0, h);
        g.stroke();
      };
      diag(h * 0.2, "#FFFFFF");
      diag(h * 0.07, "#C8102E");
      g.fillStyle = "#FFFFFF";
      g.fillRect(w / 2 - h * 0.17, 0, h * 0.34, h);
      g.fillRect(0, h / 2 - h * 0.17, w, h * 0.34);
      g.fillStyle = "#C8102E";
      g.fillRect(w / 2 - h * 0.1, 0, h * 0.2, h);
      g.fillRect(0, h / 2 - h * 0.1, w, h * 0.2);
      break;
    }
    case "un":
      g.fillStyle = "#5B92E5";
      g.fillRect(0, 0, w, h);
      g.strokeStyle = "#FFFFFF";
      g.lineWidth = h * 0.025;
      for (let r = 1; r <= 3; r++) {
        g.beginPath();
        g.arc(w / 2, h / 2, h * 0.09 * r, 0, Math.PI * 2);
        g.stroke();
      }
      break;
  }
}

export function useFlagTexture(id: FlagId) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 300;
    c.height = 200;
    drawFlag(c.getContext("2d")!, id, 300, 200);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [id]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

/** A cloth flag on a chrome pole, rippling gently. */
export function Flag({ id, height = 0.9, size = 0.42, position = [0, 0, 0] as V3, wave = true }: { id: FlagId; height?: number; size?: number; position?: V3; wave?: boolean }) {
  const map = useFlagTexture(id);
  const cloth = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(size, size * 0.66, 16, 4), [size]);
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array as Float32Array), [geo]);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((c) => {
    if (!wave || !cloth.current) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const t = c.clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3] + size / 2;
      pos.setZ(i, Math.sin(x * 9 - t * 3) * 0.025 * (x / size));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.014, height, 12]} />
        <Metal color="#E2E8F0" roughness={0.18} />
      </mesh>
      <mesh position={[0, height + 0.02, 0]}>
        <sphereGeometry args={[0.024, 16, 16]} />
        <Brass />
      </mesh>
      <mesh ref={cloth} geometry={geo} position={[size / 2 + 0.012, height - (size * 0.66) / 2 - 0.02, 0]} castShadow>
        <meshStandardMaterial map={map} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.03, 24]} />
        <Metal color="#94A3B8" />
      </mesh>
    </group>
  );
}

/* ── Desk props ──────────────────────────────────────────────── */

/** A walnut briefing table with a leather writing inlay. */
export function BriefingTable({ size = [3.6, 1.8] as [number, number], height = 0.78, position = [0, 0, 0] as V3, inlay = "#1F4E46" }: { size?: [number, number]; height?: number; position?: V3; inlay?: string }) {
  const [w, d] = size;
  return (
    <group position={position}>
      <RoundedBox args={[w, 0.07, d]} radius={0.03} smoothness={4} position={[0, height, 0]} castShadow receiveShadow>
        <Wood color="#6B4426" roughness={0.45} />
      </RoundedBox>
      <mesh position={[0, height + 0.036, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w - 0.25, d - 0.25]} />
        <meshPhysicalMaterial color={inlay} roughness={0.7} sheen={0.6} sheenColor="#9CC5B8" />
      </mesh>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * (w / 2 - 0.15), (height - 0.04) / 2, sz * (d / 2 - 0.15)]} castShadow>
            <cylinderGeometry args={[0.035, 0.028, height - 0.04, 16]} />
            <Wood color="#4E301A" />
          </mesh>
        ))
      )}
    </group>
  );
}

/** A manila case folder with a typed label; `mark` stamps or seals it. */
export function Folder({
  label,
  position = [0, 0, 0] as V3,
  rotationY = 0,
  color = "#E8C98A",
  mark,
  lifted = false,
  onClick,
}: {
  label: string;
  position?: V3;
  rotationY?: number;
  color?: string;
  mark?: "stamp" | "seal" | null;
  lifted?: boolean;
  onClick?: () => void;
}) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (g.current) g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, position[1] + (lifted ? 0.06 : 0), 0.15);
  });
  return (
    <group
      ref={g}
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        if (!onClick) return;
        e.stopPropagation();
        onClick();
      }}
    >
      <RoundedBox args={[0.62, 0.025, 0.44]} radius={0.008} smoothness={2} castShadow receiveShadow>
        <Matte color={color} roughness={0.75} />
      </RoundedBox>
      <mesh position={[-0.18, 0.004, -0.235]}>
        <boxGeometry args={[0.2, 0.018, 0.04]} />
        <Matte color={color} roughness={0.75} />
      </mesh>
      <Label3D text={label} position={[0, 0.014, 0.07]} rotation={[-Math.PI / 2, 0, 0]} size={[0.54, 0.12]} style={{ bg: "#FFFDF5", fg: "#1F2937", border: "#D6C7A1", scale: 0.34, weight: 700 }} />
      {mark === "stamp" && (
        <group position={[0.12, 0.016, -0.08]} rotation={[-Math.PI / 2, 0, 0.25]}>
          <Label3D text="NOT A STATED OBJECTIVE" size={[0.4, 0.09]} style={{ bg: null, fg: "#B91C1C", border: "#B91C1C", scale: 0.34, weight: 900 }} />
        </group>
      )}
      {mark === "seal" && (
        <mesh position={[0.2, 0.022, -0.1]}>
          <cylinderGeometry args={[0.05, 0.055, 0.018, 24]} />
          <meshPhysicalMaterial color="#9F1239" roughness={0.35} clearcoat={0.8} />
        </mesh>
      )}
    </group>
  );
}

/** A brass plaque on a walnut back board. */
export function Plaque({ text, position = [0, 0, 0] as V3, rotation = [0, 0, 0] as V3, width = 1.1, onClick }: { text: string; position?: V3; rotation?: V3; width?: number; onClick?: () => void }) {
  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        if (!onClick) return;
        e.stopPropagation();
        onClick();
      }}
    >
      <RoundedBox args={[width + 0.08, 0.3, 0.03]} radius={0.01} smoothness={2} castShadow>
        <Wood color="#5A3720" roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[width, 0.22, 0.012]} radius={0.006} smoothness={2} position={[0, 0, 0.02]}>
        <Brass />
      </RoundedBox>
      <Label3D text={text} position={[0, 0, 0.028]} size={[width * 0.94, 0.18]} style={{ bg: null, fg: "#3B2A0F", scale: 0.3, weight: 800 }} />
    </group>
  );
}

/** A cardboard project token: a coloured disc with an icon-like glyph. */
export function Token({ color, glyph, position = [0, 0, 0] as V3, onClick }: { color: string; glyph: string; position?: V3; onClick?: () => void }) {
  return (
    <group
      position={position}
      onClick={(e) => {
        if (!onClick) return;
        e.stopPropagation();
        onClick();
      }}
    >
      <mesh castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.03, 32]} />
        <Plastic color={color} />
      </mesh>
      <Label3D text={glyph} position={[0, 0.017, 0]} rotation={[-Math.PI / 2, 0, 0]} size={[0.13, 0.13]} style={{ bg: null, fg: "#FFFFFF", scale: 0.7 }} />
    </group>
  );
}
