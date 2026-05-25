"use client";

import React from "react";
import InfoBlock from "./InfoBlock";
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

const EQUIP_SLOT_IDS = EQUIP_GRID.filter(Boolean) as EquipSlotId[];

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
const MESO_COUNTER_STEP = 100_000_000;
const MAX_TRACKED_VALUE = Number.MAX_SAFE_INTEGER;
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

const POTENTIAL_RANKS = ["none", "rare", "epic", "unique", "legendary"] as const;
type PotentialRank = (typeof POTENTIAL_RANKS)[number];

const POTENTIAL_LABELS: Record<PotentialRank, string> = {
    none: "None",
    rare: "Rare",
    epic: "Epic",
    unique: "Unique",
    legendary: "Legendary",
};

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
    "grid grid-cols-[minmax(128px,1fr)_72px_96px] items-center gap-2";

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

type FlameScoreSettings = {
    primaryStat: CoreStat;
    secondaryStat: CoreStat;
    secondaryStatValue: number;
    attackValue: number;
    allStatPercentValue: number;
    damageBossPercentValue: number;
};

const clampNumber = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

const normalizeCounterValue = (value: unknown) =>
    clampNumber(Math.trunc(Number(value) || 0), 0, MAX_TRACKED_VALUE);

const formatInteger = (value: number) => NUMBER_FORMATTER.format(value);

const formatScore = (value: number) =>
    Number.isInteger(value) ? formatInteger(value) : value.toFixed(1);

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

const getPotentialPercentValues = (rank: PotentialRank, level: number) => {
    if (rank === "none") {
        return [];
    }

    const rankIndex = POTENTIAL_RANK_ORDER.indexOf(rank);
    const levelBucket = getPotentialLevelBucket(level);

    return POTENTIAL_RANK_ORDER.slice(0, rankIndex + 1)
        .map((rankKey) => POTENTIAL_PERCENT_VALUES[rankKey][levelBucket])
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

const getPotentialMetricLabel = (
    kind: EquipKind,
    settings: FlameScoreSettings
) => (isWeaponPotentialKind(kind) ? "ATT/MATT/Boss/IED" : `${settings.primaryStat}/All`);

const getWeaponPotentialSuggestions = (level: number, rank: PotentialRank) => {
    const values = getPotentialPercentValues(rank, level);
    const attackSuggestions = values.flatMap((value) => [
        `ATT +${value}%`,
        `MATT +${value}%`,
    ]);

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
    rank: PotentialRank
) => {
    if (rank === "none") {
        return [];
    }

    if (isWeaponPotentialKind(kind)) {
        return getWeaponPotentialSuggestions(level, rank);
    }

    const values = getPotentialPercentValues(rank, level);
    const percentSuggestions = values.flatMap((value) => [
        `${settings.primaryStat} +${value}%`,
        `All Stats +${value}%`,
    ]);

    return [
        ...percentSuggestions,
        ...values.flatMap((value) => [`ATT +${value}%`, `MATT +${value}%`]),
        "Boss Damage +40%",
        "Ignore DEF +40%",
        "Critical Damage +8%",
        "Item Drop Rate +20%",
        "Meso Obtained +20%",
        "Cooldown -2 sec",
        "HP +12%",
    ];
};

const parsePotentialPercentValue = (
    line: string,
    settings: FlameScoreSettings,
    kind: EquipKind
) => {
    const normalizedLine = line.toLowerCase();
    const percentMatch = normalizedLine.match(/([+-]?\d+(?:\.\d+)?)\s*%/);

    if (!percentMatch) {
        return 0;
    }

    const value = Number(percentMatch[1]);
    if (!Number.isFinite(value)) {
        return 0;
    }

    if (isWeaponPotentialKind(kind)) {
        const isAttackLine =
            /\b(?:att|matt|attack|magic attack)\b/.test(normalizedLine) ||
            normalizedLine.includes("공격력") ||
            normalizedLine.includes("마력");
        const isBossLine =
            normalizedLine.includes("boss") || normalizedLine.includes("보스");
        const isIgnoreLine =
            normalizedLine.includes("ignore") ||
            normalizedLine.includes("ied") ||
            normalizedLine.includes("방무") ||
            normalizedLine.includes("방어율");

        return isAttackLine || isBossLine || isIgnoreLine ? value : 0;
    }

    const primary = settings.primaryStat.toLowerCase();
    const isPrimaryStatLine = normalizedLine.includes(primary);
    const isAllStatLine =
        normalizedLine.includes("all stat") ||
        normalizedLine.includes("allstat") ||
        normalizedLine.includes("all stats") ||
        normalizedLine.includes("올스탯") ||
        normalizedLine.includes("올스텟");

    return isPrimaryStatLine || isAllStatLine ? value : 0;
};

const calculatePotentialPercent = (
    slot: EquipmentSlotState,
    settings: FlameScoreSettings,
    kind: EquipKind
) =>
    [...slot.potential.lines, ...slot.bonusPotential.lines].reduce(
        (total, line) =>
            total + parsePotentialPercentValue(line, settings, kind),
        0
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

const isJobType = (value: string | null): value is JobType =>
    Boolean(value && JOB_TYPES.includes(value as JobType));

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
    badge: "genesis-badge",
    eye: "papulatus-mark",
    earring: "superior-gollux-earrings",
    medal: "seven-day-monster-parker",
    weapon: "destiny-tuner",
    top: "faf-warrior-top",
    shoulder: "acs-shoulder",
    secondary: "astra-bracelet",
    pocket: "will-red-book",
    belt: "superior-gollux-belt",
    bottom: "faf-warrior-bottom",
    gloves: "acs-gloves",
    cape: "acs-cape",
    shoes: "acs-shoes",
    android: "broid",
    heart: "outlaw-heart",
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
        weapon: "destiny-longsword",
    },
    magician: {
        hat: "faf-mage-hat",
        top: "faf-mage-top",
        bottom: "faf-mage-bottom",
        weapon: "destiny-staff",
    },
    archer: {
        hat: "faf-archer-hat",
        top: "faf-archer-top",
        bottom: "faf-archer-bottom",
        weapon: "destiny-bow",
    },
    thief: {
        hat: "faf-thief-hat",
        top: "faf-thief-top",
        bottom: "faf-thief-bottom",
        weapon: "destiny-dagger",
    },
    pirate: {
        hat: "faf-pirate-hat",
        top: "faf-pirate-top",
        bottom: "faf-pirate-bottom",
        weapon: "destiny-tuner",
    },
};

const getDefaultCatalogItem = (kind: EquipKind, jobType: JobType) =>
    getCatalogItem(kind, JOB_DEFAULT_ITEMS[jobType][kind] || "", jobType) ||
    getCatalogItem(kind, DEFAULT_ITEMS[kind] || "", jobType) ||
    getFilteredCatalogItems(kind, jobType)[0] ||
    EQUIPMENT_BY_KIND[kind][0];

const createEmptySlot = (
    slotId: EquipSlotId,
    jobType: JobType = DEFAULT_JOB_TYPE
): EquipmentSlotState => {
    const kind = slotKind(slotId);
    const item = getDefaultCatalogItem(kind, jobType);

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

const loadStoredFlameScoreSettings = (
    jobType: JobType
): FlameScoreSettings => {
    const defaults = applyJobDefaultsToFlameSettings(
        DEFAULT_FLAME_SCORE_SETTINGS,
        jobType
    );

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

        const parsedSettings = JSON.parse(rawSettings) as Partial<
            Record<keyof FlameScoreSettings, unknown>
        >;

        return {
            primaryStat: isCoreStat(parsedSettings.primaryStat)
                ? parsedSettings.primaryStat
                : defaults.primaryStat,
            secondaryStat: isCoreStat(parsedSettings.secondaryStat)
                ? parsedSettings.secondaryStat
                : defaults.secondaryStat,
            secondaryStatValue: normalizeScoreRatio(
                parsedSettings.secondaryStatValue,
                defaults.secondaryStatValue
            ),
            attackValue: normalizeScoreRatio(
                parsedSettings.attackValue,
                defaults.attackValue
            ),
            allStatPercentValue: normalizeScoreRatio(
                parsedSettings.allStatPercentValue,
                defaults.allStatPercentValue
            ),
            damageBossPercentValue: normalizeScoreRatio(
                parsedSettings.damageBossPercentValue,
                defaults.damageBossPercentValue
            ),
        };
    } catch {
        return defaults;
    }
};

const loadStoredState = (
    jobType: JobType = DEFAULT_JOB_TYPE
): Record<EquipSlotId, EquipmentSlotState> => {
    const initialState = createInitialState(jobType);

    if (typeof window === "undefined") {
        return initialState;
    }

    try {
        const rawState = window.localStorage.getItem("equipmentSetupTracker");
        if (!rawState) {
            return initialState;
        }

        const parsedState = JSON.parse(rawState) as Partial<
            Record<EquipSlotId, Partial<EquipmentSlotState>>
        >;

        return Object.fromEntries(
            EQUIP_SLOT_IDS.map((slotId) => {
                const storedSlot = parsedState[slotId] || {};
                const fallbackSlot = initialState[slotId];
                const kind = slotKind(slotId);
                const storedCatalogItem = storedSlot.itemId
                    ? getCatalogItem(kind, storedSlot.itemId, jobType)
                    : undefined;

                return [
                    slotId,
                    {
                        ...fallbackSlot,
                        ...storedSlot,
                        itemId:
                            storedCatalogItem?.id ||
                            storedSlot.itemId ||
                            fallbackSlot.itemId,
                        itemName:
                            storedSlot.itemName ||
                            storedCatalogItem?.name ||
                            fallbackSlot.itemName,
                        itemImage:
                            storedCatalogItem?.imgPath ||
                            storedSlot.itemImage ||
                            fallbackSlot.itemImage,
                        itemLevel:
                            storedCatalogItem?.level ||
                            storedSlot.itemLevel ||
                            fallbackSlot.itemLevel,
                        itemSetType:
                            storedCatalogItem?.setType ||
                            storedSlot.itemSetType ||
                            fallbackSlot.itemSetType,
                        stars: clampNumber(
                            Math.trunc(
                                Number(storedSlot.stars ?? fallbackSlot.stars) ||
                                    0
                            ),
                            0,
                            MAX_STAR_FORCE
                        ),
                        mesoSpent: normalizeCounterValue(
                            storedSlot.mesoSpent ?? fallbackSlot.mesoSpent
                        ),
                        destructionCount: normalizeCounterValue(
                            storedSlot.destructionCount ??
                                fallbackSlot.destructionCount
                        ),
                        potential: {
                            ...fallbackSlot.potential,
                            ...storedSlot.potential,
                            lines:
                                storedSlot.potential?.lines?.slice(0, 3) ||
                                fallbackSlot.potential.lines,
                        },
                        bonusPotential: {
                            ...fallbackSlot.bonusPotential,
                            ...storedSlot.bonusPotential,
                            lines:
                                storedSlot.bonusPotential?.lines?.slice(0, 3) ||
                                fallbackSlot.bonusPotential.lines,
                        },
                        flames:
                            storedSlot.flames?.slice(0, 4) ||
                            fallbackSlot.flames,
                    },
                ];
            })
        ) as Record<EquipSlotId, EquipmentSlotState>;
    } catch {
        return initialState;
    }
};

function EquipmentSetup() {
    const [selectedSlotId, setSelectedSlotId] =
        React.useState<EquipSlotId>("weapon");
    const [selectedJobType, setSelectedJobType] =
        React.useState<JobType>(DEFAULT_JOB_TYPE);
    const [flameScoreSettings, setFlameScoreSettings] =
        React.useState<FlameScoreSettings>(DEFAULT_FLAME_SCORE_SETTINGS);
    const [equipmentState, setEquipmentState] =
        React.useState<Record<EquipSlotId, EquipmentSlotState>>(
            createInitialState
        );
    const [isLoaded, setIsLoaded] = React.useState(false);

    React.useEffect(() => {
        const storedJobType = loadStoredJobType();
        // Restore browser-only state after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedJobType(storedJobType);
        setFlameScoreSettings(loadStoredFlameScoreSettings(storedJobType));
        setEquipmentState(loadStoredState(storedJobType));
        setIsLoaded(true);
    }, []);

    React.useEffect(() => {
        if (!isLoaded) {
            return;
        }

        localStorage.setItem(
            "equipmentSetupTracker",
            JSON.stringify(equipmentState)
        );
        localStorage.setItem("equipmentSetupJobType", selectedJobType);
        localStorage.setItem(
            "equipmentFlameScoreSettings",
            JSON.stringify(flameScoreSettings)
        );
    }, [equipmentState, flameScoreSettings, isLoaded, selectedJobType]);

    const selectedSlot = equipmentState[selectedSlotId];
    const selectedKind = slotKind(selectedSlotId);
    const selectedCatalogItems = getFilteredCatalogItems(
        selectedKind,
        selectedJobType
    );
    const selectedCatalogItem =
        getCatalogItem(selectedKind, selectedSlot.itemId, selectedJobType) ||
        selectedCatalogItems.find((item) => item.name === selectedSlot.itemName);
    const selectedStatEntries = selectedCatalogItem
        ? Object.entries(selectedCatalogItem.stats).filter(
              ([, value]) => Number(value) !== 0
          )
        : [];
    const countedSetEffects = React.useMemo(
        () => getCountedSetEffects(equipmentState, selectedJobType),
        [equipmentState, selectedJobType]
    );

    const updateJobType = (jobType: JobType) => {
        setSelectedJobType(jobType);
        setFlameScoreSettings((settings) =>
            applyJobDefaultsToFlameSettings(settings, jobType)
        );
    };

    const updateSelectedSlot = (patch: Partial<EquipmentSlotState>) => {
        setEquipmentState((prev) => ({
            ...prev,
            [selectedSlotId]: {
                ...prev[selectedSlotId],
                ...patch,
            },
        }));
    };

    const selectCatalogItem = (itemId: string) => {
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
        });
    };

    const updatePotentialRank = (
        key: "potential" | "bonusPotential",
        rank: PotentialRank
    ) => {
        updateSelectedSlot({
            [key]: {
                ...selectedSlot[key],
                rank,
            },
        } as Partial<EquipmentSlotState>);
    };

    const updatePotentialLine = (
        key: "potential" | "bonusPotential",
        index: number,
        value: string
    ) => {
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
        const flames = selectedSlot.flames.map((line, lineIndex) =>
            lineIndex === index ? { ...line, ...patch } : line
        );

        updateSelectedSlot({ flames });
    };

    const resetSelectedSlot = () => {
        updateSelectedSlot(createEmptySlot(selectedSlotId, selectedJobType));
    };

    const resetAllSlots = () => {
        setEquipmentState(createInitialState(selectedJobType));
        setSelectedSlotId("weapon");
    };

    return (
        <InfoBlock title="equipment setup" src="/image/equipment/icons/weapon.png">
            <JobTypeSelector
                selectedJobType={selectedJobType}
                onChange={updateJobType}
            />

            <div className="grid gap-4 xl:grid-cols-[minmax(310px,430px)_minmax(360px,1fr)]">
                <EquipmentGridPanel
                    equipmentState={equipmentState}
                    flameScoreSettings={flameScoreSettings}
                    selectedJobType={selectedJobType}
                    selectedSlotId={selectedSlotId}
                    setEffects={countedSetEffects}
                    onSelectSlot={setSelectedSlotId}
                />
                <SelectedEquipmentPanel
                    selectedCatalogItem={selectedCatalogItem}
                    selectedCatalogItems={selectedCatalogItems}
                    selectedJobType={selectedJobType}
                    selectedKind={selectedKind}
                    selectedSlot={selectedSlot}
                    selectedSlotId={selectedSlotId}
                    selectedStatEntries={selectedStatEntries}
                    flameScoreSettings={flameScoreSettings}
                    onFlameScoreSettingsChange={setFlameScoreSettings}
                    onFlameLineChange={updateFlameLine}
                    onPotentialLineChange={updatePotentialLine}
                    onPotentialRankChange={updatePotentialRank}
                    onResetAll={resetAllSlots}
                    onResetSlot={resetSelectedSlot}
                    onSelectCatalogItem={selectCatalogItem}
                    onSlotChange={updateSelectedSlot}
                />
            </div>
        </InfoBlock>
    );
}

function EquipmentGridPanel({
    equipmentState,
    flameScoreSettings,
    selectedJobType,
    selectedSlotId,
    setEffects,
    onSelectSlot,
}: Readonly<{
    equipmentState: Record<EquipSlotId, EquipmentSlotState>;
    flameScoreSettings: FlameScoreSettings;
    selectedJobType: JobType;
    selectedSlotId: EquipSlotId;
    setEffects: CountedSetEffect[];
    onSelectSlot: (slotId: EquipSlotId) => void;
}>) {
    return (
        <div className="min-w-0">
            <div className="overflow-x-auto">
                <div className="relative w-[428px] max-w-full">
                    <img
                        src="/image/equipment/equip-tab.png"
                        alt="Equipment window"
                        className="w-full rounded-md [image-rendering:pixelated]"
                    />
                    <div className="absolute left-0 top-0 grid grid-cols-5 gap-[6px] px-[10px] py-[12px]">
                        {EQUIP_GRID.map((slotId, index) =>
                            slotId ? (
                                <EquipmentGridSlot
                                    equipmentState={equipmentState}
                                    flameScoreSettings={flameScoreSettings}
                                    isSelected={slotId === selectedSlotId}
                                    selectedJobType={selectedJobType}
                                    slotId={slotId}
                                    onSelect={onSelectSlot}
                                    key={slotId}
                                />
                            ) : (
                                <div
                                    className="h-[76px] w-[76px]"
                                    key={`blank-${index}`}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>

            <SetEffectsPanel setEffects={setEffects} />
        </div>
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
    const potentialPercent = calculatePotentialPercent(
        slot,
        flameScoreSettings,
        slotKind(slotId)
    );
    const flameScore = calculateFlameScore(
        slot,
        flameScoreSettings,
        catalogItem
    );

    return (
        <button
            type="button"
            className={`relative flex h-[76px] w-[76px] items-center justify-center rounded-md border-2 bg-black/10 transition-colors ${
                isSelected
                    ? "border-primary bg-primary/20"
                    : `${POTENTIAL_BORDER[slot.potential.rank]} hover:border-primary`
            }`}
            onClick={() => onSelect(slotId)}
            title={SLOT_LABELS[slotId]}
            aria-label={SLOT_LABELS[slotId]}
        >
            <img
                src={slot.itemImage}
                alt=""
                className="max-h-12 max-w-12 object-contain"
            />
            {slot.stars > 0 ? (
                <span className="absolute right-1 top-1 rounded bg-black/75 px-1 text-[10px] font-bold leading-4 text-yellow-200">
                    ★{slot.stars}
                </span>
            ) : null}
            {potentialPercent > 0 ? (
                <span className="absolute left-1 top-1 rounded bg-sky-500/90 px-1 text-[10px] font-bold leading-4 text-white">
                    {formatScore(potentialPercent)}%
                </span>
            ) : null}
            {slot.destructionCount > 0 ? (
                <span className="absolute bottom-1 right-1 rounded bg-red-700/90 px-1 text-[10px] font-bold leading-4 text-red-100">
                    ×{slot.destructionCount}
                </span>
            ) : null}
            {flameScore > 0 ? (
                <span className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded bg-black/80 px-1 text-[10px] font-bold leading-4 text-slate-100">
                    <img
                        src={BLACK_FLAME_ICON}
                        alt=""
                        className="h-3 w-3 object-contain"
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
    selectedStatEntries,
    flameScoreSettings,
    onFlameScoreSettingsChange,
    onFlameLineChange,
    onPotentialLineChange,
    onPotentialRankChange,
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
    selectedStatEntries: [string, number][];
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
    onPotentialRankChange: (
        key: "potential" | "bonusPotential",
        rank: PotentialRank
    ) => void;
    onResetAll: () => void;
    onResetSlot: () => void;
    onSelectCatalogItem: (itemId: string) => void;
    onSlotChange: (patch: Partial<EquipmentSlotState>) => void;
}>) {
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
                        Reset All
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

            <label className="mb-3 block text-sm">
                <span className="mb-1 block text-slate-300">
                    Equipment name
                </span>
                <input
                    className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-white outline-none focus:border-primary"
                    value={selectedSlot.itemName}
                    onChange={(event) =>
                        onSlotChange({ itemName: event.target.value })
                    }
                />
            </label>

            <div className="mb-4 grid gap-2 rounded-md bg-slate-900/70 p-3 text-sm sm:grid-cols-2">
                <div>
                    <div className="text-slate-400">Level</div>
                    <div className="font-bold text-white">
                        {selectedSlot.itemLevel || "-"}
                    </div>
                </div>
                <div>
                    <div className="text-slate-400">Set</div>
                    <div className="font-bold text-white">
                        {selectedSlot.itemSetType || "none"}
                    </div>
                </div>
                {selectedStatEntries.length > 0 ? (
                    <div className="col-span-full flex flex-wrap gap-1">
                        {selectedStatEntries.slice(0, 10).map(([key, value]) => (
                            <span
                                className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-200"
                                key={key}
                            >
                                {key} +{value}
                            </span>
                        ))}
                    </div>
                ) : null}
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
                            max={MAX_STAR_FORCE}
                            value={selectedSlot.stars}
                            onChange={(event) =>
                                onSlotChange({
                                    stars: clampNumber(
                                        Math.trunc(
                                            Number(event.target.value) || 0
                                        ),
                                        0,
                                        MAX_STAR_FORCE
                                    ),
                                })
                            }
                            className="w-20 rounded-md border border-slate-600 bg-slate-950 px-2 py-1 text-right text-yellow-200 outline-none focus:border-primary"
                            aria-label="Star Force value"
                        />
                    </div>
                </div>
                <StarForceSelector
                    value={selectedSlot.stars}
                    onChange={(stars) => onSlotChange({ stars })}
                />
            </section>

            <section className="mb-4 rounded-md bg-slate-900/70 p-3">
                <h3 className="mb-2 text-sm font-bold uppercase text-slate-200">
                    Enhancement Memo
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    <CounterControl
                        label="Meso spent"
                        value={selectedSlot.mesoSpent}
                        step={MESO_COUNTER_STEP}
                        decrementLabel="-100m"
                        incrementLabel="+100m"
                        suffix="mesos"
                        onChange={(mesoSpent) => onSlotChange({ mesoSpent })}
                    />
                    <CounterControl
                        label="Destructions"
                        value={selectedSlot.destructionCount}
                        step={1}
                        decrementLabel="-1"
                        incrementLabel="+1"
                        suffix="times"
                        onChange={(destructionCount) =>
                            onSlotChange({ destructionCount })
                        }
                    />
                </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
                <PotentialEditor
                    title="Potential"
                    block={selectedSlot.potential}
                    equipKind={selectedKind}
                    itemLevel={selectedSlot.itemLevel}
                    settings={flameScoreSettings}
                    onRankChange={(rank) =>
                        onPotentialRankChange("potential", rank)
                    }
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
                    onRankChange={(rank) =>
                        onPotentialRankChange("bonusPotential", rank)
                    }
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
                                            })
                                        }
                                    >
                                        {FLAME_STATS.map((stat) => (
                                            <option value={stat} key={stat}>
                                                {stat}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        min={0}
                                        max={7}
                                        className="h-10 rounded-md border border-slate-600 bg-slate-950 px-2 text-right text-sm leading-10 outline-none focus:border-primary"
                                        value={line.tier}
                                        onChange={(event) =>
                                            onFlameLineChange(index, {
                                                tier: clampNumber(
                                                    Math.trunc(
                                                        Number(
                                                            event.target.value
                                                        ) || 0
                                                    ),
                                                    0,
                                                    7
                                                ),
                                            })
                                        }
                                        aria-label={`Bonus stat ${index + 1} tier`}
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

function JobTypeSelector({
    selectedJobType,
    onChange,
}: Readonly<{
    selectedJobType: JobType;
    onChange: (jobType: JobType) => void;
}>) {
    return (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
            <div className="font-bold uppercase text-slate-200">Job filter</div>
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
    );
}

function FlameScoreSettingsPanel({
    settings,
    onChange,
}: Readonly<{
    settings: FlameScoreSettings;
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
        <div className="rounded-md border border-slate-700 bg-slate-950 p-3 text-sm">
            <div className="mb-2 flex items-center gap-2 font-bold uppercase text-slate-200">
                <img
                    src={BLACK_FLAME_ICON}
                    alt=""
                    className="h-5 w-5 object-contain"
                />
                Flame ratios
            </div>
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
                    label="1 ATT / MATT"
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
        </div>
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
            <div className="grid grid-cols-[minmax(0,1fr)_36px] items-center gap-2">
                <input
                    type="number"
                    min={0}
                    step={0.125}
                    className="h-10 min-w-0 rounded-md border border-slate-600 bg-slate-900 px-2 text-right outline-none focus:border-primary"
                    value={value}
                    onChange={(event) => onChange(event.target.valueAsNumber)}
                />
                <span className="text-left text-xs text-slate-500">main</span>
            </div>
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
        <section className="mt-3 rounded-md border border-slate-700 bg-slate-800/60 p-3 text-sm">
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
    onChange,
}: Readonly<{
    value: number;
    onChange: (value: number) => void;
}>) {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const isDraggingRef = React.useRef(false);

    const getStarValueFromPoint = React.useCallback(
        (clientX: number, clientY: number) => {
            const root = rootRef.current;
            if (!root) {
                return value;
            }

            const element = document.elementFromPoint(clientX, clientY);
            const directButton = element?.closest<HTMLButtonElement>(
                "[data-star-value]"
            );

            if (directButton && root.contains(directButton)) {
                return clampNumber(
                    Number(directButton.dataset.starValue) || 0,
                    0,
                    MAX_STAR_FORCE
                );
            }

            const buttons = Array.from(
                root.querySelectorAll<HTMLButtonElement>("[data-star-value]")
            );
            let closestValue = value;
            let closestDistance = Number.POSITIVE_INFINITY;

            for (const button of buttons) {
                const rect = button.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const distance =
                    (centerX - clientX) ** 2 + (centerY - clientY) ** 2;

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestValue = Number(button.dataset.starValue) || value;
                }
            }

            return clampNumber(closestValue, 0, MAX_STAR_FORCE);
        },
        [value]
    );

    const updateFromPointer = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            onChange(getStarValueFromPoint(event.clientX, event.clientY));
        },
        [getStarValueFromPoint, onChange]
    );

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) {
            return;
        }

        isDraggingRef.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.preventDefault();
        updateFromPointer(event);
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
            className="flex touch-none select-none flex-wrap gap-x-4 gap-y-2"
            ref={rootRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            role="group"
            aria-label="Star Force stars"
        >
            {Array.from({ length: MAX_STAR_FORCE / STAR_GROUP_SIZE }).map(
                (_, groupIndex) => (
                    <div
                        className="flex gap-0.5"
                        key={`star-group-${groupIndex}`}
                    >
                        {Array.from({ length: STAR_GROUP_SIZE }).map(
                            (__, starIndex) => {
                                const starValue =
                                    groupIndex * STAR_GROUP_SIZE +
                                    starIndex +
                                    1;
                                const isFilled = starValue <= value;

                                return (
                                    <button
                                        type="button"
                                        className={`h-7 w-6 rounded-sm text-xl leading-7 transition-colors ${
                                            isFilled
                                                ? "text-yellow-300"
                                                : "text-slate-600 hover:text-yellow-100"
                                        }`}
                                        data-star-value={starValue}
                                        aria-label={`Set Star Force to ${starValue}`}
                                        aria-pressed={isFilled}
                                        onClick={() => onChange(starValue)}
                                        key={starValue}
                                    >
                                        {isFilled ? "★" : "☆"}
                                    </button>
                                );
                            }
                        )}
                    </div>
                )
            )}
        </div>
    );
}

function CounterControl({
    label,
    value,
    step,
    decrementLabel,
    incrementLabel,
    suffix,
    onChange,
}: Readonly<{
    label: string;
    value: number;
    step: number;
    decrementLabel: string;
    incrementLabel: string;
    suffix: string;
    onChange: (value: number) => void;
}>) {
    const updateValue = (nextValue: number) => {
        onChange(normalizeCounterValue(nextValue));
    };

    return (
        <div className="rounded-md border border-slate-700 bg-slate-950 p-3">
            <div className="mb-2 text-sm text-slate-300">{label}</div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="h-9 shrink-0 rounded-md border border-slate-600 px-2 text-xs text-slate-200 hover:border-primary hover:text-primary"
                    onClick={() => updateValue(value - step)}
                >
                    {decrementLabel}
                </button>
                <input
                    type="number"
                    min={0}
                    step={step}
                    value={value}
                    onChange={(event) => updateValue(event.target.valueAsNumber)}
                    className="min-w-0 flex-1 rounded-md border border-slate-600 bg-slate-900 px-2 py-2 text-right text-sm text-white outline-none focus:border-primary"
                    aria-label={label}
                />
                <button
                    type="button"
                    className="h-9 shrink-0 rounded-md border border-slate-600 px-2 text-xs text-slate-200 hover:border-primary hover:text-primary"
                    onClick={() => updateValue(value + step)}
                >
                    {incrementLabel}
                </button>
            </div>
            <div className="mt-2 break-words text-xs text-slate-400">
                {formatInteger(value)} {suffix}
            </div>
        </div>
    );
}

function PotentialEditor({
    title,
    block,
    equipKind,
    itemLevel,
    settings,
    onRankChange,
    onLineChange,
}: Readonly<{
    title: string;
    block: PotentialBlock;
    equipKind: EquipKind;
    itemLevel: number;
    settings: FlameScoreSettings;
    onRankChange: (rank: PotentialRank) => void;
    onLineChange: (index: number, value: string) => void;
}>) {
    const datalistId = React.useId();
    const percentValues = getPotentialPercentValues(block.rank, itemLevel);
    const metricLabel = getPotentialMetricLabel(equipKind, settings);
    const suggestions = React.useMemo(
        () =>
            getPotentialSuggestions(
                itemLevel,
                settings,
                equipKind,
                block.rank
            ),
        [block.rank, equipKind, itemLevel, settings]
    );
    const totalPercent = block.lines.reduce(
        (total, line) =>
            total + parsePotentialPercentValue(line, settings, equipKind),
        0
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
                        {metricLabel} {formatScore(totalPercent)}%
                    </div>
                </div>
                <select
                    className={`rounded-md border bg-slate-950 px-2 py-1 text-sm outline-none focus:border-primary ${POTENTIAL_BORDER[block.rank]}`}
                    value={block.rank}
                    onChange={(event) =>
                        onRankChange(event.target.value as PotentialRank)
                    }
                >
                    {POTENTIAL_RANKS.map((rank) => (
                        <option value={rank} key={rank}>
                            {POTENTIAL_LABELS[rank]}
                        </option>
                    ))}
                </select>
            </div>
            {percentValues.length > 0 ? (
                <div className="mb-2 text-xs text-slate-400">
                    Lv. {itemLevel || "-"} possible % lines:{" "}
                    {percentValues.join(" / ")}
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
