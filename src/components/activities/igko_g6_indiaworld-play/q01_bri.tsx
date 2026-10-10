"use client";

import React from "react";
import { Network, Stamp, ScrollText } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Reading, Studio, useInvestigation } from "../igko_g6_scitech-play/kit";
import { Floor } from "../igko_g6_scitech-play/models";
import { FlatMap, MapArc, Pin, llToMap, type MapFrame } from "./geo";
import { BriefingTable, Folder, Token, IW_BADGE } from "./iwkit";
import { BRI_CHARTER, BRI_FOLDERS, BRI_PROJECTS, briInitial, evaluateBri, type BriFolder, type BriProject, type BriWorld } from "./logic";

/**
 * Q1 · Belt and Road command centre.
 * Investigate: lay project tokens on the map and read the initiative's published
 * cooperation priorities. Answer: stamp the one proposal folder that is NOT a stated
 * objective. Every token draws a route the same way, so placing one proves nothing.
 */

const TABLE_Y = 0.78;
const FRAME: MapFrame = { lon: [-15, 145], lat: [-15, 62], width: 3.3, y: TABLE_Y + 0.045 };
const HUB: [number, number] = [108.9, 34.3];

const SITES: Record<BriProject, { at: [number, number]; color: string; glyph: string; place: string }> = {
  railway: { at: [6.8, 51.4], color: "#2563EB", glyph: "🚆", place: "Western Europe" },
  port: { at: [62.3, 25.1], color: "#0891B2", glyph: "⚓", place: "Arabian Sea coast" },
  highway: { at: [73.0, 33.7], color: "#7C3AED", glyph: "🛣", place: "Karakoram range" },
  corridor: { at: [68.0, 47.0], color: "#059669", glyph: "📦", place: "Central Asia" },
  culture: { at: [36.8, -1.3], color: "#DB2777", glyph: "🎓", place: "East Africa" },
  military: { at: [43.1, 11.6], color: "#475569", glyph: "🛡", place: "Horn of Africa" },
};

const FOLDER_ORDER = Object.keys(BRI_FOLDERS) as BriFolder[];

function Scene({ world, ro, onStamp }: { world: BriWorld; ro: boolean; onStamp: (f: BriFolder) => void }) {
  return (
    <>
      <Studio shadowScale={10} shadowOpacity={0.35} />
      <Floor color="#ECE7DF" />
      <BriefingTable size={[3.9, 2.9]} height={TABLE_Y} />
      <group position={[0, 0, -0.42]}>
        <FlatMap frame={FRAME} />
        <Pin at={HUB} frame={FRAME} color="#DC2626" height={0.26} />
        <Label3D text="Initiative hub" position={[llToMap(HUB, FRAME)[0], TABLE_Y + 0.42, llToMap(HUB, FRAME)[2]]} size={[0.5, 0.11]} billboard style={{ bg: "#FFFFFF", fg: "#7F1D1D", border: "#FCA5A5", scale: 0.42 }} />
        {world.placed.map((p) => {
          const s = SITES[p];
          const [x, y, z] = llToMap(s.at, FRAME);
          return (
            <group key={p}>
              <MapArc from={HUB} to={s.at} frame={FRAME} color={s.color} height={0.45} movers={2} speed={0.18} />
              <Token color={s.color} glyph={s.glyph} position={[x, y + 0.02, z]} />
            </group>
          );
        })}
      </group>
      {FOLDER_ORDER.map((f, i) => (
        <Folder
          key={f}
          label={BRI_FOLDERS[f].label}
          position={[-1.38 + i * 0.92, TABLE_Y + 0.05, 1.05]}
          mark={world.stamped === f ? "stamp" : null}
          lifted={world.stamped === f}
          onClick={ro ? undefined : () => onStamp(f)}
        />
      ))}
    </>
  );
}

export function IgkoQ01Bri(props: ActivityComponentProps) {
  const play = useInvestigation<BriWorld>(props, briInitial, evaluateBri);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const toggle = (p: BriProject) => play.patch({ placed: world.placed.includes(p) ? world.placed.filter((x) => x !== p) : [...world.placed, p] });
  const stamp = (f: BriFolder) => play.patch({ stamped: world.stamped === f ? null : f });

  return (
    <Investigation
      play={play}
      question={props.question}
      badge={IW_BADGE}
      title="Belt and Road Command Centre"
      mission="Lay project tokens on the map and study the initiative's published priorities. Then stamp the one proposal folder that is NOT a stated objective."
      icon={Network}
      live={
        <>
          <Reading label="Routes on the map" value={world.placed.length} tone="teal" />
          <Reading label="Folder stamped" value={world.stamped ? BRI_FOLDERS[world.stamped].label : "none yet"} tone="amber" />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Lab3D camera={{ position: [0, 3.5, 3.3], fov: 42 }} readOnly={readOnly} orbit={{ target: [0, TABLE_Y, 0.1], minDistance: 2, maxDistance: 7, maxPolarAngle: 1.35 }}>
          <Scene world={world} ro={ro} onStamp={stamp} />
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Published cooperation priorities">
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-2.5">
              <p className="flex items-center gap-1.5 text-[11px] font-black text-amber-900 mb-1">
                <ScrollText className="w-3.5 h-3.5" /> Vision document (2015), five priorities
              </p>
              <ol className="list-decimal pl-5 space-y-0.5 text-[11.5px] text-slate-800">
                {BRI_CHARTER.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ol>
            </div>
          </Panel>
          <Panel title="Project tokens · tap to place or remove">
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(BRI_PROJECTS) as BriProject[]).map((p) => (
                <Chip key={p} active={world.placed.includes(p)} disabled={ro} onClick={() => toggle(p)} title={SITES[p].place}>
                  {SITES[p].glyph} {BRI_PROJECTS[p].name}
                </Chip>
              ))}
            </div>
          </Panel>
          <AnswerStation title="Review desk · the stamp" hint="Stamp the proposal folder that is NOT a stated objective. Tap a folder on the table or here.">
            <div className="grid gap-1.5">
              {FOLDER_ORDER.map((f) => (
                <Chip key={f} tone="violet" active={world.stamped === f} disabled={ro} onClick={() => stamp(f)}>
                  <span className="inline-flex items-center gap-1.5">
                    <Stamp className="w-3.5 h-3.5" /> {BRI_FOLDERS[f].label}
                  </span>
                </Chip>
              ))}
            </div>
          </AnswerStation>
        </div>
      </div>
    </Investigation>
  );
}
