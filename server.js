const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const app = express();

app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// API Routes
app.get("/api/search", async (req, res) => {
  const { q } = req.query;
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
        .filter((item) => item.title.toLowerCase().includes(q.toLowerCase()))
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
  const filePath = path.join(__dirname, "db", "recommendations.json");

  try {
    let recommendations = {};
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      recommendations = JSON.parse(fileContent);
    } catch (error) {
      console.log("No existing recommendations file, creating a new one");
    }

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
  const filePath = path.join(__dirname, "db", "recommendations.json");

  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    let recommendations = {};
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      recommendations = JSON.parse(fileContent);
    } catch (error) {
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
    console.error("Error writing recommendation:", error);
    res
      .status(500)
      .json({ message: "Failed to add recommendation", error: error.message });
  }
});

app.get("/api/comments/:category/:title", async (req, res) => {
  const { category, title } = req.params;
  const filePath = path.join(__dirname, "db", "comments.json");

  try {
    let comments = {};
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      comments = JSON.parse(fileContent);
    } catch (error) {
      console.log("No existing comments file, creating a new one");
    }

    const titleComments = comments[category]?.[title] || [];
    res.json(titleComments);
  } catch (error) {
    console.error("Error reading comments:", error);
    res
      .status(500)
      .json({ message: "Failed to get comments", error: error.message });
  }
});

app.get("/api/comments/:category/:title", async (req, res) => {
  const { category, title } = req.params;
  const filePath = path.join(__dirname, "db", "comments.json");

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const comments = JSON.parse(fileContent);
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
  const comment = req.body;
  const filePath = path.join(__dirname, "db", "comments.json");

  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    let comments = {};
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      comments = JSON.parse(fileContent);
    } catch (error) {
      console.log("Creating new comments file");
    }

    if (!comments[category]) {
      comments[category] = {};
    }

    if (!comments[category][title]) {
      comments[category][title] = [];
    }

    comments[category][title].push(comment);

    await fs.writeFile(filePath, JSON.stringify(comments, null, 2));
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error writing comment:", error);
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
