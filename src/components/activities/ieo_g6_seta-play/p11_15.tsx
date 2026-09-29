"use client";

import React, { useState } from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { Shell, Board, WordPill, SentenceSlot, Bay, World3D } from "./kit";
import {
  Waves,
  Bus,
  Smartphone,
  ShoppingBag,
  CloudRain,
  Sliders,
  Thermometer,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  SwimmingPool3D,
  BusStopShelter3D,
  GiftUnboxing3D,
  WeatherStation3D,
  Avatar3D,
} from "./components3D";

/* ══════════════════════════════════════════════════════════════════════
   Q11 — 🌊 3D Pool Temperature Challenge
   Sentence: "I don't think that the water is ______ hot for you to swim in today."
   Options: A. too, B. much, C. such, D. just -> Key: A (too)
   ══════════════════════════════════════════════════════════════════════ */
export function Q11IceCreamShopActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const [temp, setTemp] = useState(28);

  const play = usePlay<{ selectedModifier?: string; temperature: number }>({
    question,
    initial: { selectedModifier: undefined, temperature: 28 },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedModifier) return { note: "Adjust the pool temperature dial and choose the degree modifier" };
      const map: Record<string, string> = { too: "A", much: "B", such: "C", just: "D" };
      return {
        value: w.selectedModifier,
        optionId: map[w.selectedModifier],
        note:
          w.selectedModifier === "too"
            ? "Degree adverb: 'too hot for [someone] to [do something]' indicates excessive temperature."
            : `Selected: ${w.selectedModifier}`,
      };
    },
  });

  const modifiers = ["too", "much", "such", "just"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q11 · 🌊 3D Pool Temperature Challenge"
      subtitle="Adjust the pool water temperature gauge and install the degree modifier 'too'"
      hints={[
        "The pattern 'too + adjective + for someone + to infinitive' ('too hot for you to swim in') expresses excess.",
      ]}
    >
      <Board>
        {/* 3D Swimming Pool */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-sky-300/80 bg-gradient-to-b from-sky-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-sky-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-xs">
                <Waves className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Olympic Swimming Pool
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Water Temp: {temp}°C · Status: Comfortable
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[22, 28, 42].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTemp(t);
                    play.patch({ temperature: t });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                    temp === t
                      ? "bg-sky-600 text-white border-sky-700 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-sky-50"
                  }`}
                >
                  {t}°C {t === 42 ? "(Too Hot)" : ""}
                </button>
              ))}
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <SwimmingPool3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#0284C7" hairStyle="swimcap" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-sky-50/90 border-2 border-sky-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            I don&apos;t think that the water is{" "}
            <SentenceSlot value={play.world.selectedModifier} filled={!!play.world.selectedModifier} />{" "}
            hot for you to swim in today.
          </p>
        </div>

        {/* Modifiers Bay */}
        <Bay label="Degree Modifier Bay" tone="sky">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {modifiers.map((m) => (
              <WordPill
                key={m}
                word={m}
                selected={play.world.selectedModifier === m}
                onClick={() => play.patch({ selectedModifier: m })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q12 — 🚌 3D City Transport Decision Game
   Sentence: "If the bus fare costs more than I thought, I ______ have to walk to the shops."
   Options: A. will, B. would, C. will be, D. won't -> Key: B (would)
   ══════════════════════════════════════════════════════════════════════ */
export function Q12CricketMemoryActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedModal?: string; routeMode: string }>({
    question,
    initial: { selectedModal: undefined, routeMode: "bus" },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedModal) return { note: "Calculate the conditional outcome and install the modal verb" };
      const map: Record<string, string> = { will: "A", would: "B", "will be": "C", "won't": "D" };
      return {
        value: w.selectedModal,
        optionId: map[w.selectedModal],
        note:
          w.selectedModal === "would"
            ? "Hypothetical conditional: 'would have to walk' expresses the hypothetical consequence."
            : `Selected: ${w.selectedModal}`,
      };
    },
  });

  const modals = ["will", "would", "will be", "won't"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q12 · 🚌 3D City Transport Decision Game"
      subtitle="Examine the fare vs walking distance and construct the conditional sentence"
      hints={[
        "In hypothetical conditionals expressing potential consequence, 'would + have to' is used.",
      ]}
    >
      <Board>
        {/* 3D Bus Stop */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-indigo-200/80 bg-gradient-to-b from-indigo-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-indigo-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <Bus className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  City Transit Stop #42
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Fare: $4.50 vs Pocket Cash: $2.00 → Route: Walk (15 min)
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <BusStopShelter3D position={[0, 0, 0]} />
            <Avatar3D position={[0.6, 0, 0]} pose="standing" shirtColor="#4F46E5" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-indigo-50/90 border-2 border-indigo-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            If the bus fare costs more than I thought, I{" "}
            <SentenceSlot value={play.world.selectedModal} filled={!!play.world.selectedModal} />{" "}
            have to walk to the shops.
          </p>
        </div>

        {/* Modal Bay */}
        <Bay label="Conditional Modal Bay" tone="indigo">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {modals.map((m) => (
              <WordPill
                key={m}
                word={m}
                selected={play.world.selectedModal === m}
                onClick={() => play.patch({ selectedModal: m })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q13 — 📱 3D Contact Detective
   Sentence: "She's the lady I met yesterday and ______ number I was trying to call just now."
   Options: A. whom, B. who, C. whose, D. who is -> Key: C (whose)
   ══════════════════════════════════════════════════════════════════════ */
export function Q13StormWarningActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedRelative?: string; contactUnlocked: boolean }>({
    question,
    initial: { selectedRelative: undefined, contactUnlocked: false },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedRelative) return { note: "Identify the possessive relationship between the lady and her number" };
      const map: Record<string, string> = { whom: "A", who: "B", whose: "C", "who is": "D" };
      return {
        value: w.selectedRelative,
        optionId: map[w.selectedRelative],
        note:
          w.selectedRelative === "whose"
            ? "Possessive relative pronoun: 'whose number' denotes ownership of the phone number."
            : `Selected: ${w.selectedRelative}`,
      };
    },
  });

  const relatives = ["whom", "who", "whose", "who is"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q13 · 📱 3D Contact Detective"
      subtitle="Connect the ownership link between the person and the contact number"
      hints={[
        "The possessive relative pronoun 'whose' modifies the following noun 'number' (belonging to the lady).",
      ]}
    >
      <Board>
        {/* 3D Contact Hologram */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-violet-200/80 bg-gradient-to-b from-violet-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-violet-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-white shadow-xs">
                <Smartphone className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Smartphone Contact Dossier
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Target: The Lady Met Yesterday · Belonging: Her Contact Number
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <GiftUnboxing3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#7C3AED" hairStyle="ponytail" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-violet-50/90 border-2 border-violet-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            She&apos;s the lady I met yesterday and{" "}
            <SentenceSlot value={play.world.selectedRelative} filled={!!play.world.selectedRelative} />{" "}
            number I was trying to call just now.
          </p>
        </div>

        {/* Relative Pronoun Bay */}
        <Bay label="Relative Pronoun Bay" tone="violet">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {relatives.map((r) => (
              <WordPill
                key={r}
                word={r}
                selected={play.world.selectedRelative === r}
                onClick={() => play.patch({ selectedRelative: r })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q14 — 🛍️ 3D Shopping Memory Game
   Sentence: "Every time I go to the sales, I forget to take ______ money."
   Options: A. a, B. an, C. the, D. no article -> Key: C (the)
   ══════════════════════════════════════════════════════════════════════ */
export function Q14ParkPathActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const play = usePlay<{ selectedArticle?: string; walletChecked: boolean }>({
    question,
    initial: { selectedArticle: undefined, walletChecked: true },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedArticle) return { note: "Attach the required definite article to the specific shopping money" };
      const map: Record<string, string> = { a: "A", an: "B", the: "C", "no article": "D" };
      return {
        value: w.selectedArticle,
        optionId: map[w.selectedArticle],
        note:
          w.selectedArticle === "the"
            ? "Definite article: 'take the money' refers specifically to the required budget needed for the shopping sales."
            : `Selected: ${w.selectedArticle}`,
      };
    },
  });

  const articles = ["a", "an", "the", "no article"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q14 · 🛍️ 3D Shopping Memory Game"
      subtitle="Inspect the department store entrance and select the definite article 'the'"
      hints={[
        "The context refers to the specific money set aside for shopping at the sales: 'take THE money'.",
      ]}
    >
      <Board>
        {/* 3D Shopping Sale Scene */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-pink-200/80 bg-gradient-to-b from-pink-50 to-slate-900/10 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-pink-200/60 p-3.5 bg-white/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-600 text-white shadow-xs">
                <ShoppingBag className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Department Store Mega-Sale
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Item to Bring: The Shopping Money
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <BusStopShelter3D position={[0, 0, 0]} />
            <Avatar3D position={[0, 0, 0.4]} pose="standing" shirtColor="#DB2777" hairStyle="cap" />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-pink-50/90 border-2 border-pink-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            Every time I go to the sales, I forget to take{" "}
            <SentenceSlot value={play.world.selectedArticle} filled={!!play.world.selectedArticle} />{" "}
            money.
          </p>
        </div>

        {/* Article Bay */}
        <Bay label="Article Selection Bay" tone="pink">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {articles.map((a) => (
              <WordPill
                key={a}
                word={a}
                selected={play.world.selectedArticle === a}
                onClick={() => play.patch({ selectedArticle: a })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Q15 — ☁️ 3D Weather Control Laboratory
   Sentence: "As the wind blew, the clouds started ______, making the sky turn grey."
   Options: A. gathering, B. gathered, C. to be gathered, D. were gathering -> Key: A (gathering)
   ══════════════════════════════════════════════════════════════════════ */
export function Q15TrainPlatformActivity({
  question,
  value,
  activityState,
  onChange,
  readOnly,
}: ActivityComponentProps) {
  const [cloudDensity, setCloudDensity] = useState(75);

  const play = usePlay<{ selectedParticiple?: string; density: number }>({
    question,
    initial: { selectedParticiple: undefined, density: 75 },
    activityState,
    value,
    onChange,
    readOnly,
    derive: (w) => {
      if (!w.selectedParticiple) return { note: "Operate the weather laboratory and select the gerund following 'started'" };
      const map: Record<string, string> = {
        gathering: "A",
        gathered: "B",
        "to be gathered": "C",
        "were gathering": "D",
      };
      return {
        value: w.selectedParticiple,
        optionId: map[w.selectedParticiple],
        note:
          w.selectedParticiple === "gathering"
            ? "Gerund after 'started': 'started gathering' expresses the initiation of an ongoing natural process."
            : `Selected: ${w.selectedParticiple}`,
      };
    },
  });

  const participles = ["gathering", "gathered", "to be gathered", "were gathering"];

  return (
    <Shell
      dim="3D"
      play={play}
      question={question}
      title="Q15 · ☁️ 3D Weather Control Laboratory"
      subtitle="Simulate increasing wind and install the active gerund 'gathering' after 'started'"
      hints={[
        "The verb 'start' when describing continuous natural movement takes the present participle / gerund ('started gathering').",
      ]}
    >
      <Board>
        {/* 3D Weather Simulator */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 p-3.5 bg-slate-900/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-700 text-white shadow-xs">
                <CloudRain className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Atmospheric Cloud Simulator
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Wind Speed: 48 km/h · Sky Condition: Turning Grey
                </span>
              </div>
            </div>
          </div>

          <World3D height="280px" camera={{ position: [0, 2.2, 3.8], fov: 45 }}>
            <WeatherStation3D position={[0, 0, 0]} />
          </World3D>
        </div>

        {/* Live Sentence Slot */}
        <div className="bg-slate-900 border-2 border-slate-700 text-white rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold leading-relaxed">
            As the wind blew, the clouds started{" "}
            <SentenceSlot value={play.world.selectedParticiple} filled={!!play.world.selectedParticiple} />
            , making the sky turn grey.
          </p>
        </div>

        {/* Participle Bay */}
        <Bay label="Participle Form Bay" tone="slate">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {participles.map((p) => (
              <WordPill
                key={p}
                word={p}
                selected={play.world.selectedParticiple === p}
                onClick={() => play.patch({ selectedParticiple: p })}
              />
            ))}
          </div>
        </Bay>
      </Board>
    </Shell>
  );
}
