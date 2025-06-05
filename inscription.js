
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulaireInscription");
  const modal = document.getElementById("modalMessage");
  const modalText = document.getElementById("modalText");
  const closeModal = document.getElementById("closeModal");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const telephone = document.getElementById("telephone").value.trim();
    const adresse = document.getElementById("adresse").value.trim();
    const motdepasse = document.getElementById("motdepasse").value.trim();

    if (!email || !telephone || !adresse || !motdepasse) {
      showModal("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch("https://banque-api-jeu.onrender.com/api/membres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, telephone, adresse, motdepasse }),
      });

      const result = await response.json();

      if (response.ok) {
        showModal("Inscription réussie ! Bienvenue dans le J.E.U.");
        form.reset();
      } else {
        showModal(result.message || "Erreur lors de l'inscription.");
      }
    } catch (error) {
      showModal("Erreur réseau : impossible de contacter le serveur.");
    }
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  function showModal(message) {
    modalText.textContent = message;
    modal.style.display = "block";
  }
});
