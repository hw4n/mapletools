"use client";

import React from "react";
import InfoBlock from "./InfoBlock";
import { ButtonGroup } from "./ui/ButtonGroup";
import equipmentItems from "../data/equipment-items.json";
import equipmentSetEffects from "../data/equipment-set-effects.json";

const EQUIP_GRID = [
    "ring-1",
    null,
    "hat",
    null,
    "emblem",
    "ring-2",
    "pendant-1",
    "face",
    null,
    "badge",
    "ring-3",
    "pendant-2",
    "eye",
    "earring",
    "medal",
    "ring-4",
    "weapon",
    "top",
    "shoulder",
    "secondary",
    "pocket",
    "belt",
    "bottom",
    "gloves",
    "cape",
    null,
    null,
    "shoes",
    "android",
    "heart",
] as const;

type EquipSlotId =
    | "ring-1"
    | "ring-2"
    | "ring-3"
    | "ring-4"
    | "pendant-1"
    | "pendant-2"
    | "hat"
    | "emblem"
    | "face"
    | "badge"
    | "eye"
    | "earring"
    | "medal"
    | "weapon"
    | "top"
    | "shoulder"
    | "secondary"
    | "pocket"
    | "belt"
    | "bottom"
    | "gloves"
    | "cape"
    | "shoes"
    | "android"
    | "heart";

type EquipmentSlotLayout = {
    x: number;
    y: number;
};

const EQUIP_TAB_SIZE = { width: 214, height: 256 } as const;
const EQUIP_SLOT_SIZE = 38;

const EQUIP_SLOT_IDS = EQUIP_GRID.filter(Boolean) as EquipSlotId[];

const EQUIP_SLOT_LAYOUTS: Record<EquipSlotId, EquipmentSlotLayout> = {
    "ring-1": { x: 6, y: 6 },
    hat: { x: 88, y: 6 },
    emblem: { x: 170, y: 6 },
    "ring-2": { x: 6, y: 47 },
    "pendant-1": { x: 47, y: 47 },
    face: { x: 88, y: 47 },
    badge: { x: 170, y: 47 },
    "ring-3": { x: 6, y: 88 },
    "pendant-2": { x: 47, y: 88 },
    eye: { x: 88, y: 88 },
    earring: { x: 129, y: 88 },
    medal: { x: 170, y: 88 },
    "ring-4": { x: 6, y: 129 },
    weapon: { x: 47, y: 129 },
    top: { x: 88, y: 129 },
    shoulder: { x: 129, y: 129 },
    secondary: { x: 170, y: 129 },
    pocket: { x: 6, y: 170 },
    belt: { x: 47, y: 170 },
    bottom: { x: 88, y: 170 },
    gloves: { x: 129, y: 170 },
    cape: { x: 170, y: 170 },
    shoes: { x: 88, y: 211 },
    android: { x: 129, y: 211 },
    heart: { x: 170, y: 211 },
};

const getEquipmentSlotLayoutStyle = (layout: EquipmentSlotLayout) => ({
    left: `${(layout.x / EQUIP_TAB_SIZE.width) * 100}%`,
    top: `${(layout.y / EQUIP_TAB_SIZE.height) * 100}%`,
    width: `${(EQUIP_SLOT_SIZE / EQUIP_TAB_SIZE.width) * 100}%`,
    height: `${(EQUIP_SLOT_SIZE / EQUIP_TAB_SIZE.height) * 100}%`,
});

type EquipKind =
    | "ring"
    | "pendant"
    | "hat"
    | "emblem"
    | "face"
    | "badge"
    | "eye"
    | "earring"
    | "medal"
    | "weapon"
    | "top"
    | "shoulder"
    | "secondary"
    | "pocket"
    | "belt"
    | "bottom"
    | "gloves"
    | "cape"
    | "shoes"
    | "android"
    | "heart";

type JobType = "warrior" | "magician" | "archer" | "thief" | "pirate";
type CoreStat = "STR" | "DEX" | "INT" | "LUK";

type EquipmentCatalogItem = {
    id: string;
    baseId: string;
    name: string;
    jobType: JobType | "common";
    jobTypes: JobType[];
    equipType: EquipKind;
    level: number;
    setType: string;
    region: string;
    width: number;
    height: number;
    isNormalFlame: boolean;
    isLuckyItem: boolean;
    itemPriority: number | null;
    stats: Record<string, number>;
    imgPath: string;
};

type SetEffectStat = {
    statId: string;
    val: number;
};

type SetEffectTier = {
    numEquipped: number;
    list: SetEffectStat[];
};

type SetEffectDefinition = {
    jobType: string;
    setType: string;
    level: number;
    effects: SetEffectTier[];
};

type SetEffectGroup = {
    jobType: string;
    list: Omit<SetEffectDefinition, "jobType">[];
};

type EquippedSetSlot = {
    slotId: EquipSlotId;
    slotLabel: string;
    itemId: string;
    itemName: string;
    equipType: EquipKind;
    itemSetType: string;
    isLuckyItem: boolean;
    itemPriority: number | null;
};

type CountedSetEffect = {
    setType: string;
    label: string;
    count: number;
    baseCount: number;
    luckyItem?: EquippedSetSlot;
    equippedItems: EquippedSetSlot[];
    definition?: SetEffectDefinition;
    activeTiers: SetEffectTier[];
    nextTier?: SetEffectTier;
};

const EQUIP_KINDS: EquipKind[] = [
    "ring",
    "pendant",
    "hat",
    "emblem",
    "face",
    "badge",
    "eye",
    "earring",
    "medal",
    "weapon",
    "top",
    "shoulder",
    "secondary",
    "pocket",
    "belt",
    "bottom",
    "gloves",
    "cape",
    "shoes",
    "android",
    "heart",
];

const JOB_TYPES: JobType[] = [
    "warrior",
    "magician",
    "archer",
    "thief",
    "pirate",
];

const DEFAULT_JOB_TYPE: JobType = "warrior";

const JOB_LABELS: Record<JobType, string> = {
    warrior: "Warrior",
    magician: "Magician",
    archer: "Archer",
    thief: "Thief",
    pirate: "Pirate",
};

const CORE_STATS: CoreStat[] = ["STR", "DEX", "INT", "LUK"];

const JOB_DEFAULT_STATS: Record<
    JobType,
    Pick<FlameScoreSettings, "primaryStat" | "secondaryStat">
> = {
    warrior: { primaryStat: "STR", secondaryStat: "DEX" },
    magician: { primaryStat: "INT", secondaryStat: "LUK" },
    archer: { primaryStat: "DEX", secondaryStat: "STR" },
    thief: { primaryStat: "LUK", secondaryStat: "DEX" },
    pirate: { primaryStat: "STR", secondaryStat: "DEX" },
};

const DEFAULT_FLAME_SCORE_SETTINGS: FlameScoreSettings = {
    ...JOB_DEFAULT_STATS[DEFAULT_JOB_TYPE],
    secondaryStatValue: 0.125,
    attackValue: 4,
    allStatPercentValue: 10,
    damageBossPercentValue: 8,
};

const BLACK_FLAME_ICON = "/image/equipment/flames/black-flame.png";

const EQUIPMENT_CATALOG = equipmentItems as unknown as EquipmentCatalogItem[];
const EQUIPMENT_BY_KIND = EQUIPMENT_CATALOG.reduce(
    (groups, item) => {
        groups[item.equipType].push(item);
        return groups;
    },
    Object.fromEntries(
        EQUIP_KINDS.map((kind) => [kind, []])
    ) as unknown as Record<EquipKind, EquipmentCatalogItem[]>
);

const SET_EFFECT_DEFINITIONS = (
    equipmentSetEffects as unknown as SetEffectGroup[]
).flatMap((group) =>
    group.list.map((definition) => ({
        ...definition,
        jobType: group.jobType,
        effects: [...definition.effects].sort(
            (a, b) => a.numEquipped - b.numEquipped
        ),
    }))
);

const SET_EFFECTS_BY_TYPE = SET_EFFECT_DEFINITIONS.reduce(
    (groups, definition) => {
        groups[definition.setType] = groups[definition.setType] || [];
        groups[definition.setType].push(definition);
        return groups;
    },
    {} as Record<string, SetEffectDefinition[]>
);

const SET_EFFECT_LABELS: Record<string, string> = {
    abs: "AbsoLab Set",
    acs: "Arcane Umbra Set",
    bossAcc: "Boss Accessory Set",
    dawnBossAcc: "Dawn Boss Set",
    eternal: "Eternal Set",
    faf: "Root Abyss Set",
    hardBossAcc: "Pitched Boss Set",
    inverse: "Inverse Set",
    meister: "Meister Set",
    monsterPark: "Seven Days Set",
    radiantBossAcc: "Brilliant Boss Set",
    reinforcedGollux: "Reinforced Gollux Set",
    sengoku: "Sengoku Treasure Set",
    "sengoku-era-3": "Sengoku Era 3 Set",
    superiorGollux: "Superior Gollux Set",
};

const SET_STAT_LABELS: Record<string, string> = {
    allStats: "All Stats",
    att: "ATT",
    attmatt: "ATT/MATT",
    bossPercent: "Boss Damage",
    critDmgPercent: "Critical Damage",
    damagePercent: "Damage",
    def: "DEF",
    dex: "DEX",
    iedPercent: "Ignore DEF",
    int: "INT",
    jump: "Jump",
    luk: "LUK",
    matt: "MATT",
    maxHp: "Max HP",
    maxHpMp: "Max HP/MP",
    maxHpMpPercent: "Max HP/MP",
    speed: "Speed",
    str: "STR",
};

const PERCENT_SET_STATS = new Set([
    "bossPercent",
    "critDmgPercent",
    "damagePercent",
    "iedPercent",
    "maxHpMpPercent",
]);

const SET_EFFECT_EQUIP_TYPES = EQUIPMENT_CATALOG.reduce(
    (groups, item) => {
        if (!item.setType || item.setType === "none") {
            return groups;
        }

        groups[item.setType] = groups[item.setType] || new Set<EquipKind>();
        groups[item.setType].add(item.equipType);
        return groups;
    },
    {} as Record<string, Set<EquipKind>>
);

const MAX_STAR_FORCE = 30;
const STAR_GROUP_SIZE = 5;
const STAR_ROW_SIZE = 15;
const MESO_COUNTER_STEPS = [
    { label: "100B", value: 100_000_000_000 },
    { label: "10B", value: 10_000_000_000 },
    { label: "1B", value: 1_000_000_000 },
    { label: "100M", value: 100_000_000 },
];
const MAX_TRACKED_VALUE = Number.MAX_SAFE_INTEGER;
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");
const EQUIPMENT_PRESET_IDS = [
    "preset-1",
    "preset-2",
    "preset-3",
    "preset-4",
    "preset-5",
    "preset-6",
] as const;
const EQUIPMENT_PRESET_LABELS: Record<EquipmentPresetId, string> = {
    "preset-1": "Preset 1",
    "preset-2": "Preset 2",
    "preset-3": "Preset 3",
    "preset-4": "Preset 4",
    "preset-5": "Preset 5",
    "preset-6": "Preset 6",
};

const STAR_FORCE_LEVEL_CAPS = [
    { minLevel: 0, maxLevel: 94, normal: 5, superior: 3 },
    { minLevel: 95, maxLevel: 107, normal: 8, superior: 5 },
    { minLevel: 108, maxLevel: 117, normal: 10, superior: 8 },
    { minLevel: 118, maxLevel: 127, normal: 15, superior: 10 },
    { minLevel: 128, maxLevel: 137, normal: 20, superior: 12 },
    { minLevel: 138, maxLevel: Number.POSITIVE_INFINITY, normal: 30, superior: 15 },
];

type PotentialRank = "none" | "rare" | "epic" | "unique" | "legendary";

const POTENTIAL_LABELS: Record<PotentialRank, string> = {
    none: "None",
    rare: "Rare",
    epic: "Epic",
    unique: "Unique",
    legendary: "Legendary",
};
const POTENTIAL_RANK_VALUES = Object.keys(POTENTIAL_LABELS) as PotentialRank[];

const POTENTIAL_BORDER: Record<PotentialRank, string> = {
    none: "border-slate-500",
    rare: "border-blue-400",
    epic: "border-purple-400",
    unique: "border-yellow-300",
    legendary: "border-lime-300",
};

const FLAME_STATS = [
    "None",
    "STR",
    "DEX",
    "INT",
    "LUK",
    "STR & DEX",
    "STR & INT",
    "STR & LUK",
    "DEX & INT",
    "DEX & LUK",
    "INT & LUK",
    "Max HP",
    "Max MP",
    "ATT",
    "MATT",
    "All Stats %",
    "Boss Damage %",
    "Damage %",
    "IED %",
    "Speed",
    "Jump",
] as const;

const POTENTIAL_PERCENT_VALUES: Record<
    Exclude<PotentialRank, "none">,
    [number, number, number, number]
> = {
    rare: [1, 2, 3, 4],
    epic: [2, 4, 6, 7],
    unique: [3, 6, 9, 10],
    legendary: [4, 8, 12, 13],
};

const POTENTIAL_RANK_ORDER: Exclude<PotentialRank, "none">[] = [
    "rare",
    "epic",
    "unique",
    "legendary",
];

const FLAME_LINE_GRID_CLASS =
    "grid grid-cols-[minmax(128px,1fr)_minmax(238px,auto)_96px] items-center gap-2";
const FLAME_TIERS = [1, 2, 3, 4, 5, 6, 7] as const;

type PotentialBlock = {
    rank: PotentialRank;
    lines: string[];
};

type FlameLine = {
    stat: string;
    tier: number;
    value: number;
};

type EquipmentSlotState = {
    itemId: string;
    itemName: string;
    itemImage: string;
    itemLevel: number;
    itemSetType: string;
    stars: number;
    mesoSpent: number;
    destructionCount: number;
    potential: PotentialBlock;
    bonusPotential: PotentialBlock;
    flames: FlameLine[];
};

type EquipmentPresetId = (typeof EQUIPMENT_PRESET_IDS)[number];

type EquipmentPresetState = {
    selectedJobType: JobType;
    flameScoreSettings: FlameScoreSettings;
    selectedSlotId: EquipSlotId | null;
    equipmentState: Record<EquipSlotId, EquipmentSlotState>;
};

type EquipmentPresetsState = Record<EquipmentPresetId, EquipmentPresetState>;

type EnhancementTotals = {
    mesoSpent: number;
    destructionCount: number;
};

type FlameScoreSettings = {
    primaryStat: CoreStat;
    secondaryStat: CoreStat;
    secondaryStatValue: number;
    attackValue: number;
    allStatPercentValue: number;
    damageBossPercentValue: number;
};

type EquipmentSetupClipboardPayload = {
    type: "mapletools:equipment-setup";
    version: 1;
    jobType: JobType;
    selectedSlotId: EquipSlotId | null;
    flameScoreSettings: FlameScoreSettings;
    equipmentState: Record<EquipSlotId, EquipmentSlotState>;
};

const EQUIPMENT_SETUP_CLIPBOARD_TYPE = "mapletools:equipment-setup";
const EQUIPMENT_SETUP_CLIPBOARD_VERSION = 1;
const EQUIPMENT_SETUP_PRESETS_STORAGE_KEY = "equipmentSetupPresets";
const EQUIPMENT_SETUP_ACTIVE_PRESET_STORAGE_KEY = "equipmentSetupActivePreset";
const LEGACY_EQUIPMENT_SETUP_STORAGE_KEY = "equipmentSetupTracker";

const clampNumber = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

const normalizeCounterValue = (value: unknown) =>
    clampNumber(Math.trunc(Number(value) || 0), 0, MAX_TRACKED_VALUE);

const parseFormattedCounterValue = (value: string) =>
    normalizeCounterValue(value.replace(/[^\d]/g, ""));

const formatInteger = (value: number) => NUMBER_FORMATTER.format(value);

const formatScore = (value: number) =>
    Number.isInteger(value) ? formatInteger(value) : value.toFixed(1);

const isSuperiorEquipment = (
    item?: EquipmentCatalogItem,
    slot?: Pick<EquipmentSlotState, "itemName" | "itemSetType">
) => {
    const itemName = `${item?.name || slot?.itemName || ""}`.toLowerCase();
    const setType = item?.setType || slot?.itemSetType || "";
    const itemId = `${item?.id || item?.baseId || ""}`.toLowerCase();

    if (
        setType === "superiorGollux" ||
        itemId.includes("superior-gollux") ||
        (itemName.includes("superior") && itemName.includes("gollux"))
    ) {
        return false;
    }

    return (
        itemName.includes("superior") ||
        itemName.includes("tyrant") ||
        itemId.includes("tyrant")
    );
};

const getStarForceCap = (level: number, isSuperior: boolean) => {
    const normalizedLevel = Math.max(0, Math.trunc(Number(level) || 0));
    const rule =
        STAR_FORCE_LEVEL_CAPS.find(
            ({ minLevel, maxLevel }) =>
                normalizedLevel >= minLevel && normalizedLevel <= maxLevel
        ) || STAR_FORCE_LEVEL_CAPS[0];

    return isSuperior ? rule.superior : rule.normal;
};

const getSlotStarForceCap = (
    slot: Pick<EquipmentSlotState, "itemLevel" | "itemName" | "itemSetType">,
    item?: EquipmentCatalogItem
) => getStarForceCap(slot.itemLevel, isSuperiorEquipment(item, slot));

const getPotentialLevelBucket = (level: number) => {
    if (level >= 160) {
        return 3;
    }

    if (level >= 71) {
        return 2;
    }

    if (level >= 31) {
        return 1;
    }

    return 0;
};

const getAdjacentPotentialRanks = (rank: PotentialRank) => {
    if (rank === "none") {
        return [];
    }

    const rankIndex = POTENTIAL_RANK_ORDER.indexOf(rank);
    return POTENTIAL_RANK_ORDER.slice(Math.max(0, rankIndex - 1), rankIndex + 1);
};

const getPotentialPercentValues = (rank: PotentialRank, level: number) => {
    if (rank === "none") {
        return [];
    }

    const levelBucket = getPotentialLevelBucket(level);

    return getAdjacentPotentialRanks(rank)
        .map((rankKey) => POTENTIAL_PERCENT_VALUES[rankKey][levelBucket])
        .filter((value, index, values) => values.indexOf(value) === index)
        .sort((a, b) => b - a);
};

const getAllStatPotentialPercentValueForRank = (
    rank: Exclude<PotentialRank, "none">,
    levelBucket: number
) => {
    const rankIndex = POTENTIAL_RANK_ORDER.indexOf(rank);
    if (rankIndex <= 0) {
        return undefined;
    }

    const sourceRank = POTENTIAL_RANK_ORDER[rankIndex - 1];
    return POTENTIAL_PERCENT_VALUES[sourceRank][levelBucket];
};

const getAllStatPotentialPercentValues = (
    rank: PotentialRank,
    level: number
) => {
    if (rank === "none") {
        return [];
    }

    const levelBucket = getPotentialLevelBucket(level);

    return getAdjacentPotentialRanks(rank)
        .map((rankKey) =>
            getAllStatPotentialPercentValueForRank(rankKey, levelBucket)
        )
        .filter((value): value is number => typeof value === "number")
        .filter((value, index, values) => values.indexOf(value) === index)
        .sort((a, b) => b - a);
};

const WEAPON_POTENTIAL_KINDS = new Set<EquipKind>([
    "weapon",
    "secondary",
    "emblem",
]);

const isWeaponPotentialKind = (kind: EquipKind) =>
    WEAPON_POTENTIAL_KINDS.has(kind);

const getAttackStatLabel = (jobType: JobType) =>
    jobType === "magician" ? "MATT" : "ATT";

const getPotentialMetricLabel = (
    kind: EquipKind,
    settings: FlameScoreSettings,
    jobType: JobType
) =>
    isWeaponPotentialKind(kind)
        ? `${getAttackStatLabel(jobType)}/Boss/IED`
        : `${settings.primaryStat}/All`;

const getWeaponPotentialSuggestions = (
    level: number,
    rank: PotentialRank,
    jobType: JobType
) => {
    const values = getPotentialPercentValues(rank, level);
    const attackLabel = getAttackStatLabel(jobType);
    const attackSuggestions = values.map((value) => `${attackLabel} +${value}%`);

    return [
        ...attackSuggestions,
        "Boss Damage +40%",
        "Boss Damage +35%",
        "Boss Damage +30%",
        "Ignore DEF +40%",
        "Ignore DEF +35%",
        "Ignore DEF +30%",
    ];
};

const getPotentialSuggestions = (
    level: number,
    settings: FlameScoreSettings,
    kind: EquipKind,
    rank: PotentialRank,
    jobType: JobType
) => {
    if (rank === "none") {
        return [];
    }

    if (isWeaponPotentialKind(kind)) {
        return getWeaponPotentialSuggestions(level, rank, jobType);
    }

    const values = getPotentialPercentValues(rank, level);
    const allStatValues = getAllStatPotentialPercentValues(rank, level);
    const attackLabel = getAttackStatLabel(jobType);
    const percentSuggestions = values.flatMap((value) => [
        `${settings.primaryStat} +${value}%`,
    ]);
    const criticalDamageSuggestions =
        kind === "gloves" ? ["Critical Damage +8%"] : [];
    const hpMpSuggestions = values.flatMap((value) => [
        `HP +${value}%`,
        `MP +${value}%`,
    ]);

    return [
        ...percentSuggestions,
        ...allStatValues.map((value) => `All Stats +${value}%`),
        ...values.map((value) => `${attackLabel} +${value}%`),
        ...criticalDamageSuggestions,
        ...hpMpSuggestions,
        "Boss Damage +40%",
        "Ignore DEF +40%",
        "Item Drop Rate +20%",
        "Meso Obtained +20%",
        "Cooldown -2 sec",
    ];
};

type PotentialStatTotals = {
    attackPercent: number;
    bossPercent: number;
    ignorePercent: number;
    generalPercent: number;
    criticalDamagePercent: number;
    hasAllStatPercent: boolean;
};

const emptyPotentialStatTotals = (): PotentialStatTotals => ({
    attackPercent: 0,
    bossPercent: 0,
    ignorePercent: 0,
    generalPercent: 0,
    criticalDamagePercent: 0,
    hasAllStatPercent: false,
});

const getFirstPotentialPercentValue = (line: string) => {
    const percentMatch = line.match(/([+-]?\d+(?:\.\d+)?)\s*%/);
    if (!percentMatch) {
        return 0;
    }

    const value = Number(percentMatch[1]);
    return Number.isFinite(value) ? value : 0;
};

const getShortPotentialTokenTotal = (line: string, token: "b" | "i") => {
    const pattern = new RegExp(
        `(?:^|[\\s,+/])${token}\\s*([+-]?\\d+(?:\\.\\d+)?)\\s*%`,
        "gi"
    );
    let total = 0;

    for (const match of line.matchAll(pattern)) {
        const value = Number(match[1]);
        if (Number.isFinite(value)) {
            total += value;
        }
    }

    return total;
};

const isAttackPotentialLine = (normalizedLine: string) =>
    /\b(?:att|matt|attack|magic attack)\b/.test(normalizedLine) ||
    normalizedLine.includes("공격력") ||
    normalizedLine.includes("마력");

const isBossPotentialLine = (normalizedLine: string) =>
    normalizedLine.includes("boss") || normalizedLine.includes("보스");

const isIgnorePotentialLine = (normalizedLine: string) =>
    normalizedLine.includes("ignore") ||
    normalizedLine.includes("ied") ||
    normalizedLine.includes("방무") ||
    normalizedLine.includes("방어율");

const isAllStatPotentialLine = (normalizedLine: string) =>
    normalizedLine.includes("all stat") ||
    normalizedLine.includes("allstat") ||
    normalizedLine.includes("all stats") ||
    normalizedLine.includes("올스탯") ||
    normalizedLine.includes("올스텟");

const isCriticalDamagePotentialLine = (normalizedLine: string) =>
    normalizedLine.includes("critical damage") ||
    normalizedLine.includes("crit damage") ||
    normalizedLine.includes("크리티컬 데미지") ||
    normalizedLine.includes("크뎀");

const isHpMpPotentialLine = (normalizedLine: string) =>
    /\b(?:max hp|hp|max mp|mp)\b/.test(normalizedLine) ||
    normalizedLine.includes("최대 hp") ||
    normalizedLine.includes("최대 mp");

const parsePotentialLineStats = (
    line: string,
    settings: FlameScoreSettings,
    kind: EquipKind
): PotentialStatTotals => {
    const totals = emptyPotentialStatTotals();
    const normalizedLine = line.toLowerCase();
    const value = getFirstPotentialPercentValue(normalizedLine);

    if (isWeaponPotentialKind(kind)) {
        const shortBossTotal = getShortPotentialTokenTotal(normalizedLine, "b");
        const shortIgnoreTotal = getShortPotentialTokenTotal(
            normalizedLine,
            "i"
        );
        const isAttackLine = isAttackPotentialLine(normalizedLine);
        const isBossLine = isBossPotentialLine(normalizedLine);
        const isIgnoreLine = isIgnorePotentialLine(normalizedLine);

        if (isBossLine) {
            totals.bossPercent += value;
        } else {
            totals.bossPercent += shortBossTotal;
        }

        if (isIgnoreLine) {
            totals.ignorePercent += value;
        } else {
            totals.ignorePercent += shortIgnoreTotal;
        }

        if (isAttackLine || /^\s*[+-]?\d+(?:\.\d+)?\s*%/.test(line)) {
            totals.attackPercent += value;
        }

        return totals;
    }

    const primary = settings.primaryStat.toLowerCase();
    const isPrimaryStatLine = normalizedLine.includes(primary);
    const isAllStatLine = isAllStatPotentialLine(normalizedLine);
    const isCriticalDamageLine = isCriticalDamagePotentialLine(normalizedLine);

    if (kind === "gloves" && isCriticalDamageLine) {
        totals.criticalDamagePercent += value;
    }

    if (isPrimaryStatLine || isAllStatLine) {
        totals.generalPercent += value;
    }
    if (isAllStatLine && value > 0) {
        totals.hasAllStatPercent = true;
    }

    return totals;
};

const addPotentialStatTotals = (
    total: PotentialStatTotals,
    next: PotentialStatTotals
) => ({
    attackPercent: total.attackPercent + next.attackPercent,
    bossPercent: total.bossPercent + next.bossPercent,
    ignorePercent: total.ignorePercent + next.ignorePercent,
    generalPercent: total.generalPercent + next.generalPercent,
    criticalDamagePercent:
        total.criticalDamagePercent + next.criticalDamagePercent,
    hasAllStatPercent: total.hasAllStatPercent || next.hasAllStatPercent,
});

const calculatePotentialStats = (
    lines: string[],
    settings: FlameScoreSettings,
    kind: EquipKind
) =>
    lines.reduce(
        (total, line) =>
            addPotentialStatTotals(
                total,
                parsePotentialLineStats(line, settings, kind)
            ),
        emptyPotentialStatTotals()
    );

const calculateSlotPotentialStats = (
    slot: EquipmentSlotState,
    settings: FlameScoreSettings,
    kind: EquipKind
) =>
    calculatePotentialStats(
        [...slot.potential.lines, ...slot.bonusPotential.lines],
        settings,
        kind
    );

const calculateEnhancementTotals = (
    equipmentState: Record<EquipSlotId, EquipmentSlotState>
): EnhancementTotals =>
    EQUIP_SLOT_IDS.reduce(
        (totals, slotId) => ({
            mesoSpent:
                totals.mesoSpent + equipmentState[slotId].mesoSpent,
            destructionCount:
                totals.destructionCount +
                equipmentState[slotId].destructionCount,
        }),
        { mesoSpent: 0, destructionCount: 0 }
    );

const formatGeneralPotentialPercent = (stats: PotentialStatTotals) =>
    `${formatScore(stats.generalPercent)}%${stats.hasAllStatPercent ? "+" : ""}`;

const formatPotentialStats = (
    stats: PotentialStatTotals,
    kind: EquipKind
) => {
    if (!isWeaponPotentialKind(kind)) {
        const parts = [];
        if (kind === "gloves" && stats.criticalDamagePercent > 0) {
            parts.push(`Crit ${formatScore(stats.criticalDamagePercent)}%`);
        }
        if (stats.generalPercent > 0) {
            parts.push(formatGeneralPotentialPercent(stats));
        }

        return parts.length > 0 ? parts.join(" / ") : "0%";
    }

    const parts = [];
    if (stats.attackPercent > 0) {
        parts.push(`${formatScore(stats.attackPercent)}%`);
    }
    if (stats.bossPercent > 0) {
        parts.push(`B${formatScore(stats.bossPercent)}%`);
    }
    if (stats.ignorePercent > 0) {
        parts.push(`I${formatScore(stats.ignorePercent)}%`);
    }

    return parts.length > 0 ? parts.join(" ") : "0%";
};

const getPotentialGridBadges = (
    stats: PotentialStatTotals,
    kind: EquipKind
) => {
    if (!isWeaponPotentialKind(kind)) {
        return [
            {
                kind: "critical" as const,
                value: stats.criticalDamagePercent,
                title: "Critical Damage",
                isVisible: kind === "gloves",
            },
            {
                kind: "general" as const,
                value: stats.generalPercent,
                label: formatGeneralPotentialPercent(stats),
                title: "Potential",
                isVisible: true,
            },
        ]
            .filter(({ isVisible, value }) => isVisible && value > 0)
            .map(({ kind, value, label, title }) => ({
                kind,
                value: label || `${formatScore(value)}%`,
                title,
            }));
    }

    return [
        {
            kind: "attack" as const,
            label: "",
            value: stats.attackPercent,
            title: "Attack",
        },
        {
            kind: "boss" as const,
            label: "",
            value: stats.bossPercent,
            title: "Boss Damage",
        },
        {
            kind: "ignore" as const,
            label: "",
            value: stats.ignorePercent,
            title: "Ignore Defense",
        },
    ]
        .filter(({ value }) => value > 0)
        .map(({ kind, label, value, title }) => ({
            kind,
            label,
            value: `${label}${formatScore(value)}%`,
            title,
        }));
};

const getPotentialRankIndex = (rank: PotentialRank) =>
    rank === "none" ? -1 : POTENTIAL_RANK_ORDER.indexOf(rank);

const getPotentialRankFromIndex = (index: number): PotentialRank =>
    index < 0
        ? "none"
        : POTENTIAL_RANK_ORDER[
              clampNumber(index, 0, POTENTIAL_RANK_ORDER.length - 1)
          ];

const maxPotentialRank = (
    currentRank: PotentialRank,
    nextRank: PotentialRank
) =>
    getPotentialRankIndex(nextRank) > getPotentialRankIndex(currentRank)
        ? nextRank
        : currentRank;

const inferRankFromPotentialPercent = (
    value: number,
    level: number,
    rankOffset = 0
) => {
    if (!Number.isFinite(value) || value <= 0) {
        return "none" as PotentialRank;
    }

    if (rankOffset > 0 && value >= 9) {
        return "legendary";
    }

    if (rankOffset === 0 && value >= 12) {
        return "legendary";
    }

    const levelBucket = getPotentialLevelBucket(level);
    let inferredIndex = -1;

    POTENTIAL_RANK_ORDER.forEach((rank, index) => {
        const rankValue = POTENTIAL_PERCENT_VALUES[rank][levelBucket];
        if (value >= rankValue) {
            inferredIndex = Math.max(inferredIndex, index + rankOffset);
        }
    });

    return getPotentialRankFromIndex(inferredIndex);
};

const inferBossIgnorePotentialRank = (value: number) => {
    if (value >= 35) {
        return "legendary";
    }

    if (value >= 30) {
        return "unique";
    }

    if (value >= 20) {
        return "epic";
    }

    return "none";
};

const inferPotentialLineRank = (
    line: string,
    settings: FlameScoreSettings,
    kind: EquipKind,
    itemLevel: number
): PotentialRank => {
    const normalizedLine = line.toLowerCase();
    const value = getFirstPotentialPercentValue(normalizedLine);
    const shortBossTotal = getShortPotentialTokenTotal(normalizedLine, "b");
    const shortIgnoreTotal = getShortPotentialTokenTotal(normalizedLine, "i");
    let rank: PotentialRank = "none";

    if (shortBossTotal > 0) {
        rank = maxPotentialRank(rank, inferBossIgnorePotentialRank(shortBossTotal));
    }
    if (shortIgnoreTotal > 0) {
        rank = maxPotentialRank(
            rank,
            inferBossIgnorePotentialRank(shortIgnoreTotal)
        );
    }

    if (isBossPotentialLine(normalizedLine)) {
        return maxPotentialRank(rank, inferBossIgnorePotentialRank(value));
    }

    if (isIgnorePotentialLine(normalizedLine)) {
        return maxPotentialRank(rank, inferBossIgnorePotentialRank(value));
    }

    if (isAllStatPotentialLine(normalizedLine)) {
        return maxPotentialRank(
            rank,
            inferRankFromPotentialPercent(value, itemLevel, 1)
        );
    }

    if (kind === "gloves" && isCriticalDamagePotentialLine(normalizedLine)) {
        return maxPotentialRank(rank, value >= 8 ? "legendary" : "none");
    }

    const primary = settings.primaryStat.toLowerCase();
    if (
        isHpMpPotentialLine(normalizedLine) ||
        isAttackPotentialLine(normalizedLine) ||
        normalizedLine.includes(primary) ||
        (isWeaponPotentialKind(kind) &&
            /^\s*[+-]?\d+(?:\.\d+)?\s*%/.test(line))
    ) {
        return maxPotentialRank(
            rank,
            inferRankFromPotentialPercent(value, itemLevel)
        );
    }

    return rank;
};

const inferPotentialBlockRank = (
    block: PotentialBlock,
    settings: FlameScoreSettings,
    kind: EquipKind,
    itemLevel: number
): PotentialRank =>
    block.lines.reduce<PotentialRank>(
        (rank, line) =>
            maxPotentialRank(
                rank,
                inferPotentialLineRank(line, settings, kind, itemLevel)
            ),
        "none" as PotentialRank
    );

const getSingleStatFlameUnit = (level: number) => {
    const normalizedLevel = Math.max(0, Math.trunc(Number(level) || 0));

    return normalizedLevel >= 230
        ? 12
        : Math.floor(normalizedLevel / 20) + 1;
};

const getMixedStatFlameUnit = (level: number) => {
    const normalizedLevel = Math.max(0, Math.trunc(Number(level) || 0));

    return normalizedLevel >= 250
        ? 7
        : Math.floor(normalizedLevel / 40) + 1;
};

const getHpMpFlameUnit = (level: number) => {
    const normalizedLevel = Math.max(0, Math.trunc(Number(level) || 0));

    if (normalizedLevel < 10) {
        return 3;
    }

    if (normalizedLevel >= 200) {
        const decade = Math.min(25, Math.floor(normalizedLevel / 10));
        return 600 + (decade - 20) * 20;
    }

    return Math.floor(normalizedLevel / 10) * 30;
};

const getWeaponAttackFlameValue = (
    baseAttack: number,
    level: number,
    tier: number,
    isFlameAdvantaged: boolean
) => {
    if (!baseAttack) {
        return 0;
    }

    const levelUnit = Math.min(
        7,
        Math.floor(Math.max(0, Math.trunc(level)) / 40) + 1
    );
    const exponentBase = isFlameAdvantaged ? 3 : 1;
    const percent =
        levelUnit * tier * Math.pow(1.1, Math.max(0, tier - exponentBase));

    return Math.floor((baseAttack * percent) / 100);
};

const getFlameCoreStatParts = (stat: string) =>
    stat
        .split(" & ")
        .filter((part): part is CoreStat =>
            CORE_STATS.includes(part as CoreStat)
        );

const calculateFlameLineValue = (
    line: FlameLine,
    slot: EquipmentSlotState,
    catalogItem?: EquipmentCatalogItem
) => {
    const tier = clampNumber(Math.trunc(Number(line.tier) || 0), 0, 7);

    if (tier === 0 || line.stat === "None") {
        return 0;
    }

    const coreStatParts = getFlameCoreStatParts(line.stat);

    if (coreStatParts.length > 0) {
        const statUnit =
            coreStatParts.length === 1
                ? getSingleStatFlameUnit(slot.itemLevel)
                : getMixedStatFlameUnit(slot.itemLevel);

        return statUnit * tier;
    }

    if (line.stat === "Max HP" || line.stat === "Max MP") {
        return getHpMpFlameUnit(slot.itemLevel) * tier;
    }

    if (line.stat === "ATT" || line.stat === "MATT") {
        if (catalogItem?.equipType === "weapon") {
            const baseAttack =
                Number(
                    line.stat === "ATT"
                        ? catalogItem.stats.att
                        : catalogItem.stats.matt
                ) || 0;

            return getWeaponAttackFlameValue(
                baseAttack,
                slot.itemLevel,
                tier,
                !catalogItem.isNormalFlame
            );
        }

        return tier;
    }

    if (line.stat === "Boss Damage %") {
        return tier * 2;
    }

    if (
        line.stat === "All Stats %" ||
        line.stat === "Damage %" ||
        line.stat === "IED %" ||
        line.stat === "Speed" ||
        line.stat === "Jump"
    ) {
        return tier;
    }

    return 0;
};

const getFlameLineValueLabel = (
    line: FlameLine,
    slot: EquipmentSlotState,
    catalogItem?: EquipmentCatalogItem
) => {
    const value = calculateFlameLineValue(line, slot, catalogItem);
    const coreStatParts = getFlameCoreStatParts(line.stat);
    const suffix = line.stat.includes("%") ? "%" : "";

    if (coreStatParts.length > 1 && value > 0) {
        return `${formatInteger(value)} each`;
    }

    return `${formatInteger(value)}${suffix}`;
};

const calculateFlameScore = (
    slot: EquipmentSlotState,
    settings: FlameScoreSettings,
    catalogItem?: EquipmentCatalogItem
) =>
    slot.flames.reduce((total, line) => {
        const stat = line.stat.toLowerCase();
        const value = calculateFlameLineValue(line, slot, catalogItem);
        const coreStatParts = getFlameCoreStatParts(line.stat);

        if (coreStatParts.length > 0) {
            const primaryScore = coreStatParts.includes(settings.primaryStat)
                ? value
                : 0;
            const secondaryScore = coreStatParts.includes(settings.secondaryStat)
                ? value * settings.secondaryStatValue
                : 0;

            return total + primaryScore + secondaryScore;
        }

        if (stat === "att" || stat === "matt") {
            return total + value * settings.attackValue;
        }

        if (stat === "all stats %") {
            return total + value * settings.allStatPercentValue;
        }

        if (stat === "damage %" || stat === "boss damage %") {
            return total + value * settings.damageBossPercentValue;
        }

        return total;
    }, 0);

const applyJobDefaultsToFlameSettings = (
    settings: FlameScoreSettings,
    jobType: JobType
) => ({
    ...settings,
    ...JOB_DEFAULT_STATS[jobType],
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isJobType = (value: unknown): value is JobType =>
    typeof value === "string" && JOB_TYPES.includes(value as JobType);

const isEquipSlotId = (value: unknown): value is EquipSlotId =>
    typeof value === "string" && EQUIP_SLOT_IDS.includes(value as EquipSlotId);

const isEquipmentPresetId = (value: unknown): value is EquipmentPresetId =>
    typeof value === "string" &&
    EQUIPMENT_PRESET_IDS.includes(value as EquipmentPresetId);

const isPotentialRank = (value: unknown): value is PotentialRank =>
    typeof value === "string" &&
    POTENTIAL_RANK_VALUES.includes(value as PotentialRank);

const isFlameStat = (value: unknown): value is (typeof FLAME_STATS)[number] =>
    typeof value === "string" &&
    FLAME_STATS.includes(value as (typeof FLAME_STATS)[number]);

const isEquipmentAvailableForJob = (
    item: EquipmentCatalogItem,
    jobType: JobType
) =>
    item.jobType === "common" ||
    item.jobType === jobType ||
    item.jobTypes?.includes(jobType);

const getFilteredCatalogItems = (kind: EquipKind, jobType: JobType) =>
    EQUIPMENT_BY_KIND[kind].filter((item) =>
        isEquipmentAvailableForJob(item, jobType)
    );

const getSetEffectLabel = (setType: string) =>
    SET_EFFECT_LABELS[setType] || setType;

const formatSetEffectStat = (stat: SetEffectStat) => {
    const label = SET_STAT_LABELS[stat.statId] || stat.statId;
    const suffix = PERCENT_SET_STATS.has(stat.statId) ? "%" : "";
    return `${label} +${formatInteger(stat.val)}${suffix}`;
};

const aggregateSetEffectStats = (tiers: SetEffectTier[]) => {
    const totals = new Map<string, number>();

    for (const tier of tiers) {
        for (const stat of tier.list) {
            totals.set(stat.statId, (totals.get(stat.statId) || 0) + stat.val);
        }
    }

    return [...totals.entries()]
        .map(([statId, val]) => ({ statId, val }))
        .sort((a, b) =>
            (SET_STAT_LABELS[a.statId] || a.statId).localeCompare(
                SET_STAT_LABELS[b.statId] || b.statId
            )
        );
};

const chooseSetEffectDefinition = (
    setType: string,
    jobType: JobType
) => {
    const definitions = SET_EFFECTS_BY_TYPE[setType] || [];

    if (definitions.length <= 1) {
        return definitions[0];
    }

    return (
        definitions.find((definition) => definition.jobType === jobType) ||
        definitions.find((definition) => definition.jobType === DEFAULT_JOB_TYPE) ||
        definitions[0]
    );
};

const getCountedSetEffects = (
    equipmentState: Record<EquipSlotId, EquipmentSlotState>,
    jobType: JobType
) => {
    const slotsBySet = new Map<string, EquippedSetSlot[]>();
    const luckyItems: EquippedSetSlot[] = [];

    for (const slotId of EQUIP_SLOT_IDS) {
        const slot = equipmentState[slotId];
        const item = getCatalogItem(slotKind(slotId), slot.itemId, jobType);
        const setType = slot.itemSetType;
        const equippedItem = {
            slotId,
            slotLabel: SLOT_LABELS[slotId],
            itemId: slot.itemId,
            itemName: slot.itemName,
            equipType: slotKind(slotId),
            itemSetType: setType,
            isLuckyItem: Boolean(item?.isLuckyItem),
            itemPriority: item?.itemPriority ?? null,
        };

        if (equippedItem.isLuckyItem) {
            luckyItems.push(equippedItem);
        }

        if (!setType || setType === "none") {
            continue;
        }

        const equippedItems = slotsBySet.get(setType) || [];
        equippedItems.push(equippedItem);
        slotsBySet.set(setType, equippedItems);
    }

    const rankedLuckyItems = luckyItems.sort(
        (a, b) =>
            (a.itemPriority ?? Number.POSITIVE_INFINITY) -
            (b.itemPriority ?? Number.POSITIVE_INFINITY)
    );
    const canLuckyItemApplyToSet = (
        luckyItem: EquippedSetSlot,
        setType: string,
        baseCount: number
    ) =>
        luckyItem.itemSetType !== setType &&
        baseCount >= 3 &&
        SET_EFFECT_EQUIP_TYPES[setType]?.has(luckyItem.equipType);
    const activeLuckyItem = rankedLuckyItems.find((luckyItem) =>
        [...slotsBySet.entries()].some(([setType, equippedItems]) =>
            canLuckyItemApplyToSet(luckyItem, setType, equippedItems.length)
        )
    );

    return [...slotsBySet.entries()]
        .map(([setType, equippedItems]) => {
            const definition = chooseSetEffectDefinition(setType, jobType);
            const baseCount = equippedItems.length;
            const canUseLuckyItem =
                activeLuckyItem &&
                canLuckyItemApplyToSet(activeLuckyItem, setType, baseCount);
            const count = baseCount + (canUseLuckyItem ? 1 : 0);
            const effectiveEquippedItems = canUseLuckyItem
                ? [...equippedItems, activeLuckyItem]
                : equippedItems;
            const activeTiers =
                definition?.effects.filter(
                    (effect) => effect.numEquipped <= count
                ) || [];
            const nextTier = definition?.effects.find(
                (effect) => effect.numEquipped > count
            );

            return {
                setType,
                label: getSetEffectLabel(setType),
                count,
                baseCount,
                luckyItem: canUseLuckyItem
                    ? activeLuckyItem
                    : undefined,
                equippedItems: effectiveEquippedItems,
                definition,
                activeTiers,
                nextTier,
            };
        })
        .sort((a, b) => {
            const activeDelta = b.activeTiers.length - a.activeTiers.length;
            if (activeDelta !== 0) {
                return activeDelta;
            }

            return b.count - a.count || a.label.localeCompare(b.label);
        });
};

const slotKind = (slotId: EquipSlotId): EquipKind =>
    slotId.split("-")[0] as EquipKind;

const SLOT_LABELS: Record<EquipSlotId, string> = {
    "ring-1": "Ring 1",
    "ring-2": "Ring 2",
    "ring-3": "Ring 3",
    "ring-4": "Ring 4",
    "pendant-1": "Pendant 1",
    "pendant-2": "Pendant 2",
    hat: "Hat",
    emblem: "Emblem",
    face: "Face Accessory",
    badge: "Badge",
    eye: "Eye Accessory",
    earring: "Earring",
    medal: "Medal",
    weapon: "Weapon",
    top: "Top",
    shoulder: "Shoulder",
    secondary: "Secondary",
    pocket: "Pocket",
    belt: "Belt",
    bottom: "Bottom",
    gloves: "Gloves",
    cape: "Cape",
    shoes: "Shoes",
    android: "Android",
    heart: "Mechanical Heart",
};

const DEFAULT_ITEMS: Partial<Record<EquipKind, string>> = {
    ring: "superior-gollux-ring",
    pendant: "dom-pendant",
    hat: "faf-warrior-hat",
    emblem: "mithra-rage-warrior",
    face: "twilight-mark",
    badge: "ventus-badge",
    eye: "papulatus-mark",
    earring: "superior-gollux-earrings",
    medal: "seven-day-monster-parker",
    weapon: "genesis-tuner",
    top: "faf-warrior-top",
    shoulder: "acs-shoulder",
    secondary: "astra-bracelet",
    pocket: "phg",
    belt: "superior-gollux-belt",
    bottom: "faf-warrior-bottom",
    gloves: "acs-gloves",
    cape: "acs-cape",
    shoes: "acs-shoes",
    android: "broid",
    heart: "fairy-heart",
};

const DEFAULT_SLOT_ITEMS: Partial<Record<EquipSlotId, string>> = {
    "ring-4": "ring-of-restraint",
    eye: "black-bean-mark",
};

const noFlameKinds = new Set<EquipKind>([
    "ring",
    "emblem",
    "badge",
    "medal",
    "android",
    "heart",
    "secondary",
]);

const emptyPotential = (): PotentialBlock => ({
    rank: "none",
    lines: ["", "", ""],
});

const emptyFlames = (): FlameLine[] =>
    Array.from({ length: 4 }, () => ({ stat: "None", tier: 0, value: 0 }));

const getCatalogItem = (
    kind: EquipKind,
    itemId: string,
    jobType: JobType = DEFAULT_JOB_TYPE
) =>
    EQUIPMENT_BY_KIND[kind].find((item) => item.id === itemId) ||
    EQUIPMENT_BY_KIND[kind].find(
        (item) =>
            item.baseId === itemId && isEquipmentAvailableForJob(item, jobType)
    ) ||
    EQUIPMENT_BY_KIND[kind].find((item) => item.baseId === itemId);

const JOB_DEFAULT_ITEMS: Record<JobType, Partial<Record<EquipKind, string>>> = {
    warrior: {
        hat: "faf-warrior-hat",
        top: "faf-warrior-top",
        bottom: "faf-warrior-bottom",
        weapon: "genesis-longsword",
    },
    magician: {
        hat: "faf-mage-hat",
        top: "faf-mage-top",
        bottom: "faf-mage-bottom",
        weapon: "genesis-staff",
    },
    archer: {
        hat: "faf-archer-hat",
        top: "faf-archer-top",
        bottom: "faf-archer-bottom",
        weapon: "genesis-bow",
    },
    thief: {
        hat: "faf-thief-hat",
        top: "faf-thief-top",
        bottom: "faf-thief-bottom",
        weapon: "genesis-dagger",
    },
    pirate: {
        hat: "faf-pirate-hat",
        top: "faf-pirate-top",
        bottom: "faf-pirate-bottom",
        weapon: "genesis-knuckle",
    },
};

const getDefaultCatalogItem = (
    slotId: EquipSlotId,
    kind: EquipKind,
    jobType: JobType
) =>
    getCatalogItem(kind, DEFAULT_SLOT_ITEMS[slotId] || "", jobType) ||
    getCatalogItem(kind, JOB_DEFAULT_ITEMS[jobType][kind] || "", jobType) ||
    getCatalogItem(kind, DEFAULT_ITEMS[kind] || "", jobType) ||
    getFilteredCatalogItems(kind, jobType)[0] ||
    EQUIPMENT_BY_KIND[kind][0];

const createEmptySlot = (
    slotId: EquipSlotId,
    jobType: JobType = DEFAULT_JOB_TYPE
): EquipmentSlotState => {
    const kind = slotKind(slotId);
    const item = getDefaultCatalogItem(slotId, kind, jobType);

    return {
        itemId: item?.id || "",
        itemName: item?.name || SLOT_LABELS[slotId],
        itemImage: item?.imgPath || `/image/equipment/icons/${kind}.png`,
        itemLevel: item?.level || 0,
        itemSetType: item?.setType || "none",
        stars: 0,
        mesoSpent: 0,
        destructionCount: 0,
        potential: emptyPotential(),
        bonusPotential: emptyPotential(),
        flames: emptyFlames(),
    };
};

const createInitialState = (
    jobType: JobType = DEFAULT_JOB_TYPE
): Record<EquipSlotId, EquipmentSlotState> =>
    Object.fromEntries(
        EQUIP_SLOT_IDS.map((slotId) => [slotId, createEmptySlot(slotId, jobType)])
    ) as Record<EquipSlotId, EquipmentSlotState>;

const createInitialPresetState = (
    jobType: JobType = DEFAULT_JOB_TYPE
): EquipmentPresetState => ({
    selectedJobType: jobType,
    flameScoreSettings: normalizeFlameScoreSettings(undefined, jobType),
    selectedSlotId: null,
    equipmentState: createInitialState(jobType),
});

const createInitialPresets = (
    jobType: JobType = DEFAULT_JOB_TYPE
): EquipmentPresetsState =>
    Object.fromEntries(
        EQUIPMENT_PRESET_IDS.map((presetId) => [
            presetId,
            createInitialPresetState(jobType),
        ])
    ) as EquipmentPresetsState;

const loadStoredJobType = (): JobType => {
    if (typeof window === "undefined") {
        return DEFAULT_JOB_TYPE;
    }

    const storedJobType = window.localStorage.getItem("equipmentSetupJobType");
    return isJobType(storedJobType) ? storedJobType : DEFAULT_JOB_TYPE;
};

const isCoreStat = (value: unknown): value is CoreStat =>
    typeof value === "string" && CORE_STATS.includes(value as CoreStat);

const normalizeScoreRatio = (value: unknown, fallback: number) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? Math.max(numericValue, 0) : fallback;
};

const normalizeFlameScoreSettings = (
    rawSettings: Partial<Record<keyof FlameScoreSettings, unknown>> | undefined,
    jobType: JobType
): FlameScoreSettings => {
    const defaults = applyJobDefaultsToFlameSettings(
        DEFAULT_FLAME_SCORE_SETTINGS,
        jobType
    );
    const settings = rawSettings || {};

    return {
        primaryStat: isCoreStat(settings.primaryStat)
            ? settings.primaryStat
            : defaults.primaryStat,
        secondaryStat: isCoreStat(settings.secondaryStat)
            ? settings.secondaryStat
            : defaults.secondaryStat,
        secondaryStatValue: normalizeScoreRatio(
            settings.secondaryStatValue,
            defaults.secondaryStatValue
        ),
        attackValue: normalizeScoreRatio(settings.attackValue, defaults.attackValue),
        allStatPercentValue: normalizeScoreRatio(
            settings.allStatPercentValue,
            defaults.allStatPercentValue
        ),
        damageBossPercentValue: normalizeScoreRatio(
            settings.damageBossPercentValue,
            defaults.damageBossPercentValue
        ),
    };
};

const loadStoredFlameScoreSettings = (
    jobType: JobType
): FlameScoreSettings => {
    const defaults = normalizeFlameScoreSettings(undefined, jobType);

    if (typeof window === "undefined") {
        return defaults;
    }

    try {
        const rawSettings = window.localStorage.getItem(
            "equipmentFlameScoreSettings"
        );

        if (!rawSettings) {
            return defaults;
        }

        const parsedSettings = JSON.parse(rawSettings);

        return normalizeFlameScoreSettings(
            isRecord(parsedSettings)
                ? (parsedSettings as Partial<
                      Record<keyof FlameScoreSettings, unknown>
                  >)
                : undefined,
            jobType
        );
    } catch {
        return defaults;
    }
};

const normalizePotentialLines = (lines: unknown, fallbackLines: string[]) =>
    Array.from({ length: 3 }, (_, index) =>
        Array.isArray(lines) && typeof lines[index] === "string"
            ? lines[index]
            : fallbackLines[index] || ""
    );

const normalizePotentialBlock = (
    block: unknown,
    fallbackBlock: PotentialBlock
): PotentialBlock => {
    const rawBlock = isRecord(block) ? block : {};

    return {
        rank: isPotentialRank(rawBlock.rank)
            ? rawBlock.rank
            : fallbackBlock.rank,
        lines: normalizePotentialLines(rawBlock.lines, fallbackBlock.lines),
    };
};

const normalizeFlameLines = (
    flames: unknown,
    fallbackFlames: FlameLine[]
): FlameLine[] =>
    Array.from({ length: 4 }, (_, index) => {
        const rawLine =
            Array.isArray(flames) && isRecord(flames[index])
                ? flames[index]
                : {};
        const fallbackLine = fallbackFlames[index] || {
            stat: "None",
            tier: 0,
            value: 0,
        };
        const stat = isFlameStat(rawLine.stat)
            ? rawLine.stat
            : fallbackLine.stat;

        return {
            stat,
            tier:
                stat === "None"
                    ? 0
                    : clampNumber(
                          Math.trunc(Number(rawLine.tier ?? fallbackLine.tier) || 0),
                          0,
                          7
                      ),
            value: normalizeCounterValue(rawLine.value ?? fallbackLine.value),
        };
    });

const normalizeEquipmentState = (
    jobType: JobType = DEFAULT_JOB_TYPE,
    rawState?: unknown
): Record<EquipSlotId, EquipmentSlotState> => {
    const initialState = createInitialState(jobType);
    const parsedState = isRecord(rawState) ? rawState : {};

    return Object.fromEntries(
        EQUIP_SLOT_IDS.map((slotId) => {
            const storedSlot = isRecord(parsedState[slotId])
                ? parsedState[slotId]
                : {};
            const fallbackSlot = initialState[slotId];
            const kind = slotKind(slotId);
            const storedItemId =
                typeof storedSlot.itemId === "string" ? storedSlot.itemId : "";
            const storedCatalogItem = storedItemId
                ? getCatalogItem(kind, storedItemId, jobType)
                : undefined;
            const storedItemLevel = Number(storedSlot.itemLevel);
            const itemName =
                (typeof storedSlot.itemName === "string" &&
                    storedSlot.itemName) ||
                storedCatalogItem?.name ||
                fallbackSlot.itemName;
            const itemLevel =
                storedCatalogItem?.level ||
                (Number.isFinite(storedItemLevel)
                    ? storedItemLevel
                    : fallbackSlot.itemLevel);
            const itemSetType =
                storedCatalogItem?.setType ||
                (typeof storedSlot.itemSetType === "string" &&
                    storedSlot.itemSetType) ||
                fallbackSlot.itemSetType;
            const starForceCap = getSlotStarForceCap(
                {
                    itemName,
                    itemLevel,
                    itemSetType,
                },
                storedCatalogItem
            );

            return [
                slotId,
                {
                    itemId: storedCatalogItem?.id || storedItemId || fallbackSlot.itemId,
                    itemName,
                    itemImage:
                        storedCatalogItem?.imgPath ||
                        (typeof storedSlot.itemImage === "string" &&
                            storedSlot.itemImage) ||
                        fallbackSlot.itemImage,
                    itemLevel,
                    itemSetType,
                    stars: clampNumber(
                        Math.trunc(Number(storedSlot.stars ?? fallbackSlot.stars) || 0),
                        0,
                        starForceCap
                    ),
                    mesoSpent: normalizeCounterValue(
                        storedSlot.mesoSpent ?? fallbackSlot.mesoSpent
                    ),
                    destructionCount: normalizeCounterValue(
                        storedSlot.destructionCount ??
                            fallbackSlot.destructionCount
                    ),
                    potential: normalizePotentialBlock(
                        storedSlot.potential,
                        fallbackSlot.potential
                    ),
                    bonusPotential: normalizePotentialBlock(
                        storedSlot.bonusPotential,
                        fallbackSlot.bonusPotential
                    ),
                    flames: normalizeFlameLines(
                        storedSlot.flames,
                        fallbackSlot.flames
                    ),
                },
            ];
        })
    ) as Record<EquipSlotId, EquipmentSlotState>;
};

const normalizeEquipmentPresetState = (
    jobType: JobType = DEFAULT_JOB_TYPE,
    fallbackFlameScoreSettings: FlameScoreSettings = normalizeFlameScoreSettings(
        undefined,
        jobType
    ),
    rawPreset?: unknown
): EquipmentPresetState => {
    const parsedPreset = isRecord(rawPreset) ? rawPreset : {};
    const selectedJobType = isJobType(parsedPreset.selectedJobType)
        ? parsedPreset.selectedJobType
        : jobType;
    const flameScoreSettings = normalizeFlameScoreSettings(
        isRecord(parsedPreset.flameScoreSettings)
            ? (parsedPreset.flameScoreSettings as Partial<
                  Record<keyof FlameScoreSettings, unknown>
              >)
            : fallbackFlameScoreSettings,
        selectedJobType
    );

    return {
        selectedJobType,
        flameScoreSettings,
        selectedSlotId: isEquipSlotId(parsedPreset.selectedSlotId)
            ? parsedPreset.selectedSlotId
            : null,
        equipmentState: normalizeEquipmentState(
            selectedJobType,
            parsedPreset.equipmentState
        ),
    };
};

const normalizeEquipmentPresets = (
    jobType: JobType = DEFAULT_JOB_TYPE,
    fallbackFlameScoreSettings: FlameScoreSettings = normalizeFlameScoreSettings(
        undefined,
        jobType
    ),
    rawPresets?: unknown
): EquipmentPresetsState => {
    const parsedPresets = isRecord(rawPresets) ? rawPresets : {};

    return Object.fromEntries(
        EQUIPMENT_PRESET_IDS.map((presetId) => [
            presetId,
            normalizeEquipmentPresetState(
                jobType,
                fallbackFlameScoreSettings,
                parsedPresets[presetId]
            ),
        ])
    ) as EquipmentPresetsState;
};

const loadStoredState = (
    jobType: JobType = DEFAULT_JOB_TYPE
): Record<EquipSlotId, EquipmentSlotState> => {
    if (typeof window === "undefined") {
        return normalizeEquipmentState(jobType);
    }

    try {
        const rawState = window.localStorage.getItem(
            LEGACY_EQUIPMENT_SETUP_STORAGE_KEY
        );
        if (!rawState) {
            return normalizeEquipmentState(jobType);
        }

        return normalizeEquipmentState(jobType, JSON.parse(rawState));
    } catch {
        return normalizeEquipmentState(jobType);
    }
};

const loadStoredPresets = (
    jobType: JobType = DEFAULT_JOB_TYPE,
    flameScoreSettings: FlameScoreSettings = normalizeFlameScoreSettings(
        undefined,
        jobType
    )
): EquipmentPresetsState => {
    if (typeof window === "undefined") {
        return createInitialPresets(jobType);
    }

    try {
        const rawPresets = window.localStorage.getItem(
            EQUIPMENT_SETUP_PRESETS_STORAGE_KEY
        );
        if (rawPresets) {
            return normalizeEquipmentPresets(
                jobType,
                flameScoreSettings,
                JSON.parse(rawPresets)
            );
        }
    } catch {
        return createInitialPresets(jobType);
    }

    return {
        ...createInitialPresets(jobType),
        "preset-1": {
            selectedJobType: jobType,
            flameScoreSettings,
            selectedSlotId: null,
            equipmentState: loadStoredState(jobType),
        },
    };
};

const loadStoredActivePresetId = (): EquipmentPresetId => {
    if (typeof window === "undefined") {
        return "preset-1";
    }

    const storedPresetId = window.localStorage.getItem(
        EQUIPMENT_SETUP_ACTIVE_PRESET_STORAGE_KEY
    );
    return isEquipmentPresetId(storedPresetId) ? storedPresetId : "preset-1";
};

const createEquipmentSetupClipboardText = (
    jobType: JobType,
    selectedSlotId: EquipSlotId | null,
    flameScoreSettings: FlameScoreSettings,
    equipmentState: Record<EquipSlotId, EquipmentSlotState>
) =>
    JSON.stringify(
        {
            type: EQUIPMENT_SETUP_CLIPBOARD_TYPE,
            version: EQUIPMENT_SETUP_CLIPBOARD_VERSION,
            jobType,
            selectedSlotId,
            flameScoreSettings,
            equipmentState,
        } satisfies EquipmentSetupClipboardPayload,
        null,
        2
    );

const parseEquipmentSetupClipboardText = (text: string) => {
    const parsed = JSON.parse(text);

    if (
        !isRecord(parsed) ||
        parsed.type !== EQUIPMENT_SETUP_CLIPBOARD_TYPE ||
        parsed.version !== EQUIPMENT_SETUP_CLIPBOARD_VERSION ||
        !isJobType(parsed.jobType)
    ) {
        throw new Error("Clipboard does not contain an equipment setup.");
    }

    const jobType = parsed.jobType;

    return {
        jobType,
        selectedSlotId: isEquipSlotId(parsed.selectedSlotId)
            ? parsed.selectedSlotId
            : null,
        flameScoreSettings: normalizeFlameScoreSettings(
            isRecord(parsed.flameScoreSettings)
                ? (parsed.flameScoreSettings as Partial<
                      Record<keyof FlameScoreSettings, unknown>
                  >)
                : undefined,
            jobType
        ),
        equipmentState: normalizeEquipmentState(jobType, parsed.equipmentState),
    };
};

const writeClipboardText = async (text: string) => {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    const didCopy = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (!didCopy) {
        throw new Error("Clipboard write failed.");
    }
};

const readClipboardText = async () => {
    if (!navigator.clipboard?.readText) {
        throw new Error("Clipboard read is unavailable.");
    }

    return navigator.clipboard.readText();
};

function EquipmentSetup() {
    const [activePresetId, setActivePresetId] =
        React.useState<EquipmentPresetId>("preset-1");
    const [equipmentPresets, setEquipmentPresets] =
        React.useState<EquipmentPresetsState>(createInitialPresets);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [setupTransferStatus, setSetupTransferStatus] = React.useState("");

    React.useEffect(() => {
        const storedJobType = loadStoredJobType();
        const storedFlameScoreSettings =
            loadStoredFlameScoreSettings(storedJobType);
        // Restore browser-only state after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActivePresetId(loadStoredActivePresetId());
        setEquipmentPresets(
            loadStoredPresets(storedJobType, storedFlameScoreSettings)
        );
        setIsLoaded(true);
    }, []);

    React.useEffect(() => {
        if (!isLoaded) {
            return;
        }

        localStorage.setItem(
            EQUIPMENT_SETUP_PRESETS_STORAGE_KEY,
            JSON.stringify(equipmentPresets)
        );
        localStorage.setItem(
            EQUIPMENT_SETUP_ACTIVE_PRESET_STORAGE_KEY,
            activePresetId
        );
    }, [activePresetId, equipmentPresets, isLoaded]);

    React.useEffect(() => {
        if (!setupTransferStatus) {
            return;
        }

        const timeoutId = window.setTimeout(
            () => setSetupTransferStatus(""),
            2500
        );

        return () => window.clearTimeout(timeoutId);
    }, [setupTransferStatus]);

    const activePreset =
        equipmentPresets[activePresetId] ||
        createInitialPresetState(DEFAULT_JOB_TYPE);
    const selectedJobType = activePreset.selectedJobType;
    const flameScoreSettings = activePreset.flameScoreSettings;
    const equipmentState = activePreset.equipmentState;
    const selectedSlotId = activePreset.selectedSlotId;
    const selectedSlot = selectedSlotId
        ? equipmentState[selectedSlotId]
        : undefined;
    const selectedKind = selectedSlotId ? slotKind(selectedSlotId) : undefined;
    const selectedCatalogItems = selectedKind
        ? getFilteredCatalogItems(selectedKind, selectedJobType)
        : [];
    const selectedCatalogItem =
        selectedKind && selectedSlot
            ? getCatalogItem(selectedKind, selectedSlot.itemId, selectedJobType) ||
              selectedCatalogItems.find(
                  (item) => item.name === selectedSlot.itemName
              )
            : undefined;
    const countedSetEffects = React.useMemo(
        () => getCountedSetEffects(equipmentState, selectedJobType),
        [equipmentState, selectedJobType]
    );
    const enhancementTotals = React.useMemo(
        () => calculateEnhancementTotals(equipmentState),
        [equipmentState]
    );

    const updateJobType = (jobType: JobType) => {
        updateActivePreset((preset) => ({
            ...preset,
            selectedJobType: jobType,
            flameScoreSettings: applyJobDefaultsToFlameSettings(
                preset.flameScoreSettings,
                jobType
            ),
        }));
    };

    const updateActivePreset = (
        updater: (preset: EquipmentPresetState) => EquipmentPresetState
    ) => {
        setEquipmentPresets((prev) => ({
            ...prev,
            [activePresetId]: updater(
                prev[activePresetId] || createInitialPresetState(selectedJobType)
            ),
        }));
    };

    const updateFlameScoreSettings: React.Dispatch<
        React.SetStateAction<FlameScoreSettings>
    > = (nextSettings) => {
        updateActivePreset((preset) => ({
            ...preset,
            flameScoreSettings:
                typeof nextSettings === "function"
                    ? nextSettings(preset.flameScoreSettings)
                    : nextSettings,
        }));
    };

    const selectSlot = (slotId: EquipSlotId) => {
        updateActivePreset((preset) => ({
            ...preset,
            selectedSlotId: slotId,
        }));
    };

    const updateSelectedSlot = (patch: Partial<EquipmentSlotState>) => {
        if (!selectedSlotId) {
            return;
        }

        updateActivePreset((preset) => ({
            ...preset,
            equipmentState: {
                ...preset.equipmentState,
                [selectedSlotId]: {
                    ...preset.equipmentState[selectedSlotId],
                    ...patch,
                },
            },
        }));
    };

    const selectCatalogItem = (itemId: string) => {
        if (!selectedKind || !selectedSlot) {
            return;
        }

        const item = getCatalogItem(selectedKind, itemId, selectedJobType);

        if (!item) {
            return;
        }

        updateSelectedSlot({
            itemId: item.id,
            itemName: item.name,
            itemImage: item.imgPath,
            itemLevel: item.level,
            itemSetType: item.setType,
            stars: clampNumber(
                selectedSlot.stars,
                0,
                getSlotStarForceCap(
                    {
                        itemName: item.name,
                        itemLevel: item.level,
                        itemSetType: item.setType,
                    },
                    item
                )
            ),
        });
    };

    const updatePotentialLine = (
        key: "potential" | "bonusPotential",
        index: number,
        value: string
    ) => {
        if (!selectedSlot) {
            return;
        }

        const lines = [...selectedSlot[key].lines];
        lines[index] = value;

        updateSelectedSlot({
            [key]: {
                ...selectedSlot[key],
                lines,
            },
        } as Partial<EquipmentSlotState>);
    };

    const updateFlameLine = (
        index: number,
        patch: Partial<FlameLine>
    ) => {
        if (!selectedSlot) {
            return;
        }

        const flames = selectedSlot.flames.map((line, lineIndex) =>
            lineIndex === index ? { ...line, ...patch } : line
        );

        updateSelectedSlot({ flames });
    };

    const resetSelectedSlot = () => {
        if (!selectedSlotId) {
            return;
        }

        updateSelectedSlot(createEmptySlot(selectedSlotId, selectedJobType));
    };

    const resetAllSlots = () => {
        updateActivePreset(() => createInitialPresetState(selectedJobType));
    };

    const copyEquipmentSetup = async () => {
        try {
            await writeClipboardText(
                createEquipmentSetupClipboardText(
                    selectedJobType,
                    selectedSlotId,
                    flameScoreSettings,
                    equipmentState
                )
            );
            setSetupTransferStatus("Preset copied");
        } catch {
            setSetupTransferStatus("Copy failed");
        }
    };

    const pasteEquipmentSetup = async () => {
        try {
            const importedSetup = parseEquipmentSetupClipboardText(
                await readClipboardText()
            );

            setEquipmentPresets((prev) => ({
                ...prev,
                [activePresetId]: {
                    selectedJobType: importedSetup.jobType,
                    flameScoreSettings: importedSetup.flameScoreSettings,
                    selectedSlotId: importedSetup.selectedSlotId,
                    equipmentState: importedSetup.equipmentState,
                },
            }));
            setSetupTransferStatus("Preset pasted");
        } catch {
            setSetupTransferStatus("Paste failed");
        }
    };

    return (
        <InfoBlock title="equipment setup" src="/image/equipment/icons/weapon.png">
            <PresetTabsPanel
                activePresetId={activePresetId}
                enhancementTotals={enhancementTotals}
                onChange={setActivePresetId}
            />

            <JobTypeSelector
                selectedJobType={selectedJobType}
                setupTransferStatus={setupTransferStatus}
                onChange={updateJobType}
                onCopySetup={copyEquipmentSetup}
                onPasteSetup={pasteEquipmentSetup}
            />

            <div className="grid gap-4 xl:grid-cols-[minmax(250px,0.9fr)_minmax(480px,1.15fr)_minmax(430px,2fr)]">
                <SetEffectsPanel setEffects={countedSetEffects} />
                <div className="min-w-0">
                    <EquipmentGridPanel
                        equipmentState={equipmentState}
                        flameScoreSettings={flameScoreSettings}
                        selectedJobType={selectedJobType}
                        selectedSlotId={selectedSlotId}
                        onSelectSlot={selectSlot}
                    />
                    {selectedSlot ? (
                        <EnhancementMemoPanel
                            selectedSlot={selectedSlot}
                            onSlotChange={updateSelectedSlot}
                        />
                    ) : null}
                </div>
                {selectedSlotId && selectedKind && selectedSlot ? (
                    <SelectedEquipmentPanel
                        selectedCatalogItem={selectedCatalogItem}
                        selectedCatalogItems={selectedCatalogItems}
                        selectedJobType={selectedJobType}
                        selectedKind={selectedKind}
                        selectedSlot={selectedSlot}
                        selectedSlotId={selectedSlotId}
                        flameScoreSettings={flameScoreSettings}
                        onFlameScoreSettingsChange={updateFlameScoreSettings}
                        onFlameLineChange={updateFlameLine}
                        onPotentialLineChange={updatePotentialLine}
                        onResetAll={resetAllSlots}
                        onResetSlot={resetSelectedSlot}
                        onSelectCatalogItem={selectCatalogItem}
                        onSlotChange={updateSelectedSlot}
                    />
                ) : (
                    <SelectedEquipmentEmptyPanel onResetAll={resetAllSlots} />
                )}
            </div>
        </InfoBlock>
    );
}

function PresetTabsPanel({
    activePresetId,
    enhancementTotals,
    onChange,
}: Readonly<{
    activePresetId: EquipmentPresetId;
    enhancementTotals: EnhancementTotals;
    onChange: (presetId: EquipmentPresetId) => void;
}>) {
    return (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-700 bg-slate-900/80 p-2 text-sm">
            <div
                className="flex flex-wrap gap-1 rounded-md bg-slate-950 p-1"
                role="tablist"
                aria-label="Equipment presets"
            >
                {EQUIPMENT_PRESET_IDS.map((presetId) => {
                    const isSelected = presetId === activePresetId;

                    return (
                        <button
                            type="button"
                            className={`rounded px-3 py-1.5 text-sm font-semibold transition-colors ${
                                isSelected
                                    ? "bg-primary text-slate-950"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`}
                            role="tab"
                            aria-selected={isSelected}
                            onClick={() => onChange(presetId)}
                            key={presetId}
                        >
                            {EQUIPMENT_PRESET_LABELS[presetId]}
                        </button>
                    );
                })}
            </div>
            <div className="ml-auto flex flex-wrap items-center justify-end gap-2 text-xs">
                <span className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-slate-300">
                    Meso spent{" "}
                    <strong className="ml-1 text-white">
                        {formatInteger(enhancementTotals.mesoSpent)}
                    </strong>
                </span>
                <span className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-slate-300">
                    <TrashIndicatorIcon />
                    <strong className="text-white">
                        {formatInteger(enhancementTotals.destructionCount)}
                    </strong>
                </span>
            </div>
        </div>
    );
}

function EquipmentGridPanel({
    equipmentState,
    flameScoreSettings,
    selectedJobType,
    selectedSlotId,
    onSelectSlot,
}: Readonly<{
    equipmentState: Record<EquipSlotId, EquipmentSlotState>;
    flameScoreSettings: FlameScoreSettings;
    selectedJobType: JobType;
    selectedSlotId: EquipSlotId | null;
    onSelectSlot: (slotId: EquipSlotId) => void;
}>) {
    return (
        <div className="w-full min-w-0 overflow-x-auto">
            <div className="relative mx-auto w-full min-w-[480px]">
                <img
                    src="/image/equipment/equip-tab.png"
                    alt="Equipment window"
                    className="block w-full rounded-md [image-rendering:pixelated]"
                />
                <div className="absolute inset-0">
                    {EQUIP_SLOT_IDS.map((slotId) => {
                        const layout = EQUIP_SLOT_LAYOUTS[slotId];

                        return (
                            <div
                                className="absolute"
                                style={getEquipmentSlotLayoutStyle(layout)}
                                key={slotId}
                            >
                                <EquipmentGridSlot
                                    equipmentState={equipmentState}
                                    flameScoreSettings={flameScoreSettings}
                                    isSelected={slotId === selectedSlotId}
                                    selectedJobType={selectedJobType}
                                    slotId={slotId}
                                    onSelect={onSelectSlot}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function PotentialBadgeIcon({
    kind,
}: Readonly<{
    kind: "general" | "attack" | "boss" | "ignore" | "critical";
}>) {
    if (kind === "critical") {
        return (
            <svg
                viewBox="0 0 16 16"
                className="h-[1em] w-[1em] shrink-0"
                aria-hidden="true"
                focusable="false"
            >
                <path
                    fill="currentColor"
                    d="M7.2 1.2c.6 0 1 .4 1 1v5.3h.7V3.1c0-.5.4-1 .9-1s.9.4.9 1v4.4h.7V4.2c0-.5.4-.9.9-.9s.9.4.9.9v4.1l.4-.6c.3-.5.9-.6 1.3-.3.5.3.6.8.4 1.3l-1.9 3.5c-.7 1.3-2 2.1-3.5 2.1H7.2c-2.2 0-4-1.8-4-4V6.8c0-.5.4-.9.9-.9s.9.4.9.9v2.4h.7v-7c0-.6.4-1 1-1 .2 0 .4.1.5.2Z"
                />
            </svg>
        );
    }

    if (kind === "attack") {
        return (
            <svg
                viewBox="0 0 16 16"
                className="h-[1em] w-[1em] shrink-0"
                aria-hidden="true"
                focusable="false"
            >
                <path
                    fill="currentColor"
                    d="M11.9 1.5 14.5 4 6.7 11.8 4.2 9.3l7.7-7.8Zm-8.5 8.7 2.4 2.4-1.2 1.2H2.2v-2.4l1.2-1.2Zm3.4 3.1 1.2-1.2 1.2 1.2-.8.8-1.6-.8Z"
                />
            </svg>
        );
    }

    if (kind === "boss") {
        return (
            <svg
                viewBox="0 0 16 16"
                className="h-[1em] w-[1em] shrink-0"
                aria-hidden="true"
                focusable="false"
            >
                <path
                    fill="currentColor"
                    d="M8 1.5c-3.1 0-5.5 2.2-5.5 5.1 0 1.8.9 3.1 2.2 3.9v2.1c0 .6.4 1 1 1h4.6c.6 0 1-.4 1-1v-2.1c1.3-.8 2.2-2.1 2.2-3.9 0-2.9-2.4-5.1-5.5-5.1Zm-2.2 6.8c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2S7 6.4 7 7.1 6.5 8.3 5.8 8.3Zm2.2 3.3c-.4 0-.8-.3-.8-.8s.4-1.2.8-1.2.8.8.8 1.2-.4.8-.8.8Zm2.2-3.3c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2 1.2.5 1.2 1.2-.5 1.2-1.2 1.2Z"
                />
            </svg>
        );
    }

    if (kind === "ignore") {
        return (
            <svg
                viewBox="0 0 16 16"
                className="h-[1em] w-[1em] shrink-0"
                aria-hidden="true"
                focusable="false"
            >
                <path
                    fill="currentColor"
                    d="M8 1.3 13 3v4.2c0 3-1.8 5.6-5 7.5-3.2-1.9-5-4.5-5-7.5V3l5-1.7Zm0 1.8L4.6 4.2v3c0 2.1 1.1 4 3.4 5.5 2.3-1.5 3.4-3.4 3.4-5.5v-3L8 3.1Z"
                />
            </svg>
        );
    }

    return null;
}

function TrashIndicatorIcon() {
    return (
        <svg
            viewBox="0 0 16 16"
            className="h-[1em] w-[1em] shrink-0"
            aria-hidden="true"
            focusable="false"
        >
            <path
                fill="currentColor"
                d="M5.5 1.5h5l.8 1.5H14v1.5H2V3h2.7l.8-1.5ZM4 5.5h8l-.5 8c-.1.6-.6 1-1.2 1H5.7c-.6 0-1.1-.4-1.2-1L4 5.5Zm2.1 1.3.3 5.7h1.2l-.3-5.7H6.1Zm2.6 0v5.7h1.2V6.8H8.7Z"
            />
        </svg>
    );
}

function EquipmentGridSlot({
    equipmentState,
    flameScoreSettings,
    isSelected,
    selectedJobType,
    slotId,
    onSelect,
}: Readonly<{
    equipmentState: Record<EquipSlotId, EquipmentSlotState>;
    flameScoreSettings: FlameScoreSettings;
    isSelected: boolean;
    selectedJobType: JobType;
    slotId: EquipSlotId;
    onSelect: (slotId: EquipSlotId) => void;
}>) {
    const slot = equipmentState[slotId];
    const catalogItem = getCatalogItem(
        slotKind(slotId),
        slot.itemId,
        selectedJobType
    );
    const kind = slotKind(slotId);
    const starValue = clampNumber(
        slot.stars,
        0,
        getSlotStarForceCap(slot, catalogItem)
    );
    const potentialStats = calculateSlotPotentialStats(
        slot,
        flameScoreSettings,
        kind
    );
    const potentialBadges = getPotentialGridBadges(
        potentialStats,
        kind
    );
    const potentialRank = inferPotentialBlockRank(
        slot.potential,
        flameScoreSettings,
        kind,
        slot.itemLevel
    );
    const flameScore = calculateFlameScore(
        slot,
        flameScoreSettings,
        catalogItem
    );

    return (
        <button
            type="button"
            className={`relative flex h-full w-full items-center justify-center rounded-[4px] border-2 bg-black/10 [container-type:size] transition-colors ${
                isSelected
                    ? "border-primary bg-primary/20"
                    : `${POTENTIAL_BORDER[potentialRank]} hover:border-primary`
            }`}
            onClick={() => onSelect(slotId)}
            title={SLOT_LABELS[slotId]}
            aria-label={SLOT_LABELS[slotId]}
        >
            <img
                src={slot.itemImage}
                alt=""
                className="h-[76%] w-[76%] object-contain [image-rendering:pixelated]"
            />
            {starValue > 0 || slot.destructionCount > 0 ? (
                <span className="pointer-events-none absolute right-[3cqw] top-[3cqw] flex flex-col items-end gap-[1.25cqw]">
                    {starValue > 0 ? (
                        <span className="rounded-sm bg-black/75 px-[0.35em] text-[clamp(12px,18cqw,20px)] font-bold leading-[1.25] text-yellow-200">
                            ★{starValue}
                        </span>
                    ) : null}
                    {slot.destructionCount > 0 ? (
                        <span
                            className="flex items-center gap-[0.15em] rounded-sm bg-red-700/90 px-[0.35em] text-[clamp(11px,16cqw,18px)] font-bold leading-[1.25] text-red-100"
                            title="Destructions"
                        >
                            <TrashIndicatorIcon />
                            {slot.destructionCount}
                        </span>
                    ) : null}
                </span>
            ) : null}
            {potentialBadges.length > 0 ? (
                <span className="pointer-events-none absolute left-[3cqw] top-[3cqw] flex max-w-[68cqw] flex-col items-start gap-[1.25cqw]">
                    {potentialBadges.map((badge) => (
                        <span
                            className="flex max-w-full items-center gap-[0.15em] truncate rounded-sm bg-sky-500/90 px-[0.35em] text-[clamp(9px,13cqw,15px)] font-bold leading-[1.15] text-white"
                            title={badge.title}
                            key={`${badge.kind}:${badge.value}`}
                        >
                            <PotentialBadgeIcon kind={badge.kind} />
                            {badge.value}
                        </span>
                    ))}
                </span>
            ) : null}
            {flameScore > 0 ? (
                <span className="absolute bottom-[3cqw] left-[3cqw] flex items-center gap-[0.15em] rounded-sm bg-black/80 px-[0.35em] text-[clamp(10px,15cqw,17px)] font-bold leading-[1.25] text-slate-100">
                    <img
                        src={BLACK_FLAME_ICON}
                        alt=""
                        className="h-[1em] w-[1em] object-contain"
                    />
                    {formatScore(flameScore)}
                </span>
            ) : null}
        </button>
    );
}

function SelectedEquipmentPanel({
    selectedCatalogItem,
    selectedCatalogItems,
    selectedJobType,
    selectedKind,
    selectedSlot,
    selectedSlotId,
    flameScoreSettings,
    onFlameScoreSettingsChange,
    onFlameLineChange,
    onPotentialLineChange,
    onResetAll,
    onResetSlot,
    onSelectCatalogItem,
    onSlotChange,
}: Readonly<{
    selectedCatalogItem?: EquipmentCatalogItem;
    selectedCatalogItems: EquipmentCatalogItem[];
    selectedJobType: JobType;
    selectedKind: EquipKind;
    selectedSlot: EquipmentSlotState;
    selectedSlotId: EquipSlotId;
    flameScoreSettings: FlameScoreSettings;
    onFlameScoreSettingsChange: React.Dispatch<
        React.SetStateAction<FlameScoreSettings>
    >;
    onFlameLineChange: (index: number, patch: Partial<FlameLine>) => void;
    onPotentialLineChange: (
        key: "potential" | "bonusPotential",
        index: number,
        value: string
    ) => void;
    onResetAll: () => void;
    onResetSlot: () => void;
    onSelectCatalogItem: (itemId: string) => void;
    onSlotChange: (patch: Partial<EquipmentSlotState>) => void;
}>) {
    const starForceCap = getSlotStarForceCap(
        selectedSlot,
        selectedCatalogItem
    );
    const starValue = clampNumber(selectedSlot.stars, 0, starForceCap);

    return (
        <div className="min-w-0 rounded-md border border-slate-600 bg-slate-800/60 p-3">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <div className="text-xs uppercase text-slate-300">
                        {SLOT_LABELS[selectedSlotId]}
                    </div>
                    <div className="flex items-center gap-2 font-bold text-primary">
                        <img
                            src={selectedSlot.itemImage}
                            alt=""
                            className="h-9 w-9 object-contain"
                        />
                        <span>{selectedSlot.itemName}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="rounded-md border border-slate-500 px-3 py-1 text-sm hover:border-primary hover:text-primary"
                        onClick={onResetSlot}
                    >
                        Reset Slot
                    </button>
                    <button
                        type="button"
                        className="rounded-md border border-red-300/70 px-3 py-1 text-sm text-red-200 hover:bg-red-400/20"
                        onClick={onResetAll}
                    >
                        Reset Preset
                    </button>
                </div>
            </div>

            <div className="mb-3 text-sm">
                <div className="mb-1 text-slate-300">
                    Equipment catalog ({selectedCatalogItems.length})
                </div>
                <EquipmentCatalogCombobox
                    key={`${selectedJobType}:${selectedSlotId}:${selectedSlot.itemId}`}
                    items={selectedCatalogItems}
                    selectedItem={selectedCatalogItem}
                    fallbackImage={selectedSlot.itemImage}
                    fallbackName={selectedSlot.itemName}
                    onSelect={onSelectCatalogItem}
                />
            </div>

            <section className="mb-4 rounded-md bg-slate-900/70 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold uppercase text-slate-200">
                        Star Force
                    </h3>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-300 hover:border-primary hover:text-primary"
                            onClick={() => onSlotChange({ stars: 0 })}
                        >
                            0
                        </button>
                        <input
                            type="number"
                            min={0}
                            max={starForceCap}
                            value={starValue}
                            onChange={(event) =>
                                onSlotChange({
                                    stars: clampNumber(
                                        Math.trunc(
                                            Number(event.target.value) || 0
                                        ),
                                        0,
                                        starForceCap
                                    ),
                                })
                            }
                            className="w-20 rounded-md border border-slate-600 bg-slate-950 px-2 py-1 text-right text-yellow-200 outline-none focus:border-primary"
                            aria-label="Star Force value"
                        />
                    </div>
                </div>
                <StarForceSelector
                    value={starValue}
                    maxStars={starForceCap}
                    onChange={(stars) => onSlotChange({ stars })}
                />
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
                <PotentialEditor
                    title="Potential"
                    block={selectedSlot.potential}
                    equipKind={selectedKind}
                    itemLevel={selectedSlot.itemLevel}
                    settings={flameScoreSettings}
                    selectedJobType={selectedJobType}
                    onLineChange={(index, value) =>
                        onPotentialLineChange("potential", index, value)
                    }
                />
                <PotentialEditor
                    title="Bonus Potential"
                    block={selectedSlot.bonusPotential}
                    equipKind={selectedKind}
                    itemLevel={selectedSlot.itemLevel}
                    settings={flameScoreSettings}
                    selectedJobType={selectedJobType}
                    onLineChange={(index, value) =>
                        onPotentialLineChange("bonusPotential", index, value)
                    }
                />
            </div>

            <section className="mt-4 rounded-md bg-slate-900/70 p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold uppercase text-slate-200">
                        Bonus Stats
                    </h3>
                    {noFlameKinds.has(selectedKind) ? (
                        <span className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300">
                            Usually no flames
                        </span>
                    ) : null}
                </div>
                <div className="grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)]">
                    <FlameScoreSettingsPanel
                        settings={flameScoreSettings}
                        selectedJobType={selectedJobType}
                        onChange={onFlameScoreSettingsChange}
                    />
                    <div className="grid content-start gap-2">
                        <div className="flex items-center justify-between gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm">
                            <span className="flex items-center gap-2 text-slate-300">
                                <img
                                    src={BLACK_FLAME_ICON}
                                    alt=""
                                    className="h-5 w-5 object-contain"
                                />
                                Flame score
                            </span>
                            <span className="font-bold text-white">
                                {formatScore(
                                    calculateFlameScore(
                                        selectedSlot,
                                        flameScoreSettings,
                                        selectedCatalogItem
                                    )
                                )}
                            </span>
                        </div>
                        <div
                            className={`${FLAME_LINE_GRID_CLASS} px-2 text-[11px] font-semibold uppercase leading-none text-slate-500`}
                        >
                            <span className="text-left">Stat</span>
                            <span className="text-right">Tier</span>
                            <span className="text-right">Value</span>
                        </div>
                        {selectedSlot.flames.map((line, index) => {
                            const calculatedValue = getFlameLineValueLabel(
                                line,
                                selectedSlot,
                                selectedCatalogItem
                            );

                            return (
                                <div
                                    className={FLAME_LINE_GRID_CLASS}
                                    key={index}
                                >
                                    <select
                                        className="h-10 min-w-0 rounded-md border border-slate-600 bg-slate-950 px-2 text-sm leading-10 outline-none focus:border-primary"
                                        value={line.stat}
                                        onChange={(event) =>
                                            onFlameLineChange(index, {
                                                stat: event.target.value,
                                                tier:
                                                    event.target.value ===
                                                    "None"
                                                        ? 0
                                                        : line.tier,
                                            })
                                        }
                                    >
                                        {FLAME_STATS.map((stat) => (
                                            <option value={stat} key={stat}>
                                                {stat}
                                            </option>
                                        ))}
                                    </select>
                                    <FlameTierButtonGroup
                                        value={line.tier}
                                        onChange={(tier) =>
                                            onFlameLineChange(index, { tier })
                                        }
                                        ariaLabel={`Bonus stat ${
                                            index + 1
                                        } tier`}
                                    />
                                    <output
                                        className="flex h-10 items-center justify-end rounded-md border border-slate-700 bg-slate-950/60 px-2 text-right text-sm font-semibold leading-none text-slate-200"
                                        aria-label={`Bonus stat ${
                                            index + 1
                                        } calculated value`}
                                    >
                                        {calculatedValue}
                                    </output>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}

function SelectedEquipmentEmptyPanel({
    onResetAll,
}: Readonly<{
    onResetAll: () => void;
}>) {
    return (
        <div className="min-w-0 rounded-md border border-slate-600 bg-slate-800/60 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <div className="text-xs uppercase text-slate-300">
                        Equipment
                    </div>
                    <div className="font-bold text-slate-200">
                        No equipment selected
                    </div>
                </div>
                <button
                    type="button"
                    className="rounded-md border border-red-300/70 px-3 py-1 text-sm text-red-200 hover:bg-red-400/20"
                    onClick={onResetAll}
                >
                    Reset Preset
                </button>
            </div>
        </div>
    );
}

function JobTypeSelector({
    selectedJobType,
    setupTransferStatus,
    onChange,
    onCopySetup,
    onPasteSetup,
}: Readonly<{
    selectedJobType: JobType;
    setupTransferStatus: string;
    onChange: (jobType: JobType) => void;
    onCopySetup: () => void;
    onPasteSetup: () => void;
}>) {
    return (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
                <div className="font-bold uppercase text-slate-200">
                    Job filter
                </div>
                <div className="flex flex-wrap gap-1 rounded-md border border-slate-700 bg-slate-900 p-1">
                    {JOB_TYPES.map((jobType) => {
                        const isSelected = jobType === selectedJobType;

                        return (
                            <button
                                type="button"
                                className={`rounded px-3 py-1.5 text-sm transition-colors ${
                                    isSelected
                                        ? "bg-primary text-slate-950"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`}
                                aria-pressed={isSelected}
                                onClick={() => onChange(jobType)}
                                key={jobType}
                            >
                                {JOB_LABELS[jobType]}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                {setupTransferStatus ? (
                    <span className="text-xs text-slate-400">
                        {setupTransferStatus}
                    </span>
                ) : null}
                <button
                    type="button"
                    className="rounded-md border border-slate-600 px-3 py-1.5 text-sm text-slate-200 transition-colors hover:border-primary hover:text-primary"
                    onClick={onCopySetup}
                >
                    Copy Preset
                </button>
                <button
                    type="button"
                    className="rounded-md border border-slate-600 px-3 py-1.5 text-sm text-slate-200 transition-colors hover:border-primary hover:text-primary"
                    onClick={onPasteSetup}
                >
                    Paste Preset
                </button>
            </div>
        </div>
    );
}

function FlameTierButtonGroup({
    value,
    onChange,
    ariaLabel,
}: Readonly<{
    value: number;
    onChange: (tier: number) => void;
    ariaLabel: string;
}>) {
    return (
        <ButtonGroup className="!w-full min-w-0" aria-label={ariaLabel}>
            {FLAME_TIERS.map((tier) => {
                const isSelected = value === tier;

                return (
                    <button
                        type="button"
                        className={`flex h-10 min-w-0 flex-1 items-center justify-center border px-2 text-sm font-semibold leading-none outline-none transition-colors focus-visible:relative focus-visible:z-10 focus-visible:border-yellow-200 ${
                            isSelected
                                ? "border-yellow-200 bg-yellow-300 text-slate-950 shadow-[0_0_0_2px_rgba(250,204,21,0.35)] hover:bg-yellow-200"
                                : "border-slate-700 bg-slate-950 text-slate-400 hover:border-primary hover:text-primary"
                        }`}
                        aria-pressed={isSelected}
                        onClick={() => onChange(tier)}
                        key={tier}
                    >
                        {tier}
                    </button>
                );
            })}
        </ButtonGroup>
    );
}

function FlameScoreSettingsPanel({
    settings,
    selectedJobType,
    onChange,
}: Readonly<{
    settings: FlameScoreSettings;
    selectedJobType: JobType;
    onChange: React.Dispatch<React.SetStateAction<FlameScoreSettings>>;
}>) {
    const updateSetting = <Key extends keyof FlameScoreSettings>(
        key: Key,
        value: FlameScoreSettings[Key]
    ) => {
        onChange((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const updateRatio = (
        key: keyof Pick<
            FlameScoreSettings,
            | "secondaryStatValue"
            | "attackValue"
            | "allStatPercentValue"
            | "damageBossPercentValue"
        >,
        value: number
    ) => {
        updateSetting(key, normalizeScoreRatio(value, settings[key]));
    };

    return (
        <fieldset className="rounded-md border border-slate-700 bg-slate-950 p-3 text-sm">
            <legend className="flex items-center gap-2 px-1 font-bold uppercase text-slate-200">
                <img
                    src={BLACK_FLAME_ICON}
                    alt=""
                    className="h-5 w-5 object-contain"
                />
                Flame ratios
            </legend>
            <div className="grid gap-2">
                <label className="grid gap-1">
                    <span className="text-xs text-slate-400">Primary stat</span>
                    <select
                        className="rounded-md border border-slate-600 bg-slate-900 px-2 py-2 outline-none focus:border-primary"
                        value={settings.primaryStat}
                        onChange={(event) =>
                            updateSetting(
                                "primaryStat",
                                event.target.value as CoreStat
                            )
                        }
                    >
                        {CORE_STATS.map((stat) => (
                            <option value={stat} key={stat}>
                                {stat}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="grid gap-1">
                    <span className="text-xs text-slate-400">
                        Secondary stat
                    </span>
                    <select
                        className="rounded-md border border-slate-600 bg-slate-900 px-2 py-2 outline-none focus:border-primary"
                        value={settings.secondaryStat}
                        onChange={(event) =>
                            updateSetting(
                                "secondaryStat",
                                event.target.value as CoreStat
                            )
                        }
                    >
                        {CORE_STATS.map((stat) => (
                            <option value={stat} key={stat}>
                                {stat}
                            </option>
                        ))}
                    </select>
                </label>
                <RatioInput
                    label="1 Secondary Stat"
                    value={settings.secondaryStatValue}
                    onChange={(value) => updateRatio("secondaryStatValue", value)}
                />
                <RatioInput
                    label={`1 ${getAttackStatLabel(selectedJobType)}`}
                    value={settings.attackValue}
                    onChange={(value) => updateRatio("attackValue", value)}
                />
                <RatioInput
                    label="1% All Stats"
                    value={settings.allStatPercentValue}
                    onChange={(value) =>
                        updateRatio("allStatPercentValue", value)
                    }
                />
                <RatioInput
                    label="1% Damage / Boss"
                    value={settings.damageBossPercentValue}
                    onChange={(value) =>
                        updateRatio("damageBossPercentValue", value)
                    }
                />
            </div>
        </fieldset>
    );
}

function RatioInput({
    label,
    value,
    onChange,
}: Readonly<{
    label: string;
    value: number;
    onChange: (value: number) => void;
}>) {
    return (
        <label className="grid gap-1">
            <span className="text-xs text-slate-400">{label}</span>
            <input
                type="number"
                min={0}
                step={0.125}
                className="h-10 min-w-0 rounded-md border border-slate-600 bg-slate-900 px-2 text-right outline-none focus:border-primary"
                value={value}
                onChange={(event) => onChange(event.target.valueAsNumber)}
            />
        </label>
    );
}

function SetEffectsPanel({
    setEffects,
}: Readonly<{ setEffects: CountedSetEffect[] }>) {
    const activeCount = setEffects.filter(
        (setEffect) => setEffect.activeTiers.length > 0
    ).length;

    return (
        <section className="rounded-md border border-slate-700 bg-slate-800/60 p-3 text-sm">
            <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold uppercase text-slate-200">
                    Set Effects
                </h3>
                <span className="text-xs text-slate-400">
                    {activeCount} active
                </span>
            </div>

            {setEffects.length > 0 ? (
                <div className="grid gap-2">
                    {setEffects.map((setEffect) => (
                        <SetEffectRow
                            setEffect={setEffect}
                            key={setEffect.setType}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-md border border-dashed border-slate-700 px-3 py-4 text-center text-slate-400">
                    No set items equipped
                </div>
            )}
        </section>
    );
}

function SetEffectRow({
    setEffect,
}: Readonly<{ setEffect: CountedSetEffect }>) {
    const isActive = setEffect.activeTiers.length > 0;
    const highestActiveTier =
        setEffect.activeTiers[setEffect.activeTiers.length - 1];

    return (
        <div
            className={`group relative rounded-md border px-3 py-2 outline-none ${
                isActive
                    ? "border-primary/60 bg-slate-950 text-white"
                    : "border-slate-700 bg-slate-900/70 text-slate-300"
            }`}
            tabIndex={0}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="truncate font-bold">{setEffect.label}</div>
                    <div className="text-xs text-slate-400">
                        {setEffect.count} counted
                        {highestActiveTier
                            ? ` / ${highestActiveTier.numEquipped}-set active`
                            : setEffect.nextTier
                              ? ` / next at ${setEffect.nextTier.numEquipped}`
                              : ""}
                    </div>
                </div>
                <div
                    className={`shrink-0 rounded px-2 py-1 text-xs font-bold ${
                        isActive
                            ? "bg-primary/20 text-primary"
                            : "bg-slate-800 text-slate-400"
                    }`}
                >
                    {setEffect.count}
                </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
                {setEffect.activeTiers.map((tier) => (
                    <span
                        className="rounded bg-primary/20 px-2 py-0.5 text-xs text-primary"
                        key={tier.numEquipped}
                    >
                        {tier.numEquipped}-set
                    </span>
                ))}
                {!isActive && setEffect.nextTier ? (
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                        needs {setEffect.nextTier.numEquipped}
                    </span>
                ) : null}
                {setEffect.luckyItem ? (
                    <span className="rounded bg-yellow-300/20 px-2 py-0.5 text-xs text-yellow-200">
                        lucky +1
                    </span>
                ) : null}
            </div>

            <SetEffectTooltip setEffect={setEffect} />
        </div>
    );
}

function SetEffectTooltip({
    setEffect,
}: Readonly<{ setEffect: CountedSetEffect }>) {
    const totalStats = aggregateSetEffectStats(setEffect.activeTiers);

    return (
        <div className="pointer-events-none absolute left-0 top-full z-30 mt-2 hidden w-80 max-w-[calc(100vw-6rem)] rounded-md border border-slate-600 bg-slate-950 p-3 text-left text-xs text-slate-200 shadow-xl group-hover:block group-focus-within:block">
            <div className="mb-2">
                <div className="font-bold text-primary">{setEffect.label}</div>
                <div className="text-slate-400">
                    {setEffect.count} counted
                    {setEffect.luckyItem
                        ? ` (${setEffect.baseCount} set + lucky)`
                        : ""}
                    {setEffect.definition
                        ? ` / Lv. ${setEffect.definition.level} set`
                        : ""}
                </div>
            </div>

            <div className="mb-3">
                <div className="mb-1 text-slate-400">Equipped items</div>
                <div className="grid gap-1">
                    {setEffect.equippedItems.map((item) => (
                        <div
                            className="flex justify-between gap-2"
                            key={`${item.slotId}:${item.itemId}`}
                        >
                            <span className="text-slate-400">
                                {item.slotLabel}
                            </span>
                            <span className="min-w-0 truncate">
                                {item.itemName}
                                {item.isLuckyItem ? " (Lucky)" : ""}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {totalStats.length > 0 ? (
                <div className="mb-3">
                    <div className="mb-1 text-slate-400">Applied total</div>
                    <div className="flex flex-wrap gap-1">
                        {totalStats.map((stat) => (
                            <span
                                className="rounded bg-slate-800 px-2 py-1"
                                key={stat.statId}
                            >
                                {formatSetEffectStat(stat)}
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mb-3 rounded bg-slate-900 px-2 py-2 text-slate-400">
                    {setEffect.nextTier
                        ? `${setEffect.nextTier.numEquipped} equipped needed for the first bonus`
                        : "No set effect data"}
                </div>
            )}

            {setEffect.activeTiers.length > 0 ? (
                <div className="grid gap-2">
                    {setEffect.activeTiers.map((tier) => (
                        <div key={tier.numEquipped}>
                            <div className="font-bold text-slate-300">
                                {tier.numEquipped}-set bonus
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1">
                                {tier.list.map((stat) => (
                                    <span
                                        className="rounded bg-slate-900 px-2 py-1 text-slate-300"
                                        key={`${tier.numEquipped}:${stat.statId}`}
                                    >
                                        {formatSetEffectStat(stat)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

            {setEffect.nextTier ? (
                <div className="mt-3 text-slate-500">
                    Next: {setEffect.nextTier.numEquipped}-set
                </div>
            ) : null}
        </div>
    );
}

function StarForceSelector({
    value,
    maxStars,
    onChange,
}: Readonly<{
    value: number;
    maxStars: number;
    onChange: (value: number) => void;
}>) {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const isDraggingRef = React.useRef(false);
    const normalizedMaxStars = clampNumber(
        Math.trunc(Number(maxStars) || 0),
        0,
        MAX_STAR_FORCE
    );
    const rowCount = Math.ceil(normalizedMaxStars / STAR_ROW_SIZE);

    const getStarValueFromPoint = React.useCallback(
        (clientX: number, clientY: number) => {
            const root = rootRef.current;
            if (!root) {
                return undefined;
            }

            const element = document.elementFromPoint(clientX, clientY);
            const button = element?.closest<HTMLButtonElement>(
                "[data-star-value]"
            );

            if (!button || !root.contains(button)) {
                return undefined;
            }

            return clampNumber(
                Number(button.dataset.starValue) || 0,
                0,
                normalizedMaxStars
            );
        },
        [normalizedMaxStars]
    );

    const updateFromPointer = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            const nextValue = getStarValueFromPoint(
                event.clientX,
                event.clientY
            );
            if (nextValue !== undefined) {
                onChange(nextValue);
            }
        },
        [getStarValueFromPoint, onChange]
    );

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) {
            return;
        }

        const nextValue = getStarValueFromPoint(event.clientX, event.clientY);
        if (nextValue === undefined) {
            return;
        }

        isDraggingRef.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.preventDefault();
        onChange(nextValue);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) {
            return;
        }

        event.preventDefault();
        updateFromPointer(event);
    };

    const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) {
            return;
        }

        isDraggingRef.current = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        updateFromPointer(event);
    };

    return (
        <div
            className="grid touch-none select-none gap-y-2 overflow-x-auto"
            ref={rootRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            role="group"
            aria-label="Star Force stars"
        >
            {Array.from({ length: rowCount }).map((_, rowIndex) => {
                const rowStart = rowIndex * STAR_ROW_SIZE + 1;
                const rowLength = Math.min(
                    STAR_ROW_SIZE,
                    normalizedMaxStars - rowIndex * STAR_ROW_SIZE
                );
                const groupCount = Math.ceil(rowLength / STAR_GROUP_SIZE);

                return (
                    <div
                        className="mx-auto flex w-max justify-center gap-x-4"
                        key={`star-row-${rowIndex}`}
                    >
                        {Array.from({ length: groupCount }).map(
                            (__, groupIndex) => {
                                const groupStart =
                                    rowStart + groupIndex * STAR_GROUP_SIZE;
                                const groupLength = Math.min(
                                    STAR_GROUP_SIZE,
                                    rowStart + rowLength - groupStart
                                );

                                return (
                                    <div
                                        className="flex gap-0.5"
                                        key={`star-group-${rowIndex}-${groupIndex}`}
                                    >
                                        {Array.from({ length: groupLength }).map(
                                            (___, starIndex) => {
                                                const starValue =
                                                    groupStart + starIndex;
                                                const isFilled =
                                                    starValue <= value;

                                                return (
                                                    <button
                                                        type="button"
                                                        className={`h-7 w-6 rounded-sm text-xl leading-7 transition-colors ${
                                                            isFilled
                                                                ? "text-yellow-300"
                                                                : "text-slate-600 hover:text-yellow-100"
                                                        }`}
                                                        data-star-value={
                                                            starValue
                                                        }
                                                        aria-label={`Set Star Force to ${starValue}`}
                                                        aria-pressed={isFilled}
                                                        onClick={() =>
                                                            onChange(starValue)
                                                        }
                                                        key={starValue}
                                                    >
                                                        {isFilled ? "★" : "☆"}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function EnhancementMemoPanel({
    selectedSlot,
    onSlotChange,
}: Readonly<{
    selectedSlot: EquipmentSlotState;
    onSlotChange: (patch: Partial<EquipmentSlotState>) => void;
}>) {
    const updateMesoSpent = (nextValue: number) => {
        onSlotChange({ mesoSpent: normalizeCounterValue(nextValue) });
    };
    const updateDestructionCount = (nextValue: number) => {
        onSlotChange({ destructionCount: normalizeCounterValue(nextValue) });
    };
    const counterRowClass =
        "mx-auto mt-3 grid w-full gap-2 rounded-md border border-slate-700 bg-slate-950 p-3 sm:grid-cols-[112px_minmax(0,1fr)_272px] sm:items-center";
    const inputClass =
        "h-10 min-w-0 rounded-md border border-slate-600 bg-slate-900 px-2 text-right text-sm tabular-nums text-white outline-none focus:border-primary";
    const counterButtonBaseClass =
        "h-8 rounded-md border px-2 text-xs tabular-nums transition-colors";
    const decrementButtonClass = `${counterButtonBaseClass} border-red-500/60 text-red-200 hover:border-red-300 hover:bg-red-500/15`;
    const incrementButtonClass = `${counterButtonBaseClass} border-emerald-500/60 text-emerald-200 hover:border-emerald-300 hover:bg-emerald-500/15`;

    return (
        <>
            <fieldset className={counterRowClass} aria-label="Meso spent">
                <span className="text-sm text-slate-300">Meso spent</span>
                <input
                    type="text"
                    inputMode="numeric"
                    value={formatInteger(selectedSlot.mesoSpent)}
                    onChange={(event) =>
                        updateMesoSpent(
                            parseFormattedCounterValue(event.target.value)
                        )
                    }
                    className={inputClass}
                    aria-label="Meso spent"
                />
                <span className="grid w-full grid-cols-4 gap-1 justify-self-end">
                    {MESO_COUNTER_STEPS.map((step) => (
                        <button
                            type="button"
                            className={decrementButtonClass}
                            onClick={() =>
                                updateMesoSpent(
                                    selectedSlot.mesoSpent - step.value
                                )
                            }
                            aria-label={`Subtract ${step.label} mesos`}
                            key={`subtract-${step.label}`}
                        >
                            -{step.label}
                        </button>
                    ))}
                    {MESO_COUNTER_STEPS.map((step) => (
                        <button
                            type="button"
                            className={incrementButtonClass}
                            onClick={() =>
                                updateMesoSpent(
                                    selectedSlot.mesoSpent + step.value
                                )
                            }
                            aria-label={`Add ${step.label} mesos`}
                            key={`add-${step.label}`}
                        >
                            +{step.label}
                        </button>
                    ))}
                </span>
            </fieldset>
            <fieldset className={counterRowClass} aria-label="Destructions">
                <span className="text-sm text-slate-300">Destructions</span>
                <input
                    type="text"
                    inputMode="numeric"
                    value={formatInteger(selectedSlot.destructionCount)}
                    onChange={(event) =>
                        updateDestructionCount(
                            parseFormattedCounterValue(event.target.value)
                        )
                    }
                    className={inputClass}
                    aria-label="Destructions"
                />
                <span className="grid w-full grid-cols-2 gap-1 justify-self-end">
                    <button
                        type="button"
                        className={decrementButtonClass}
                        onClick={() =>
                            updateDestructionCount(
                                selectedSlot.destructionCount - 1
                            )
                        }
                    >
                        -1
                    </button>
                    <button
                        type="button"
                        className={incrementButtonClass}
                        onClick={() =>
                            updateDestructionCount(
                                selectedSlot.destructionCount + 1
                            )
                        }
                    >
                        +1
                    </button>
                </span>
            </fieldset>
        </>
    );
}

function PotentialEditor({
    title,
    block,
    equipKind,
    itemLevel,
    settings,
    selectedJobType,
    onLineChange,
}: Readonly<{
    title: string;
    block: PotentialBlock;
    equipKind: EquipKind;
    itemLevel: number;
    settings: FlameScoreSettings;
    selectedJobType: JobType;
    onLineChange: (index: number, value: string) => void;
}>) {
    const datalistId = React.useId();
    const inferredRank = inferPotentialBlockRank(
        block,
        settings,
        equipKind,
        itemLevel
    );
    const suggestionRank: PotentialRank =
        inferredRank === "none" ? "legendary" : inferredRank;
    const percentValues = getPotentialPercentValues(
        suggestionRank,
        itemLevel
    );
    const allStatPercentValues = getAllStatPotentialPercentValues(
        suggestionRank,
        itemLevel
    );
    const possibleLineLabels = [
        percentValues.length > 0
            ? `Stat ${percentValues.join(" / ")}`
            : undefined,
        allStatPercentValues.length > 0
            ? `All Stat ${allStatPercentValues.join(" / ")}`
            : undefined,
    ].filter((label): label is string => Boolean(label));
    const metricLabel = getPotentialMetricLabel(
        equipKind,
        settings,
        selectedJobType
    );
    const potentialStats = calculatePotentialStats(
        block.lines,
        settings,
        equipKind
    );
    const potentialSummary = formatPotentialStats(
        potentialStats,
        equipKind
    );
    const suggestions = React.useMemo(
        () =>
            getPotentialSuggestions(
                itemLevel,
                settings,
                equipKind,
                suggestionRank,
                selectedJobType
            ),
        [equipKind, itemLevel, selectedJobType, settings, suggestionRank]
    );

    return (
        <section className="rounded-md bg-slate-900/70 p-3">
            <datalist id={datalistId}>
                {suggestions.map((suggestion) => (
                    <option value={suggestion} key={suggestion} />
                ))}
            </datalist>
            <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                    <h3 className="text-sm font-bold uppercase text-slate-200">
                        {title}
                    </h3>
                    <div className="text-xs text-sky-300">
                        {metricLabel} {potentialSummary}
                    </div>
                </div>
                <span
                    className={`rounded-md border bg-slate-950 px-2 py-1 text-sm ${POTENTIAL_BORDER[inferredRank]}`}
                >
                    {POTENTIAL_LABELS[inferredRank]}
                </span>
            </div>
            {possibleLineLabels.length > 0 ? (
                <div className="mb-2 text-xs text-slate-400">
                    Lv. {itemLevel || "-"} possible % lines:{" "}
                    {possibleLineLabels.join("; ")}
                </div>
            ) : null}
            <div className="grid gap-2">
                {block.lines.map((line, index) => (
                    <input
                        className="w-full rounded-md border border-slate-600 bg-slate-950 px-2 py-2 text-sm outline-none focus:border-primary"
                        value={line}
                        onChange={(event) =>
                            onLineChange(index, event.target.value)
                        }
                        list={datalistId}
                        placeholder={`Line ${index + 1}`}
                        key={index}
                    />
                ))}
            </div>
        </section>
    );
}

function EquipmentCatalogCombobox({
    items,
    selectedItem,
    fallbackImage,
    fallbackName,
    onSelect,
}: Readonly<{
    items: EquipmentCatalogItem[];
    selectedItem?: EquipmentCatalogItem;
    fallbackImage: string;
    fallbackName: string;
    onSelect: (itemId: string) => void;
}>) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [activeIndex, setActiveIndex] = React.useState(0);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const filteredItems = React.useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return items;
        }

        return items.filter((item) =>
            [item.name, item.id, item.baseId, item.setType, item.region, item.jobType]
                .filter(Boolean)
                .some((value) =>
                    value.toLowerCase().includes(normalizedQuery)
                )
        );
    }, [items, query]);

    React.useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (
                rootRef.current &&
                !rootRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [isOpen]);

    React.useEffect(() => {
        if (isOpen) {
            searchInputRef.current?.focus();
        }
    }, [isOpen]);

    const chooseItem = (item: EquipmentCatalogItem) => {
        onSelect(item.id);
        setIsOpen(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!isOpen && ["ArrowDown", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            setIsOpen(true);
            return;
        }

        if (!isOpen) {
            return;
        }

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setActiveIndex((index) =>
                    Math.min(index + 1, Math.max(filteredItems.length - 1, 0))
                );
                break;
            case "ArrowUp":
                event.preventDefault();
                setActiveIndex((index) => Math.max(index - 1, 0));
                break;
            case "Enter":
                event.preventDefault();
                if (filteredItems[activeIndex]) {
                    chooseItem(filteredItems[activeIndex]);
                }
                break;
            case "Escape":
                event.preventDefault();
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    const selectedImage = selectedItem?.imgPath || fallbackImage;
    const selectedName = selectedItem?.name || fallbackName;
    const selectedLevel = selectedItem?.level || 0;
    const selectedRegion = selectedItem?.region || "";
    const selectedJobLabel = selectedItem
        ? selectedItem.jobType === "common"
            ? "Common"
            : JOB_LABELS[selectedItem.jobType]
        : "";

    return (
        <div className="relative" ref={rootRef} onKeyDown={handleKeyDown}>
            <button
                type="button"
                className="flex w-full items-center gap-3 rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-left text-white outline-none transition-colors hover:border-primary focus:border-primary"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                onClick={() => setIsOpen((open) => !open)}
            >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-slate-950">
                    <img
                        src={selectedImage}
                        alt=""
                        className="max-h-8 max-w-8 object-contain"
                    />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">
                        {selectedName}
                    </span>
                    <span className="block truncate text-xs text-slate-400">
                        Lv. {selectedLevel || "-"}
                        {selectedJobLabel ? ` / ${selectedJobLabel}` : ""}
                        {selectedRegion ? ` / ${selectedRegion}` : ""}
                    </span>
                </span>
                <span className="text-xs text-slate-400">
                    {isOpen ? "Close" : "Open"}
                </span>
            </button>

            {isOpen ? (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-md border border-slate-600 bg-slate-950 shadow-xl">
                    <div className="border-b border-slate-700 p-2">
                        <input
                            ref={searchInputRef}
                            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-primary"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setActiveIndex(0);
                            }}
                            placeholder="Search equipment"
                            aria-label="Search equipment"
                        />
                    </div>
                    <div
                        className="max-h-72 overflow-auto py-1"
                        role="listbox"
                    >
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => {
                                const isSelected = item.id === selectedItem?.id;
                                const isActive = index === activeIndex;

                                return (
                                    <button
                                        type="button"
                                        className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                                            isActive
                                                ? "bg-primary/20"
                                                : "hover:bg-slate-800"
                                        } ${
                                            isSelected
                                                ? "text-primary"
                                                : "text-slate-100"
                                        }`}
                                        role="option"
                                        aria-selected={isSelected}
                                        onMouseEnter={() =>
                                            setActiveIndex(index)
                                        }
                                        onClick={() => chooseItem(item)}
                                        key={item.id}
                                    >
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-slate-900">
                                            <img
                                                src={item.imgPath}
                                                alt=""
                                                className="max-h-8 max-w-8 object-contain"
                                            />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-bold">
                                                {item.name}
                                            </span>
                                            <span className="block truncate text-xs text-slate-400">
                                                Lv. {item.level}
                                                {" / "}
                                                {item.jobType === "common"
                                                    ? "Common"
                                                    : JOB_LABELS[item.jobType]}
                                                {item.setType !== "none"
                                                    ? ` / ${item.setType}`
                                                    : ""}
                                                {item.region
                                                    ? ` / ${item.region}`
                                                    : ""}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-3 py-4 text-center text-sm text-slate-400">
                                No equipment found
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default EquipmentSetup;
