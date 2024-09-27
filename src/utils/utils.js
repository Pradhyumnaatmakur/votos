// src/utils/utils.js

import { loadData } from "./dataLoader";

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

export async function addRecommendation(category, title, recommendation) {
  try {
    const response = await fetch(`/api/recommendations/${category}/${title}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recommendation),
    });

    if (!response.ok) {
      throw new Error("Failed to add recommendation");
    }

    return true;
  } catch (error) {
    console.error("Error adding recommendation:", error);
    return false;
  }
}

export async function getRecommendations(category, title) {
  try {
    const response = await fetch(`/api/recommendations/${category}/${title}`);
    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}

export async function searchContent(query) {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching content:", error);
    return [];
  }
}
