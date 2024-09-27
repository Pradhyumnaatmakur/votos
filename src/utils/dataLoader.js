// src/utils/dataLoader.js

const dataFiles = {
  "korean-movies": () => import("../db/kmoviedb.json"),
  "chinese-movies": () => import("../db/cmoviedb.json"),
  "japanese-movies": () => import("../db/jmoviedb.json"),
  "thai-movies": () => import("../db/tmoviedb.json"),
  "korean-dramas": () => import("../db/kdramadb.json"),
  "chinese-dramas": () => import("../db/cdramadb.json"),
  "japanese-dramas": () => import("../db/jdramadb.json"),
  "thai-dramas": () => import("../db/tdramadb.json"),
};

export async function loadData(category) {
  try {
    const loader = dataFiles[category];
    if (!loader) {
      throw new Error(`Invalid category: ${category}`);
    }
    const data = await loader();
    return data.default;
  } catch (error) {
    console.error(`Error loading data for ${category}:`, error);
    return [];
  }
}

export async function loadAllData() {
  const allData = {};
  for (const category in dataFiles) {
    allData[category] = await loadData(category);
  }
  return allData;
}

export function generateSlug(item) {
  return (
    item.title
      .toLowerCase()
      .replace(/[,./?()*%$#@!]/g, "-")
      .replace(/\s+/g, "-") +
    "-" +
    item.year
  );
}

export function getCategoryName(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function isMoveOrDrama(category) {
  return category.endsWith("-movies") ? "movie" : "drama";
}
