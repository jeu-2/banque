fetch("https://banque-api-jeu.onrender.com/api/membres", { ... })
// Préremplir prénom et nom depuis URL
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const prenom = params.get("prenom") || "";
  const nom = params.get("nom") || "";
  if (prenom) document.getElementById("prenom").value = prenom;
  if (nom) document.getElementById("nom").value = nom;
});

// Gérer l'inscription
async function handleInscription(event) {
  event.preventDefault();

  const prenom = document.getElementById("prenom").value.trim();
  const nom = document.getElementById("nom").value.trim();
  const email = document.getElementById("email").value.trim();
  const telephone = document.getElementById("telephone").value.trim();
  const adresse = document.getElementById("adresse").value.trim();
  const motdepasse = document.getElementById("motdepasse").value.trim();

  if (!prenom || !nom || !email || !telephone || !adresse || !motdepasse) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const response = await fetch("https://banque-api-jeu.onrender.com/api/membres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prenom, nom, email, telephone, adresse, motdepasse }),
    });

    const result = await response.json();

    if (response.ok) {
      showSuccessModal(prenom, nom);
    } else {
      alert("Erreur : " + (result?.message || "inscription échouée."));
    }
  } catch (err) {
    console.error(err);
    alert("Erreur réseau : impossible de compléter l'inscription.");
  }
}

function showSuccessModal(prenom, nom) {
  const modal = document.getElementById("successModal");
  const message = document.getElementById("successMessage");
  message.innerText = `Bienvenue ${prenom} ${nom} ! Votre inscription est confirmée.`;
  modal.style.display = "block";
  setTimeout(() => {
    modal.style.display = "none";
    window.location.href = `index.html?prenom=${encodeURIComponent(prenom)}&nom=${encodeURIComponent(nom)}#connexion`;
  }, 3000);
}
