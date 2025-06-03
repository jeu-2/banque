import express from "express";
import dotenv from "dotenv";
import Airtable from "airtable";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

app.get("/api/membres", async (req, res) => {
  try {
    const records = await base("Membres").select({ view: "Grid view" }).all();
    const membres = records.map(record => ({
      id: record.id,
      nom: record.get("Nom") || "",
      prenom: record.get("Prénom") || "",
      email: record.get("Email") || "",
      code: record.get("ID Membre") || ""
    }));
    res.json(membres);
  } catch (error) {
    console.error("Erreur GET /api/membres :", error);
    res.status(500).json({ message: error.message || "Erreur serveur" });
  }
});

app.get("/api/offres", async (req, res) => {
  try {
    const records = await base("Offres").select({ view: "Grid view" }).all();
    const offres = records.map((record) => ({
      id: record.id,
      titre: record.get("Titre") || "",
      description: record.get("Description") || "",
      membreProposant: record.get("Membre proposant") || "",
      date: record.get("Date création") || "",
      points: record.get("Prix en points") || 0,
    }));
    res.json(offres);
  } catch (error) {
    console.error("Erreur GET /api/offres :", error);
    res.status(500).json({ message: error.message || "Erreur serveur inconnue" });
  }
});

app.post("/api/offres", async (req, res) => {
  try {
    const {
      titre,
      membreProposant,
      typeOffre,
      categorie,
      description,
      prixPoints,
      dureeQuantite,
      avantages,
      dateCreation,
      dateLimite,
      lieu,
      images,
      commentaires
    } = req.body;

    const created = await base("Offres").create({
      "Titre": titre,
      "Membre proposant": membreProposant,
      "Type d'offre": typeOffre,
      "Catégorie": categorie,
      "Description": description,
      "Prix en points": prixPoints,
      "Durée/Quantité": dureeQuantite,
      "Avantages": avantages,
      "Date création": dateCreation,
      "Date limite": dateLimite,
      "Lieu": lieu,
      "Images": images,
      "Commentaires": commentaires
    });

    res.status(201).json({ message: "Offre ajoutée avec succès", id: created.id });
  } catch (error) {
    console.error("❌ Erreur API POST /api/offres :", error);
    res.status(500).json({ message: error.message || "Erreur serveur inconnue" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
