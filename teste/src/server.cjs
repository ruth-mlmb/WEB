const express    = require("express");
const { MongoClient } = require("mongodb");
const cors       = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ── 👇 CHANGE CES DEUX VALEURS ────────────────────────────────
const MONGO_URI     = "mongodb+srv://cpoudensan:WEB@cluster0.vqv51nv.mongodb.net/?appName=Cluster0";
const DATABASE_NAME = "SOS";          // nom exact de ta DB
const COLLECTION    = "SOS_Commandes"; // nom exact de ta collection
// ─────────────────────────────────────────────────────────────

let db;

MongoClient.connect(MONGO_URI)
  .then((client) => {
    db = client.db(DATABASE_NAME);
    console.log(`✅ Connecté à la database "${DATABASE_NAME}"`);
  })
  .catch((err) => console.error("❌ Erreur MongoDB :", err));


// ── GET /api/candidates ───────────────────────────────────────
// Regroupe les SOS_Commandes par listeNAME
// et compte ceux dont etat === 1 (terminé)
app.get("/api/candidates", async (req, res) => {
  try {
    const results = await db
      .collection(COLLECTION)
      .aggregate([
        {
          // Regroupe par listeNAME, compte uniquement etat = 1
          $group: {
            _id: "$listeNAME",
            score: {
              $sum: {
                $cond: [{ $eq: ["$etat", 1] }, 1, 0]
              }
            }
          }
        },
        {
          // Trie par score décroissant
          $sort: { score: -1 }
        },
        {
          // Renomme _id en name pour le front
          $project: {
            _id: 0,
            id:    "$_id",
            name:  "$_id",
            score: 1
          }
        }
      ])
      .toArray();

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
