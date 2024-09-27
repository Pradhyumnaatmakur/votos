const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const app = express();

app.use(express.json());

app.get("/api/search", async (req, res) => {
  const { query } = req.query;
  const categories = [
    "korean-movies",
    "chinese-movies",
    "japanese-movies",
    "thai-movies",
    "korean-dramas",
    "chinese-dramas",
    "japanese-dramas",
    "thai-dramas",
  ];

  const results = [];

  for (const category of categories) {
    const filePath = path.join(
      __dirname,
      "db",
      `${category.replace("-", "")}.json`
    );
    try {
      const data = JSON.parse(await fs.readFile(filePath, "utf-8"));
      const categoryResults = data
        .filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        )
        .map((item) => ({ ...item, category }));
      results.push(...categoryResults);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  }

  res.json(results);
});

app.post("/api/recommendations/:category/:title", async (req, res) => {
  const { category, title } = req.params;
  const recommendation = req.body;
  const filePath = path.join(__dirname, "db", "recommendations.json");

  try {
    // Ensure the db directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    let recommendations = {};
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      recommendations = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or is empty, start with an empty object
      console.log("Creating new recommendations file");
    }

    if (!recommendations[category]) {
      recommendations[category] = {};
    }

    if (!recommendations[category][title]) {
      recommendations[category][title] = [];
    }

    recommendations[category][title].push(recommendation);

    await fs.writeFile(filePath, JSON.stringify(recommendations, null, 2));
    res.status(201).json(recommendation);
  } catch (error) {
    console.error("Error writing recommendations:", error);
    res
      .status(500)
      .json({ message: "Failed to add recommendation", error: error.message });
  }
});

app.get("/api/recommendations/:category/:title", async (req, res) => {
  const { category, title } = req.params;
  const filePath = path.join(__dirname, "db", "recommendations.json");

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const recommendations = JSON.parse(fileContent);
    const titleRecommendations = recommendations[category]?.[title] || [];
    res.json(titleRecommendations);
  } catch (error) {
    console.error("Error reading recommendations:", error);
    res
      .status(500)
      .json({ message: "Failed to get recommendations", error: error.message });
  }
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
s;
