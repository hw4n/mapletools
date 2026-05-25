import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const jobs = {
    warrior: [
        "adele",
        "aran",
        "blaster",
        "dk",
        "da",
        "ds",
        "hayato",
        "hero",
        "len",
        "mihile",
        "kaiser",
        "paladin",
        "sm",
        "zero",
    ],
    magician: [
        "bam",
        "bs",
        "evan",
        "fp",
        "fw",
        "il",
        "illium",
        "kanna",
        "kinesis",
        "lara",
        "lumi",
        "lynn",
        "sia",
    ],
    archer: ["bm", "xbm", "kain", "merc", "pf", "wh", "wb"],
    thief: [
        "cadena",
        "db",
        "hy",
        "khali",
        "nl",
        "nw",
        "phantom",
        "sdw",
        "xenon",
    ],
    pirate: [
        "ab",
        "ark",
        "cm",
        "captain",
        "eunwol",
        "mech",
        "mx",
        "striker",
        "viper",
        "xenon",
    ],
};

const jobTypes = Object.keys(jobs);
const apiBaseUrl = "https://www.whackybeanz.com/api";
const projectRoot = process.cwd();
const dataDir = path.join(projectRoot, "app/data");
const flameResources = [
    {
        url: "https://pub-37581592c5a045f3ad8b1881608a2769.r2.dev/images%2Fitems%2Fflames%2Fflame-black.png",
        path: "public/image/equipment/flames/black-flame.png",
    },
];

const sanitizeFileName = (value) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "");

async function fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}: ${url}`);
    }

    return response.json();
}

async function downloadImage(url, targetPath) {
    if (existsSync(targetPath)) {
        return;
    }

    const response = await fetch(url);

    if (!response.ok) {
        return `${response.status} ${response.statusText}: ${url}`;
    }

    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, Buffer.from(await response.arrayBuffer()));
    return null;
}

function normalizeItem(item) {
    const imageUrl = item.imgUrl || "";
    const imageName =
        sanitizeFileName(path.basename(new URL(imageUrl).pathname)) ||
        `${item.id}.png`;
    const equipType = item.equipType;
    const jobType = item.jobType || "common";

    return {
        id: jobType === "common" ? item.id : `${jobType}__${item.id}`,
        baseId: item.id,
        name: item.name,
        jobType,
        equipType,
        level: item.level || 0,
        setType: item.setType || "none",
        region: item.region || "",
        width: item.width || 32,
        height: item.height || 32,
        isNormalFlame: Boolean(item.isNormalFlame),
        isLuckyItem: Boolean(item.isLuckyItem),
        itemPriority: Number.isFinite(item.itemPriority)
            ? item.itemPriority
            : null,
        stats: item.stats || {},
        downloadUrl: imageUrl,
        imgPath: `/image/equipment/catalog/${equipType}/${imageName}`,
    };
}

const allItems = new Map();
let endpointCount = 0;

for (const [jobType, charTypes] of Object.entries(jobs)) {
    for (const charType of charTypes) {
        const endpoint = `${apiBaseUrl}/getEquips/${jobType}/${charType}`;
        endpointCount += 1;
        const data = await fetchJson(endpoint);

        for (const group of Object.values(data.equipByType || {})) {
            for (const item of group.equips || []) {
                const normalizedItem = normalizeItem(item);
                const key = `${normalizedItem.equipType}:${normalizedItem.id}`;
                const existingItem = allItems.get(key);

                if (existingItem) {
                    existingItem.jobTypes = [
                        ...new Set([...existingItem.jobTypes, jobType]),
                    ].sort();
                    continue;
                }

                allItems.set(key, {
                    ...normalizedItem,
                    jobTypes:
                        normalizedItem.jobType === "common"
                            ? [...jobTypes]
                            : [jobType],
                });
            }
        }
    }
}

const sortedItems = [...allItems.values()].sort(
    (a, b) =>
        a.equipType.localeCompare(b.equipType) ||
        b.level - a.level ||
        a.jobType.localeCompare(b.jobType) ||
        a.name.localeCompare(b.name)
);

const imageFailures = [];

for (const resource of flameResources) {
    const imageFailure = await downloadImage(
        resource.url,
        path.join(projectRoot, resource.path)
    );

    if (imageFailure) {
        imageFailures.push(imageFailure);
    }
}

for (const item of sortedItems) {
    const targetPath = path.join(projectRoot, "public", item.imgPath);
    const imageFailure = await downloadImage(item.downloadUrl, targetPath);

    if (imageFailure) {
        imageFailures.push(imageFailure);
        item.imgPath = `/image/equipment/icons/${item.equipType}.png`;
    }
}

const outputItems = sortedItems.map((item) => {
    const outputItem = { ...item };
    delete outputItem.downloadUrl;
    return outputItem;
});

const setEffects = [];

for (const jobType of Object.keys(jobs)) {
    const endpoint = `${apiBaseUrl}/getSetEffects/${jobType}`;
    endpointCount += 1;
    const data = await fetchJson(endpoint);

    setEffects.push({
        jobType,
        list: data.list || [],
    });
}

await mkdir(dataDir, { recursive: true });
await writeFile(
    path.join(dataDir, "equipment-items.json"),
    `${JSON.stringify(outputItems, null, 2)}\n`
);
await writeFile(
    path.join(dataDir, "equipment-set-effects.json"),
    `${JSON.stringify(setEffects, null, 2)}\n`
);

console.log(
    JSON.stringify(
        {
            uniqueItems: outputItems.length,
            endpoints: endpointCount,
            imageFailures: imageFailures.length,
            output: {
                items: "app/data/equipment-items.json",
                setEffects: "app/data/equipment-set-effects.json",
                images: "public/image/equipment/catalog",
            },
        },
        null,
        2
    )
);
