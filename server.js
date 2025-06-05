
const express = require("express");
const bodyParser = require("body-parser");
const Airtable = require("airtable");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base("appSq4EsE3ae2KN8M");

const membresTable = base("Membres");

// Endpoint POST pour inscription
app.post("/api/membres", async (req, res) => {
  try {
    const { prenom, nom, email, telephone, adresse, motdepasse } = req.body;
    console.log("✅ Reçu du client :", req.body);

    const newMembre = await membresTable.create([
      {
        fields: {
          "Prénom": prenom,
          "Nom": nom,
          "Email": email,
          "Téléphone": telephone,
          "Adresse": adresse,
          "Mot de passe": motdepasse
        }
      }
    ]);

    res.status(201).json({ success: true, id: newMembre[0].id });
  } catch (error) {
    console.error("❌ Erreur AirTable POST Membres:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
});
