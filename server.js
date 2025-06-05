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

app.post('/api/membres', async (req, res) => {
  try {
    const { prenom, nom, email, telephone, adresse, motdepasse } = req.body;

    const response = await axios.post(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/MEMBRES`,
      {
        fields: {
          prenom,
          nom,
          email,
          telephone,
          adresse,
          motdepasse
        }
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
    console.error('Erreur AirTable POST Membres:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
