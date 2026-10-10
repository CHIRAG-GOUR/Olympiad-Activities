"use client";

import React from "react";
import { Compass, Link2, X, Stamp } from "lucide-react";
import type { ActivityComponentProps } from "../kit/types";
import { Label3D } from "../imo6a-play/three";
import { Investigation, Lab3D, Panel, AnswerStation, Chip, Reading, Studio, useInvestigation } from "../igko_g6_scitech-play/kit";
import { Floor } from "../igko_g6_scitech-play/models";
import { FlatMap, MapArc, Pin, llToMap, type MapFrame } from "./geo";
import { BriefingTable, Folder, Flag, IW_BADGE } from "./iwkit";
import { LINK_KINDS, PARTNERS, POLICY_FOLDERS, actEastInitial, evaluateActEast, type ActEastWorld, type LinkKind, type Partner, type PolicyFolder } from "./logic";

/**
 * Q8 · Act East strategy map.
 * Investigate: build India's eastern network — trade agreements, road and rail links, ports
 * and security dialogues — and watch the routes appear on the map. Answer: seal the
 * briefing folder that names the policy's primary driver.
 */

const TABLE_Y = 0.78;
const FRAME: MapFrame = { lon: [62, 148], lat: [-12, 44], width: 3.5, y: TABLE_Y + 0.045 };
const DELHI: [number, number] = [77.2, 28.6];
const AT: Record<Partner, [number, number]> = {
  myanmar: [96.1, 19.7],
  thailand: [100.5, 13.8],
  vietnam: [105.8, 21.0],
  singapore: [103.8, 1.35],
  indonesia: [106.8, -6.2],
  japan: [139.7, 35.7],
};
const KIND_COLOR: Record<LinkKind, string> = { trade: "#F59E0B", highway: "#7C3AED", port: "#0EA5E9", security: "#DC2626" };
const PARTNER_IDS = Object.keys(PARTNERS) as Partner[];
const KIND_IDS = Object.keys(LINK_KINDS) as LinkKind[];
const FOLDER_IDS = Object.keys(POLICY_FOLDERS) as PolicyFolder[];

export function IgkoQ08ActEast(props: ActivityComponentProps) {
  const play = useInvestigation<ActEastWorld>(props, actEastInitial, evaluateActEast);
  const { world, readOnly } = play;
  const ro = !!readOnly;
  const [partner, setPartner] = React.useState<Partner>("myanmar");
  const has = (p: Partner, k: LinkKind) => world.links.some((l) => l.partner === p && l.kind === k);
  const toggleLink = (p: Partner, k: LinkKind) =>
    play.patch({ links: has(p, k) ? world.links.filter((l) => !(l.partner === p && l.kind === k)) : [...world.links, { partner: p, kind: k }] });
  const seal = (f: PolicyFolder) => play.patch({ sealed: world.sealed === f ? null : f });
  const partnersLinked = new Set(world.links.map((l) => l.partner)).size;

  return (
    <Investigation
      play={play}
      question={props.question}
      badge={IW_BADGE}
      title="Act East Strategy Map"
      mission="Build India's network with its eastern neighbours and watch the links appear on the map. Then seal the briefing folder that names the policy's primary driver."
      icon={Compass}
      live={
        <>
          <Reading label="Links built" value={world.links.length} tone="teal" />
          <Reading label="Partners connected" value={`${partnersLinked} / ${PARTNER_IDS.length}`} />
          <Reading label="Folder sealed" value={world.sealed ? POLICY_FOLDERS[world.sealed].label : "none yet"} tone="amber" />
        </>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Lab3D camera={{ position: [0, 3.4, 3.2], fov: 42 }} readOnly={readOnly} orbit={{ target: [0, TABLE_Y, 0.15], minDistance: 2, maxDistance: 7, maxPolarAngle: 1.35 }}>
          <Studio shadowScale={10} shadowOpacity={0.3} />
          <Floor color="#ECEFF3" />
          <BriefingTable size={[3.9, 2.9]} height={TABLE_Y} inlay="#1F3A4E" />
          <group position={[0, 0, -0.4]}>
            <FlatMap frame={FRAME} />
            <group position={llToMap(DELHI, FRAME)}>
              <Flag id="india" height={0.32} size={0.18} />
            </group>
            {PARTNER_IDS.map((p) => (
              <group key={p}>
                <Pin at={AT[p]} frame={FRAME} color={world.links.some((l) => l.partner === p) ? "#16A34A" : "#94A3B8"} height={0.16} />
                <Label3D text={PARTNERS[p].name} position={llToMap(AT[p], FRAME, 0.27)} size={[0.38, 0.085]} billboard style={{ bg: "#FFFFFF", fg: "#0F172A", border: "#CBD5E1", scale: 0.45 }} />
              </group>
            ))}
            {world.links.map((l) => (
              <MapArc key={`${l.partner}-${l.kind}`} from={DELHI} to={AT[l.partner]} frame={FRAME} color={KIND_COLOR[l.kind]} height={0.25 + KIND_IDS.indexOf(l.kind) * 0.14} movers={2} speed={0.2} />
            ))}
          </group>
          {FOLDER_IDS.map((f, i) => (
            <Folder
              key={f}
              label={POLICY_FOLDERS[f].label}
              color="#D9E4F0"
              position={[-1.38 + i * 0.92, TABLE_Y + 0.05, 1.05]}
              mark={world.sealed === f ? "seal" : null}
              lifted={world.sealed === f}
              onClick={ro ? undefined : () => seal(f)}
            />
          ))}
        </Lab3D>

        <div className="space-y-3">
          <Panel title="Build a link">
            <div className="flex flex-wrap gap-1">
              {PARTNER_IDS.map((p) => (
                <Chip key={p} active={partner === p} onClick={() => setPartner(p)}>
                  {PARTNERS[p].name}
                </Chip>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {KIND_IDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  disabled={ro}
                  aria-pressed={has(partner, k)}
                  onClick={() => toggleLink(partner, k)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-bold cursor-pointer disabled:opacity-40 ${
                    has(partner, k) ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: KIND_COLOR[k] }} />
                  {has(partner, k) ? <X className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
                  {LINK_KINDS[k]}
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="From the 2014 announcement">
            <p className="text-[11.5px] text-slate-700 leading-snug">
              “Look East” was upgraded to “Act East”: deeper trade, connectivity and security ties with the countries of South-East Asia and the wider Indo-Pacific, starting with India&apos;s north-eastern states as the gateway.
            </p>
          </Panel>
          <AnswerStation title="Seal a briefing folder" hint="Seal the folder that names the primary driver of the Act East Policy. Tap a folder on the table or here.">
            <div className="grid gap-1.5">
              {FOLDER_IDS.map((f) => (
                <Chip key={f} tone="violet" active={world.sealed === f} disabled={ro} onClick={() => seal(f)}>
                  <span className="inline-flex items-center gap-1.5">
                    <Stamp className="w-3.5 h-3.5" /> {POLICY_FOLDERS[f].label}
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
