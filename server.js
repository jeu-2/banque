// ========== DEPENDANCES ==========
const express = require("express");
const dotenv = require("dotenv");
const Airtable = require("airtable");
const cors = require("cors");

// ========== CONFIGURATION ==========
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

// ========== ROUTES ==========

// Test de vie
app.get("/", (req, res) => {
  res.send("✅ API Banque J.E.U. opérationnelle");
});

// 🔹 Récupérer toutes les offres
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

// 🔹 Ajouter une offre
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

// 🔹 Tous les membres (optionnel)
app.get("/api/membres", async (req, res) => {
  try {
    const records = await base("Membres").select({ view: "Grid view" }).all();
    const membres = records.map(record => ({
      id: record.id,
      nom: record.get("Nom") || "",
      prenom: record.get("Prénom") || "",
      email: record.get("Email") || "",
      code: record.get("ID Membre") || "",
      motdepasse: record.get("Mot de passe") || ""
    }));
    res.json(membres);
  } catch (error) {
    console.error("Erreur GET /api/membres :", error);
    res.status(500).json({ message: error.message || "Erreur serveur" });
  }
});

// 🔹 Membre par ID (tableau de bord)
app.get("/api/membres/:code", async (req, res) => {
  try {
    const records = await base("Membres")
      .select({
        filterByFormula: `{ID Membre} = '${req.params.code}'`,
        maxRecords: 1
      })
      .firstPage();

    if (records.length === 0) {
      return res.status(404).json({ message: "Membre introuvable" });
    }

    const record = records[0];
    res.json({
      id: record.id,
      nom: record.get("Nom") || "",
      prenom: record.get("Prénom") || "",
      email: record.get("Email") || "",
      code: record.get("ID Membre") || "",
      statut: record.get("Statut") || "",
      solde: record.get("Solde") || 0,
      stats: {
        nbEchanges: record.get("Échanges totaux") || 0,
        nbPartenaires: record.get("Partenaires actifs") || 0,
        fiabilite: record.get("Score fiabilité") || "N/A",
        evaluation: record.get("Évaluation") || "-"
      }
    });

  } catch (err) {
    console.error("Erreur GET /api/membres/:code :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========== LANCEMENT ==========
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Serveur lancé sur le port ${port}`);
});
