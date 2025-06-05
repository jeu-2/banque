
// Exemple de correction
app.post('/api/membres', async (req, res) => {
  try {
    // ... traitement
  } catch (error) {
    console.error("Erreur serveur : ", error);
    res.status(500).json({ success: false, message: "Erreur lors de l'inscription." }); // corrigé
  }
});
