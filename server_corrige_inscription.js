const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/offres", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Offres`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );
    res.json(response.data.records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des offres" });
  }
});

app.post("/api/offres", async (req, res) => {
  try {
    const {
      titre,
      description,
      auteur,
      date,
      points
    } = req.body;

    const createdRecord = await axios.post(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Offres`,
      {
        records: [
          {
            fields: {
              Titre: titre,
              Description: description,
              Auteur: auteur || "Anonyme",
              Date: date || new Date().toISOString(),
              Points: points || 0
            }
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.status(201).json({ message: "Offre ajoutée avec succès", id: createdRecord.data.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'offre" });
  }
});

// ✅ Route inscription corrigée
app.post('/api/membres', async (req, res) => {
  try {
    const { prenom, nom, email, telephone, adresse, motdepasse } = req.body;

    console.log('Reçu du client :', req.body);

    const response = await axios.post(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/MEMBRES`,
      {
        records: [
          {
            fields: {
              prenom,
              nom,
              email,
              telephone,
              adresse,
              motdepasse
            }
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Erreur AirTable POST Membres:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT}`);
});