import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ── 👇 CHANGE CES DEUX VALEURS ────────────────────────────────
const MONGO_URI     = "mongodb+srv://cpoudensan:WEB@cluster0.vqv51nv.mongodb.net/?appName=Cluster0";
const DATABASE_NAME = "liste";
// ─────────────────────────────────────────────────────────────

let db;

MongoClient.connect(MONGO_URI)
  .then((client) => {
    db = client.db(DATABASE_NAME);
    console.log(`✅ Connecté à la database "${DATABASE_NAME}"`);
  })
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

app.get("/api/candidates", async (req, res) => {
  try {
    const collections = await db.listCollections().toArray();

    const results = await Promise.all(
      collections.map(async (col) => {
        const name  = col.name;
        const score = await db
          .collection(name)
          .countDocuments({ status: "terminé" });
        return { id: name, name, score };
      })
    );

    results.sort((a, b) => b.score - a.score);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Serveur Express sur http://localhost:${PORT}`)
);
