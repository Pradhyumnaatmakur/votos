import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5173",
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            if (req.url.startsWith("/api/recommendations/")) {
              handleRecommendations(req, res);
            } else if (req.url.startsWith("/api/search")) {
              handleSearch(req, res);
            } else if (req.url.startsWith("/api/comments/")) {
              handleComments(req, res);
            }
          });
        },
      },
    },
  },
});

function handleRecommendations(req, res) {
  const [, , , category, title] = req.url.split("/");
  const recommendationsPath = path.resolve(
    __dirname,
    "src/db/recommendations.json"
  );

  if (req.method === "GET") {
    try {
      let recommendations = {};
      if (fs.existsSync(recommendationsPath)) {
        recommendations = JSON.parse(
          fs.readFileSync(recommendationsPath, "utf-8")
        );
      }
      const titleRecommendations = recommendations[category]?.[title] || [];
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(titleRecommendations));
    } catch (error) {
      console.error("Error reading recommendations:", error);
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          message: "Failed to get recommendations",
          error: error.message,
        })
      );
    }
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        let recommendations = {};
        if (fs.existsSync(recommendationsPath)) {
          recommendations = JSON.parse(
            fs.readFileSync(recommendationsPath, "utf-8")
          );
        }
        if (!recommendations[category]) {
          recommendations[category] = {};
        }
        if (!recommendations[category][title]) {
          recommendations[category][title] = [];
        }
        const newRecommendation = JSON.parse(body);

        // Check for duplicate
        const isDuplicate = recommendations[category][title].some(
          (rec) =>
            rec.title === newRecommendation.title &&
            rec.year === newRecommendation.year
        );

        if (isDuplicate) {
          res.statusCode = 409; // Conflict
          res.end(
            JSON.stringify({ message: "This recommendation already exists" })
          );
          return;
        }

        // Add the new recommendation
        recommendations[category][title].push(newRecommendation);
        fs.writeFileSync(
          recommendationsPath,
          JSON.stringify(recommendations, null, 2)
        );
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(newRecommendation));
      } catch (error) {
        console.error("Error writing recommendations:", error);
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            message: "Failed to add recommendation",
            error: error.message,
          })
        );
      }
    });
  }
}

function handleSearch(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const query = url.searchParams.get("q");
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
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const categoryResults = data
          .filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          )
          .map((item) => ({ ...item, category }));
        results.push(...categoryResults);
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  }

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(results));
}

function handleComments(req, res) {
  const [, , , category, title] = req.url.split("/");
  const commentsPath = path.resolve(__dirname, "src/db/comments.json");

  if (req.method === "GET") {
    try {
      let comments = {};
      if (fs.existsSync(commentsPath)) {
        comments = JSON.parse(fs.readFileSync(commentsPath, "utf-8"));
      }
      const titleComments = comments[category]?.[title] || [];
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(titleComments));
    } catch (error) {
      console.error("Error reading comments:", error);
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          message: "Failed to get comments",
          error: error.message,
        })
      );
    }
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        let comments = {};
        if (fs.existsSync(commentsPath)) {
          comments = JSON.parse(fs.readFileSync(commentsPath, "utf-8"));
        }
        if (!comments[category]) {
          comments[category] = {};
        }
        if (!comments[category][title]) {
          comments[category][title] = [];
        }
        const newComment = JSON.parse(body);
        comments[category][title].push(newComment);
        fs.writeFileSync(commentsPath, JSON.stringify(comments, null, 2));
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(newComment));
      } catch (error) {
        console.error("Error writing comment:", error);
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            message: "Failed to add comment",
            error: error.message,
          })
        );
      }
    });
  }
}
