
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Airtable = require('airtable');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Airtable config
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const TABLE_NAME = 'Membres';

// Connexion: recherche par email ou ID Membre + mot de passe
app.post('/api/membres', async (req, res) => {
  const { identifiant, motdepasse } = req.body;

  try {
    const records = await base(TABLE_NAME)
      .select({ filterByFormula: `OR({Email} = '${identifiant}', {ID Membre} = '${identifiant}')` })
      .firstPage();

    if (records.length === 0) return res.status(404).json({ success: false, message: 'Identifiant introuvable.' });

    const membre = records[0].fields;
    if (membre['Mot de passe'] !== motdepasse)
      return res.status(401).json({ success: false, message: 'Mot de passe incorrect.' });

    res.json({ success: true, membre });
  } catch (error) {
    console.error('Erreur de connexion :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Inscription: ajout d'un nouveau membre
app.post('/api/inscription', async (req, res) => {
  const { email, telephone, adresse, motdepasse } = req.body;

  try {
    // Génération de l'ID Membre automatique
    const records = await base(TABLE_NAME).select({}).all();
    const maxId = records.reduce((max, rec) => {
      const id = rec.fields['ID Membre'];
      if (id && id.startsWith('JEU')) {
        const num = parseInt(id.slice(3));
        return num > max ? num : max;
      }
      return max;
    }, 0);
    const nextId = `JEU${(maxId + 1).toString().padStart(7, '0')}`;

    await base(TABLE_NAME).create([{
      fields: {
        'ID Membre': nextId,
        'Mot de passe': motdepasse,
        'Nom': '',
        'Prénom': '',
        'Email': email,
        'Téléphone': telephone,
        'Adresse': adresse,
        'Inscription': new Date().toLocaleDateString('fr-CA'),
        'Statut': 'Invité',
        'Solde': 0,
        'Gains': 0,
        'Dépenses': 0
      }
    }]);

    res.json({ success: true, message: "Membre inscrit avec succès." });
  } catch (error) {
    console.error('Erreur Airtable POST Inscription:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l'inscription.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Serveur lancé sur le port ${port}`);
});
