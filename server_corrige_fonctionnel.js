
const express = require("express");
const bodyParser = require("body-parser");
const Airtable = require("airtable");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const base = new Airtable({ apiKey: "YOUR_AIRTABLE_API_KEY" }).base("YOUR_BASE_ID");
const table = base("Membres");

function generateMemberID(existingIDs) {
  const prefix = "JEU";
  let maxNumber = 0;
  existingIDs.forEach((id) => {
    const num = parseInt(id.replace(prefix, ""), 10);
    if (!isNaN(num) && num > maxNumber) maxNumber = num;
  });
  const newNumber = maxNumber + 1;
  return `${prefix}${String(newNumber).padStart(7, "0")}`;
}

app.post("/api/membres", async (req, res) => {
  const { prenom, nom, email, telephone, adresse, motdepasse } = req.body;
  if (!prenom || !nom || !email || !telephone || !adresse || !motdepasse) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  try {
    const records = await table.select().all();
    const existingIDs = records.map((record) => record.get("ID Membre")).filter(Boolean);
    const newID = generateMemberID(existingIDs);
    const now = new Date().toLocaleDateString("fr-CA");

    await table.create({
      "ID Membre": newID,
      "Prénom": prenom,
      "Nom": nom,
      "Email": email,
      "Téléphone": telephone,
      "Adresse": adresse,
      "Mot de passe": motdepasse,
      "Inscription": now,
      "Statut": "Invité",
      "Solde": 0,
      "Gains": 0,
      "Dépenses": 0,
    });

    res.status(201).json({ success: true, id: newID });
  } catch (err) {
    console.error("Erreur Airtable POST Membres:", err);
    res.status(500).json({ error: "Erreur lors de la création du membre." });
  }
});

app.get("/api/membres", async (req, res) => {
  try {
    const records = await table.select().all();
    const membres = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));
    res.json(membres);
  } catch (err) {
    console.error("Erreur Airtable GET Membres:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des membres." });
  }
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
