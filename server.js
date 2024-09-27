const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const app = express();

app.use(express.json());

app.get("/api/search", async (req, res) => {
  const { q: query } = req.query;
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
      "src",
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

app.get("/api/recommendations/:category/:title", async (req, res) => {
  const { category, title } = req.params;
  const recommendationsPath = path.join(
    __dirname,
    "src",
    "db",
    "recommendations.json"
  );

  try {
    const recommendations = JSON.parse(
      await fs.readFile(recommendationsPath, "utf-8")
    );
    const titleRecommendations = recommendations[category]?.[title] || [];
    res.json(titleRecommendations);
  } catch (error) {
    console.error("Error reading recommendations:", error);
    res
      .status(500)
      .json({ message: "Failed to get recommendations", error: error.message });
  }
});

app.post("/api/recommendations/:category/:title", async (req, res) => {
  const { category, title } = req.params;
  const recommendation = req.body;
  const recommendationsPath = path.join(
    __dirname,
    "src",
    "db",
    "recommendations.json"
  );

  try {
    let recommendations = {};
    try {
      recommendations = JSON.parse(
        await fs.readFile(recommendationsPath, "utf-8")
      );
    } catch (error) {
      // File doesn't exist or is empty, start with an empty object
    }

    if (!recommendations[category]) {
      recommendations[category] = {};
    }
    if (!recommendations[category][title]) {
      recommendations[category][title] = [];
    }

    const isDuplicate = recommendations[category][title].some(
      (rec) =>
        rec.title === recommendation.title && rec.year === recommendation.year
    );

    if (isDuplicate) {
      return res
        .status(409)
        .json({ message: "This recommendation already exists" });
    }

    recommendations[category][title].push(recommendation);
    await fs.writeFile(
      recommendationsPath,
      JSON.stringify(recommendations, null, 2)
    );
    res.status(201).json(recommendation);
  } catch (error) {
    console.error("Error writing recommendations:", error);
    res
      .status(500)
      .json({ message: "Failed to add recommendation", error: error.message });
  }
});

app.get("/api/comments/:category/:title", async (req, res) => {
  const { category, title } = req.params;
  const commentsPath = path.join(__dirname, "src", "db", "comments.json");

  try {
    const comments = JSON.parse(await fs.readFile(commentsPath, "utf-8"));
    const titleComments = comments[category]?.[title] || [];
    res.json(titleComments);
  } catch (error) {
    console.error("Error reading comments:", error);
    res
      .status(500)
      .json({ message: "Failed to get comments", error: error.message });
  }
});

app.post("/api/comments/:category/:title", async (req, res) => {
  const { category, title } = req.params;
  const newComment = req.body;
  const commentsPath = path.join(__dirname, "src", "db", "comments.json");

  try {
    let comments = {};
    try {
      comments = JSON.parse(await fs.readFile(commentsPath, "utf-8"));
    } catch (error) {
      // File doesn't exist or is empty, start with an empty object
    }

    if (!comments[category]) {
      comments[category] = {};
    }
    if (!comments[category][title]) {
      comments[category][title] = [];
    }

    comments[category][title].push(newComment);
    await fs.writeFile(commentsPath, JSON.stringify(comments, null, 2));
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error writing comment:", error);
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
