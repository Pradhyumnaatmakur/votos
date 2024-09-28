// src/utils/utils.js

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

async function handleApiResponse(response, errorMessage) {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `${errorMessage} Status: ${response.status}, Response: ${errorText}`
    );
    throw new Error(`${errorMessage} Status: ${response.status}`);
  }
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    const text = await response.text();
    console.error(`Unexpected response format. Expected JSON, got: ${text}`);
    throw new Error("Unexpected response format");
  }
}

export async function addRecommendation(category, title, recommendation) {
  try {
    const response = await fetch(
      `/api/recommendations/${encodeURIComponent(
        category
      )}/${encodeURIComponent(title)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recommendation),
      }
    );

    await handleApiResponse(response, "Failed to add recommendation");
    return true;
  } catch (error) {
    console.error("Error adding recommendation:", error);
    return false;
  }
}

export async function getRecommendations(category, title) {
  try {
    const response = await fetch(
      `/api/recommendations/${encodeURIComponent(
        category
      )}/${encodeURIComponent(title)}`
    );
    return await handleApiResponse(response, "Failed to fetch recommendations");
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}
