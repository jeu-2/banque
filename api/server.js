app.use(express.json()); // assure-toi que ceci est en haut

app.post("/api/offres", async (req, res) => {
  try {
    const { titre, description, auteur, date, points } = req.body;

    const createdRecord = await base("Offres").create({
      "Titre": titre,
      "Description": description,
      "Auteur": auteur || "Anonyme",
      "Date": date || new Date().toISOString(),
      "Points": points || 0
    });

    res.status(201).json({ message: "Offre ajoutée avec succès", id: createdRecord.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'offre" });
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
