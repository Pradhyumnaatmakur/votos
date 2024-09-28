const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const app = express();

app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// API Routes
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

    const encodedCategory = encodeURIComponent(category);
    const encodedTitle = encodeURIComponent(title);
    const titleRecommendations =
      recommendations[encodedCategory]?.[encodedTitle] || [];
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

    const encodedCategory = encodeURIComponent(category);
    const encodedTitle = encodeURIComponent(title);

    if (!recommendations[encodedCategory]) {
      recommendations[encodedCategory] = {};
    }

    if (!recommendations[encodedCategory][encodedTitle]) {
      recommendations[encodedCategory][encodedTitle] = [];
    }

    recommendations[encodedCategory][encodedTitle].push(recommendation);

    await fs.writeFile(filePath, JSON.stringify(recommendations, null, 2));
    res.status(201).json(recommendation);
  } catch (error) {
    console.error("Error writing recommendation:", error);
    res
      .status(500)
      .json({ message: "Failed to add recommendation", error: error.message });
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
