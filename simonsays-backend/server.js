const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔴 YAHAN APNA MONGODB URL DALNA
const uri =
  "mongodb+srv://simongameuser:simongame123@cluster1.t6eaelp.mongodb.net/?appName=Cluster1";

const client = new MongoClient(uri);

let db;

// Connect DB
async function connectDB() {
  await client.connect();
  db = client.db("simongame");
  console.log("MongoDB connected");
}
connectDB();

// API to save score
app.post("/save-score", async (req, res) => {
  const { score, name } = req.body;

  await db.collection("scores").insertOne({ score, name });

  res.json({ message: "Score saved!" });
});

// API to get scores
app.get("/scores", async (req, res) => {
  const scores = await db
    .collection("scores")
    .find()
    .sort({ score: -1 })
    .limit(5)
    .toArray();

  res.json(scores);
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
app.get("/clear", async (req, res) => {
  await db.collection("scores").deleteMany({});
  res.json({ message: "All scores deleted" });
});
