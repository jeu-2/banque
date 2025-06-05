
const express = require('express');
const bodyParser = require('body-parser');
const Airtable = require('airtable');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Configuration Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const TABLE_MEMBRES = 'Membres';

// Générer un nouvel ID Membre unique
async function genererIdMembre() {
    const records = await base(TABLE_MEMBRES).select({}).all();
    const ids = records
        .map(record => record.get('ID Membre'))
        .filter(id => id && /^JEU\d{7}$/.test(id))
        .map(id => parseInt(id.replace('JEU', '')))
        .sort((a, b) => b - a);
    const prochainNumero = (ids[0] || 0) + 1;
    return `JEU${prochainNumero.toString().padStart(7, '0')}`;
}

// Endpoint d'inscription
app.post('/api/membres', async (req, res) => {
    try {
        const { prenom, nom, email, telephone, adresse, motdepasse } = req.body;
        const idMembre = await genererIdMembre();
        const dateInscription = new Date().toLocaleDateString('fr-CA');

        await base(TABLE_MEMBRES).create({
            "ID Membre": idMembre,
            "Prénom": prenom,
            "Nom": nom,
            "Email": email,
            "Téléphone": telephone,
            "Adresse": adresse,
            "Mot de passe": motdepasse,
            "Inscription": dateInscription,
            "Statut": "Invité",
            "Solde": 0,
            "Gains": 0,
            "Dépenses": 0
        });

        res.status(200).json({ success: true, message: "Inscription réussie !" });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ success: false, message: "Erreur lors de l'inscription." });
    }
});

app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
});
