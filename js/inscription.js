document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#signup-form form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const prenom = form.querySelector('input[name="prenom"]').value.trim();
    const nom = form.querySelector('input[name="nom"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const telephone = form.querySelector('input[type="tel"]').value.trim();
    const adresse = form.querySelector('input[type="text"]').value.trim();
    const motdepasse = form.querySelector('input[type="password"]').value.trim();

    const message = document.createElement("div");
    message.style.marginTop = "1rem";

    if (!prenom || !nom || !email || !telephone || !adresse || !motdepasse) {
      message.textContent = "❌ Tous les champs sont requis.";
      form.appendChild(message);
      return;
    }

    try {
      const response = await fetch("https://banque-api-jeu.onrender.com/api/membres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom, nom, email, telephone, adresse, motdepasse })
      });

      if (!response.ok) {
        message.textContent = "❌ Erreur lors de l'inscription.";
        form.appendChild(message);
        return;
      }

      message.textContent = "✅ Inscription réussie ! Redirection...";
      form.appendChild(message);
      setTimeout(() => window.location.href = "connexion.html", 1500);
    } catch (err) {
      console.error(err);
      message.textContent = "❌ Erreur réseau.";
      form.appendChild(message);
    }
  });
});
