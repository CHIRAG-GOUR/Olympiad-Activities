/**
 * IGKO Class 6 — India and the World: the rules of each investigation.
 *
 * Same contract as the Science & Technology paper: investigation is optional evidence and
 * never states an answer; one deliberate action in the world gives the answer, and every
 * printed option can be given that way. Options are matched by their printed text.
 */
import { NOT_A_CHOICE, type Evaluation } from "../igko_g6_scitech-play/logic";

export { resolveOption, NOT_A_CHOICE, type Evaluation } from "../igko_g6_scitech-play/logic";

const unanswered = (note: string): Evaluation => ({ completed: false, note });

/* ── Q1 · Belt and Road command centre ───────────────────────── */

/** Project tokens the student can place on the map (evidence: what the routes look like). */
export const BRI_PROJECTS = {
  railway: { name: "Cross-border railway", from: [0.62, 0.44], to: [0.3, 0.38] },
  port: { name: "Deep-water port", from: [0.62, 0.44], to: [0.5, 0.62] },
  highway: { name: "Mountain highway", from: [0.62, 0.44], to: [0.53, 0.5] },
  corridor: { name: "Trade corridor", from: [0.62, 0.44], to: [0.35, 0.55] },
  culture: { name: "Student & culture exchange", from: [0.62, 0.44], to: [0.45, 0.35] },
  military: { name: "Military alliance pact", from: [0.62, 0.44], to: [0.55, 0.4] },
} as const;
export type BriProject = keyof typeof BRI_PROJECTS;

/** The initiative's own published cooperation priorities (source document for the student). */
export const BRI_CHARTER = [
  "Policy coordination between governments",
  "Facilities connectivity — railways, roads, ports, pipelines",
  "Unimpeded trade and investment",
  "Financial integration",
  "People-to-people bonds — culture, education, tourism",
];

/** The four proposal folders on the review desk, one per printed statement. */
export const BRI_FOLDERS = {
  connectivity: { label: "Regional connectivity & economic cooperation", optionText: "To enhance regional connectivity and economic cooperation." },
  culture: { label: "Cultural exchange & understanding", optionText: "To promote cultural exchange and understanding." },
  military: { label: "Military alliance with participants", optionText: "To establish a military alliance with participating countries." },
  trade: { label: "Trade & investment flows", optionText: "To facilitate trade and investment flows." },
} as const;
export type BriFolder = keyof typeof BRI_FOLDERS;

export interface BriWorld {
  placed: BriProject[];
  /** The answer: the folder stamped "NOT a stated objective". */
  stamped: BriFolder | null;
}
export const briInitial = (): BriWorld => ({ placed: [], stamped: null });
export function evaluateBri(w: BriWorld): Evaluation {
  if (!w.stamped) return unanswered("Study the plan, then stamp the one proposal folder that is NOT a stated objective.");
  const f = BRI_FOLDERS[w.stamped];
  return { completed: true, derivedAnswer: `“Not a stated objective” stamped on: ${f.label}`, result: { folder: w.stamped, projectsPlaced: w.placed }, optionText: f.optionText };
}

/* ── Q2 · UN Security Council chamber ────────────────────────── */

export const UN_COUNTRIES = {
  usa: { name: "United States", optionText: null as string | null },
  russia: { name: "Russia", optionText: null as string | null },
  uk: { name: "United Kingdom", optionText: "United Kingdom" },
  france: { name: "France", optionText: "France" },
  china: { name: "China", optionText: "China" },
  germany: { name: "Germany", optionText: "Germany" },
} as const;
export type UnCountry = keyof typeof UN_COUNTRIES;
export const PERMANENT_SEATS = 5;

export interface UnscWorld {
  /** Flags placed in the five permanent-member seats. */
  seats: (UnCountry | null)[];
}
export const unscInitial = (): UnscWorld => ({ seats: Array(PERMANENT_SEATS).fill(null) });

/** Delegations still in the general area. */
export const unseated = (w: UnscWorld) => (Object.keys(UN_COUNTRIES) as UnCountry[]).filter((c) => !w.seats.includes(c));

export function evaluateUnsc(w: UnscWorld): Evaluation {
  if (w.seats.some((s) => !s)) return unanswered("Seat the five permanent members. The delegation left outside is your answer.");
  const left = unseated(w)[0];
  const c = UN_COUNTRIES[left];
  if (!c.optionText) return { completed: true, derivedAnswer: `${c.name} left outside the permanent seats`, result: { outside: left, seats: w.seats }, note: NOT_A_CHOICE };
  return { completed: true, derivedAnswer: `${c.name} left outside the permanent seats`, result: { outside: left, seats: w.seats }, optionText: c.optionText };
}

/* ── Q3 · Mesopotamia expedition ─────────────────────────────── */

export const RIVER_VALLEYS = {
  nileCongo: { label: "Nile & Congo", optionText: "Nile and Congo", region: "Africa" },
  indusGanges: { label: "Indus & Ganges", optionText: "Indus and Ganges", region: "South Asia" },
  tigrisEuphrates: { label: "Tigris & Euphrates", optionText: "Tigris and Euphrates", region: "West Asia" },
  yangtzeYellow: { label: "Yangtze & Yellow", optionText: "Yangtze and Yellow", region: "East Asia" },
} as const;
export type Valley = keyof typeof RIVER_VALLEYS;

/** Finds in the expedition tent: what the civilisation left behind (no locations). */
export const MESO_ARTIFACTS = [
  { name: "Clay tablet", note: "Wedge-shaped marks pressed into clay — cuneiform, one of the earliest writing systems." },
  { name: "Ziggurat model", note: "A stepped temple tower built of sun-dried mud bricks." },
  { name: "Potter's wheel", note: "Among the earliest known wheels, used for pottery before carts." },
  { name: "Irrigation canal map", note: "Fields were watered by canals cut between two great rivers." },
];

export interface MesoWorld {
  /** Artifacts examined (evidence). */
  examined: number[];
  /** The answer: the river valley where the student founds the city. */
  city: Valley | null;
}
export const mesoInitial = (): MesoWorld => ({ examined: [], city: null });
export function evaluateMeso(w: MesoWorld): Evaluation {
  if (!w.city) return unanswered("Examine the finds, then found the city between the two rivers where you think it grew.");
  const v = RIVER_VALLEYS[w.city];
  return { completed: true, derivedAnswer: `City founded between the ${v.label}`, result: { rivers: v.label.split(" & "), examined: w.examined.length }, optionText: v.optionText };
}

/* ── Q4 · SDG city builder ───────────────────────────────────── */

export const SDG_PROJECTS = {
  water: { name: "Clean-water plant", theme: null as string | null, label: "Clean water" },
  school: { name: "School", theme: null as string | null, label: "Education" },
  food: { name: "Food bank & farms", theme: "Poverty and Hunger", label: "Poverty and hunger" },
  court: { name: "Courthouse", theme: "Peace and Justice", label: "Peace and justice" },
  barracks: { name: "Army barracks", theme: "Military Expansion", label: "Military expansion" },
  solar: { name: "Solar park & forest", theme: "Climate Action and Environmental Protection", label: "Climate action & environment" },
} as const;
export type SdgProject = keyof typeof SDG_PROJECTS;

export interface SdgWorld {
  /** Projects built on the city plots (evidence). */
  built: SdgProject[];
  /** The answer: the project card put in the "not an SDG theme" tray. */
  rejected: SdgProject | null;
}
export const sdgInitial = (): SdgWorld => ({ built: [], rejected: null });
export function evaluateSdg(w: SdgWorld): Evaluation {
  if (!w.rejected) return unanswered("Build your city, then put the one project that is NOT an SDG theme in the review tray.");
  const p = SDG_PROJECTS[w.rejected];
  if (!p.theme) return { completed: true, derivedAnswer: `${p.name} put in the “not an SDG theme” tray`, result: { rejected: w.rejected }, note: NOT_A_CHOICE };
  return { completed: true, derivedAnswer: `${p.name} put in the “not an SDG theme” tray`, result: { rejected: w.rejected, built: w.built }, optionText: p.theme };
}

/* ── Q5 · Tectonic plate simulator ───────────────────────────── */

export type PlateKind = "oceanic" | "continental";
export type Motion = "converge" | "diverge" | "slide";

export interface TectonicRun {
  left: PlateKind;
  right: PlateKind;
  motion: Motion;
  coldCurrent: boolean;
  glacierMelt: boolean;
}

/** Earthquakes and volcanoes a run produces (per simulated century), from the set-up. */
export function tectonicActivity(r: TectonicRun) {
  let quakes = 1;
  let volcanoes = 0;
  let subduction = false;
  if (r.motion === "converge") {
    if (r.left !== r.right || (r.left === "oceanic" && r.right === "oceanic")) {
      subduction = true;
      quakes = 40;
      volcanoes = 12;
    } else {
      quakes = 25; // continents crumple into mountains, few volcanoes
      volcanoes = 0;
    }
  } else if (r.motion === "diverge") {
    quakes = 8;
    volcanoes = 4;
  } else {
    quakes = 18;
    volcanoes = 0;
  }
  // Neither a cold current nor melting ice changes plate behaviour noticeably.
  if (r.glacierMelt) quakes += 1;
  return { quakes, volcanoes, subduction };
}

export const CAUSE_CARDS = {
  current: { label: "A very cold ocean current", optionText: "The presence of a very cold ocean current that causes tectonic instability." },
  subduction: { label: "Oceanic plates diving beneath continental plates", optionText: "The subduction zones where oceanic plates are diving beneath continental plates." },
  seafloor: { label: "Many active volcanoes on the ocean floor", optionText: "The high concentration of active volcanoes on the ocean floor." },
  glaciers: { label: "Rapidly melting glaciers", optionText: "The rapid melting of glaciers leading to land subsidence." },
} as const;
export type CauseCard = keyof typeof CAUSE_CARDS;

export interface TectonicWorld {
  run: TectonicRun;
  /** Runs completed (evidence log). */
  log: (TectonicRun & { quakes: number; volcanoes: number })[];
  /** The answer: the cause card pinned on the Ring of Fire map. */
  pinned: CauseCard | null;
}
export const tectonicInitial = (): TectonicWorld => ({ run: { left: "continental", right: "continental", motion: "slide", coldCurrent: false, glacierMelt: false }, log: [], pinned: null });
export function evaluateTectonic(w: TectonicWorld): Evaluation {
  if (!w.pinned) return unanswered("Experiment with plates, then pin the cause card on the Ring of Fire map.");
  const c = CAUSE_CARDS[w.pinned];
  return { completed: true, derivedAnswer: `Cause pinned: ${c.label}`, result: { geologicalCause: w.pinned, runs: w.log.length }, optionText: c.optionText };
}

/* ── Q6 · Shipping navigator ─────────────────────────────────── */

export const PASSAGES = {
  suez: { name: "Suez Canal", optionText: "Suez Canal" },
  gibraltar: { name: "Strait of Gibraltar", optionText: "Strait of Gibraltar" },
  malacca: { name: "Strait of Malacca", optionText: "Strait of Malacca" },
  panama: { name: "Panama Canal", optionText: "Panama Canal" },
  cape: { name: "Cape of Good Hope", optionText: null as string | null },
} as const;
export type Passage = keyof typeof PASSAGES;

/** Voyages the planner can lay out, Mumbai → London (nautical miles). */
export const ROUTES = {
  suez: { label: "Via the Red Sea", passes: ["suez", "gibraltar"] as Passage[], nm: 6200 },
  cape: { label: "Around Africa", passes: ["cape"] as Passage[], nm: 10800 },
  panama: { label: "East across the Pacific", passes: ["malacca", "panama"] as Passage[], nm: 21500 },
} as const;
export type RouteId = keyof typeof ROUTES;

export interface ShipWorld {
  route: RouteId | null;
  sailed: RouteId[];
  /** The answer: the landmark entered as the voyage's key landmark in the log. */
  logged: Passage | null;
}
export const shipInitial = (): ShipWorld => ({ route: null, sailed: [], logged: null });
export function evaluateShip(w: ShipWorld): Evaluation {
  if (!w.logged) return unanswered("Sail the routes, then log the major landmark a ship on the shortest route passes through.");
  const p = PASSAGES[w.logged];
  if (!p.optionText) return { completed: true, derivedAnswer: `Logged landmark: ${p.name}`, result: { routeLandmark: w.logged }, note: NOT_A_CHOICE };
  return { completed: true, derivedAnswer: `Logged landmark: ${p.name}`, result: { routeLandmark: w.logged, routesSailed: w.sailed }, optionText: p.optionText };
}

/* ── Q7 · Zero place-value machine ───────────────────────────── */

/** Four brass plaques that can be mounted on the machine's front. */
export const ZERO_PLAQUES = {
  negative: { label: "It allowed negative numbers", optionText: "It allowed for the development of negative numbers." },
  placeValue: { label: "It stands for ‘nothing here’, so digits keep their places", optionText: "It represented the absence of value, enabling place-value notation." },
  primes: { label: "It was needed to find prime numbers", optionText: "It was essential for calculating prime numbers." },
  sums: { label: "It made adding and subtracting simpler", optionText: "It simplified the process of addition and subtraction." },
} as const;
export type ZeroPlaque = keyof typeof ZERO_PLAQUES;

export interface ZeroWorld {
  /** Thousands, hundreds, tens, ones. null = an empty slot with no wheel. */
  wheels: (number | null)[];
  /** The answer: the plaque mounted on the machine. */
  plaque: ZeroPlaque | null;
}
export const zeroInitial = (): ZeroWorld => ({ wheels: [null, 5, null, 7], plaque: null });

/** How the machine reads the wheels: empty slots are skipped, as in a system without zero. */
export function machineReading(wheels: (number | null)[]) {
  const digits = wheels.filter((d): d is number => d !== null);
  const value = digits.length ? Number(digits.join("")) : 0;
  const intended = wheels.reduce<number>((sum, d, i) => sum + (d ?? 0) * 10 ** (wheels.length - 1 - i), 0);
  return { value, intended };
}

export function evaluateZero(w: ZeroWorld): Evaluation {
  if (!w.plaque) return unanswered("Work the machine, then mount the plaque that says why zero was revolutionary.");
  const p = ZERO_PLAQUES[w.plaque];
  return { completed: true, derivedAnswer: `Plaque mounted: “${p.label}”`, result: { concept: w.plaque, wheels: w.wheels }, optionText: p.optionText };
}

/* ── Q8 · Act East strategy map ──────────────────────────────── */

export const PARTNERS = {
  myanmar: { name: "Myanmar", pos: [0.45, 0.5] },
  thailand: { name: "Thailand", pos: [0.52, 0.58] },
  vietnam: { name: "Vietnam", pos: [0.6, 0.55] },
  singapore: { name: "Singapore", pos: [0.55, 0.75] },
  indonesia: { name: "Indonesia", pos: [0.65, 0.8] },
  japan: { name: "Japan", pos: [0.85, 0.3] },
} as const;
export type Partner = keyof typeof PARTNERS;

export const LINK_KINDS = {
  trade: "Trade agreement",
  highway: "Highway / rail link",
  port: "Port & shipping lane",
  security: "Maritime security dialogue",
} as const;
export type LinkKind = keyof typeof LINK_KINDS;

export const POLICY_FOLDERS = {
  counter: { label: "Counter Western powers in the region", optionText: "To counter the influence of Western powers in the region." },
  agri: { label: "New markets for farm products", optionText: "To find new markets for Indian agricultural products." },
  regional: { label: "Regional role & economic interests", optionText: "To enhance India's role as a regional power and secure its economic interests." },
  migration: { label: "Skilled migration to India", optionText: "To encourage migration of skilled labor from these countries to India." },
} as const;
export type PolicyFolder = keyof typeof POLICY_FOLDERS;

export interface ActEastWorld {
  links: { partner: Partner; kind: LinkKind }[];
  /** The answer: the briefing folder sealed as the primary driver. */
  sealed: PolicyFolder | null;
}
export const actEastInitial = (): ActEastWorld => ({ links: [], sealed: null });
export function evaluateActEast(w: ActEastWorld): Evaluation {
  if (!w.sealed) return unanswered("Build India's eastern network, then seal the briefing folder naming the policy's primary driver.");
  const f = POLICY_FOLDERS[w.sealed];
  return { completed: true, derivedAnswer: `Folder sealed: ${f.label}`, result: { policyDriver: w.sealed, links: w.links.length }, optionText: f.optionText };
}

/* ── Q9 · Suez engineering ───────────────────────────────────── */

export const CANAL_SECTIONS = 5;
export const AROUND_AFRICA_NM = 10800;
export const VIA_SUEZ_NM = 6200;

export const CANAL_PLAQUES = {
  water: { label: "Fresh water for the desert", optionText: "To create a new freshwater source for the surrounding desert regions." },
  atlantic: { label: "Joins the Atlantic to the Indian Ocean", optionText: "To connect the Atlantic Ocean directly to the Indian Ocean." },
  trade: { label: "Shortens the sea route between Europe and Asia", optionText: "To shorten the maritime trade route between Europe and Asia." },
  military: { label: "Moves war fleets", optionText: "To facilitate the movement of military fleets during times of war." },
} as const;
export type CanalPlaque = keyof typeof CANAL_PLAQUES;

export interface SuezWorld {
  dug: number[];
  raced: boolean;
  /** The answer: the plaque fixed at the canal's opening. */
  plaque: CanalPlaque | null;
}
export const suezInitial = (): SuezWorld => ({ dug: [], raced: false, plaque: null });
export const canalOpen = (w: SuezWorld) => w.dug.length === CANAL_SECTIONS;
export function evaluateSuez(w: SuezWorld): Evaluation {
  if (!w.plaque) return unanswered("Dig the canal and race the ships, then fix the plaque stating why the canal was built.");
  const p = CANAL_PLAQUES[w.plaque];
  return { completed: true, derivedAnswer: `Opening plaque: “${p.label}”`, result: { purpose: w.plaque, canalOpen: canalOpen(w), raced: w.raced }, optionText: p.optionText };
}

/* ── Q10 · Finance crisis room ───────────────────────────────── */

export const DESKS = {
  who: { name: "WHO desk", optionText: "World Health Organization (WHO)" },
  imf: { name: "IMF desk", optionText: "International Monetary Fund (IMF)" },
  unicef: { name: "UNICEF desk", optionText: "United Nations Children's Fund (UNICEF)" },
  wto: { name: "WTO desk", optionText: "World Trade Organization (WTO)" },
} as const;
export type Desk = keyof typeof DESKS;

export const DOSSIERS = {
  currency: { title: "Currency collapse", detail: "A country's currency has lost half its value; it cannot pay for imports and needs a loan to steady its money." },
  outbreak: { title: "Disease outbreak", detail: "A fast-spreading illness in three countries." },
  children: { title: "Children without schooling", detail: "Thousands of children displaced from their schools." },
  tariffs: { title: "Tariff dispute", detail: "Two countries accuse each other of unfair import taxes." },
} as const;
export type Dossier = keyof typeof DOSSIERS;

export interface CrisisWorld {
  /** Where each dossier has been delivered. The currency dossier's desk is the answer. */
  routed: Partial<Record<Dossier, Desk>>;
}
export const crisisInitial = (): CrisisWorld => ({ routed: {} });
export function evaluateCrisis(w: CrisisWorld): Evaluation {
  const desk = w.routed.currency;
  if (!desk) return unanswered("Deliver the currency-collapse dossier to the desk that handles financial stability and monetary cooperation.");
  const d = DESKS[desk];
  return { completed: true, derivedAnswer: `Currency-collapse dossier delivered to the ${d.name}`, result: { organization: desk, routed: w.routed }, optionText: d.optionText };
}

/* ── Q11 · World headquarters flight ─────────────────────────── */

export const AIRPORTS = {
  newyork: { city: "New York City", country: "USA", optionText: "New York City, USA" },
  geneva: { city: "Geneva", country: "Switzerland", optionText: "Geneva, Switzerland" },
  hague: { city: "The Hague", country: "Netherlands", optionText: "The Hague, Netherlands" },
  paris: { city: "Paris", country: "France", optionText: "Paris, France" },
} as const;
export type Airport = keyof typeof AIRPORTS;

export interface FlightWorld {
  /** Airport the aircraft has landed at. Landing is the answer. */
  landed: Airport | null;
  flights: number;
}
export const flightInitial = (): FlightWorld => ({ landed: null, flights: 0 });
export function evaluateFlight(w: FlightWorld): Evaluation {
  if (!w.landed) return unanswered("Fly the aircraft and land at the city where the International Court of Justice has its headquarters.");
  const a = AIRPORTS[w.landed];
  return { completed: true, derivedAnswer: `Landed at ${a.city}, ${a.country}`, result: { city: a.city, country: a.country }, optionText: a.optionText };
}

/* ── Q12 · Brexit timeline ───────────────────────────────────── */

export const BODIES = {
  nato: { name: "NATO", full: "North Atlantic Treaty Organization", optionText: "North Atlantic Treaty Organization (NATO)", founded: 1949 },
  wto: { name: "WTO", full: "World Trade Organization", optionText: "World Trade Organization (WTO)", founded: 1995 },
  eu: { name: "EU", full: "European Union", optionText: "European Union (EU)", founded: 1993 },
  g7: { name: "G7", full: "Group of Seven", optionText: "G7", founded: 1975 },
} as const;
export type Body = keyof typeof BODIES;

/** Timeline events about the UK, with the organisation left blank for the student. */
export const BREXIT_EVENTS = [
  { year: 2016, text: "Referendum: 52% of voters choose to leave" },
  { year: 2017, text: "The UK formally notifies its intention to withdraw" },
  { year: 2020, text: "31 January: the UK leaves" },
];

export interface BrexitWorld {
  /** The answer: the organisation block docked into the timeline's withdrawal slot. */
  docked: Body | null;
  /** Timeline stage the student has advanced to (evidence/animation). */
  stage: number;
}
export const brexitInitial = (): BrexitWorld => ({ docked: null, stage: 0 });
export function evaluateBrexit(w: BrexitWorld): Evaluation {
  if (!w.docked) return unanswered("Dock the organisation the UK withdrew from into the timeline.");
  const b = BODIES[w.docked];
  return { completed: true, derivedAnswer: `Timeline: the UK withdraws from the ${b.full}`, result: { withdrawalOrganization: b.full }, optionText: b.optionText };
}

/* ── Q13 · Vedic music studio ────────────────────────────────── */

/** The four manuscripts as they look: no labels saying what each is for. */
export const VEDAS = {
  rig: { name: "Rig Veda", optionText: "Rig Veda", look: "Verses arranged in ten books (mandalas)", marks: "plain" },
  sama: { name: "Sama Veda", optionText: "Sama Veda", look: "Verses with small signs written above the syllables", marks: "above" },
  yajur: { name: "Yajur Veda", optionText: "Yajur Veda", look: "Prose formulas mixed with verses", marks: "prose" },
  atharva: { name: "Atharva Veda", optionText: "Atharva Veda", look: "Verses on everyday life, health and home", marks: "plain" },
} as const;
export type Veda = keyof typeof VEDAS;

export interface VedaWorld {
  inspected: Veda[];
  /** The answer: the manuscript placed on the music stand. */
  onStand: Veda | null;
}
export const vedaInitial = (): VedaWorld => ({ inspected: [], onStand: null });
export function evaluateVeda(w: VedaWorld): Evaluation {
  if (!w.onStand) return unanswered("Inspect the manuscripts, then place the one related to music on the music stand.");
  const v = VEDAS[w.onStand];
  return { completed: true, derivedAnswer: `${v.name} placed on the music stand`, result: { veda: v.name }, optionText: v.optionText };
}

/* ── Q14 · Continents expedition ─────────────────────────────── */

export const CONTINENTS = {
  asia: { name: "Asia", optionText: "Asia" },
  africa: { name: "Africa", optionText: "Africa" },
  southAmerica: { name: "South America", optionText: "South America" },
  europe: { name: "Europe", optionText: "Europe" },
} as const;
export type Continent = keyof typeof CONTINENTS;

export const LANDMARKS = [
  { name: "Sahara Desert", continent: "africa" as Continent },
  { name: "River Nile", continent: "africa" as Continent },
  { name: "Congo rainforest", continent: "africa" as Continent },
  { name: "Himalayas", continent: "asia" as Continent },
  { name: "Gobi Desert", continent: "asia" as Continent },
  { name: "Amazon rainforest", continent: "southAmerica" as Continent },
  { name: "Andes", continent: "southAmerica" as Continent },
  { name: "Alps", continent: "europe" as Continent },
];

export interface ContinentWorld {
  visited: string[];
  /** The answer: the continent the expedition flag is planted on. */
  flag: Continent | null;
}
export const continentInitial = (): ContinentWorld => ({ visited: [], flag: null });
export function evaluateContinent(w: ContinentWorld): Evaluation {
  if (!w.flag) return unanswered("Explore the globe, then plant the expedition flag on the continent the question names.");
  const c = CONTINENTS[w.flag];
  return { completed: true, derivedAnswer: `Expedition flag planted on ${c.name}`, result: { continent: c.name, visited: w.visited.length }, optionText: c.optionText };
}

/* ── Q15 · Cyclone tracker ───────────────────────────────────── */

export const WARNING_REGIONS = {
  australia: { name: "Australia", optionText: "Australia", lat: -20, lon: 134 },
  usa: { name: "USA", optionText: "USA", lat: 27, lon: -85 },
  china: { name: "China", optionText: "China", lat: 22, lon: 115 },
  india: { name: "India", optionText: "India", lat: 16, lon: 85 },
} as const;
export type Region = keyof typeof WARNING_REGIONS;

/** Storms spin clockwise in the Southern Hemisphere and anticlockwise in the Northern. */
export const spinFor = (lat: number) => (lat < 0 ? "clockwise" : "anticlockwise");

export interface CycloneWorld {
  /** Storm position the student has steered it to (degrees). */
  lat: number;
  lon: number;
  /** The answer: the region the "Willy-willy warning" is issued for. */
  warned: Region | null;
}
export const cycloneInitial = (): CycloneWorld => ({ lat: 0, lon: 100, warned: null });
export function evaluateCyclone(w: CycloneWorld): Evaluation {
  if (!w.warned) return unanswered("Study how storms behave around the globe, then issue the Willy-willy warning for one region.");
  const r = WARNING_REGIONS[w.warned];
  return { completed: true, derivedAnswer: `Willy-willy warning issued for ${r.name}`, result: { cycloneRegion: r.name }, optionText: r.optionText };
}
