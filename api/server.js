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

    const createdRecord = await base("Offres").create({
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

    res.status(201).json({ message: "Offre ajoutée avec succès", id: createdRecord.id });
  } catch (error) {
    console.error("❌ Erreur API POST /api/offres :", error);
    res.status(500).json({ message: error.message || "Erreur serveur inconnue" });
  }
});

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/offres', async (req, res) => {
  try {
    const response = await axios.get(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/OFFRES`, {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erreur AirTable GET:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/offres', async (req, res) => {
  try {
    const { fields } = req.body;
    const response = await axios.post(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/OFFRES`,
      { fields },
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Erreur AirTable POST:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
