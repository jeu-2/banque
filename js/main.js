// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Tab switching (inscription / connexion)
function switchTab(tab, event) {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => btn.classList.remove('active'));

    if (tab === 'signup') {
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
    } else {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    }

    if (event) {
        event.target.classList.add('active');
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observer all sections and cards
document.querySelectorAll('.section, .feature-card, .step-card').forEach(el => {
    observer.observe(el);
});

<script>
  document.addEventListener("DOMContentLoaded", async () => {
    const recordId = localStorage.getItem("recordId");
    if (!recordId) {
      alert("Aucun membre connecté. Redirection...");
      return window.location.href = "index.html";
    }

    try {
      const res = await fetch(`https://banque-api-jeu.onrender.com/api/membres/${recordId}`);
      if (!res.ok) throw new Error("Réponse API non valide");
      const data = await res.json();

      document.querySelector(".user-name").textContent = data.nom || "Utilisateur";
      document.querySelector(".user-status").textContent = data.statut || "Membre";
      document.querySelector(".balance-amount").textContent = `${data.solde} pts`;
      document.querySelector(".member-code").textContent = `Membre : ${data.code}`;

      // Exemple pour les stats (si l’API les fournit)
      const stats = data.stats || { echanges: 0, partenaires: 0, fiabilite: "N/A", evaluation: "-" };
      document.querySelectorAll(".stat-number")[0].textContent = stats.echanges;
      document.querySelectorAll(".stat-number")[1].textContent = stats.partenaires;
      document.querySelectorAll(".stat-number")[2].textContent = stats.fiabilite;
      document.querySelectorAll(".stat-number")[3].textContent = stats.evaluation;

    } catch (err) {
      console.error("Erreur chargement données :", err);
      alert("Impossible de charger les informations du membre.");
    }
  });
</script>

<script>
const nom = localStorage.getItem("nomMembre");
const code = localStorage.getItem("codeMembre");
if (!nom || !code) {
  window.location.href = "https://jeu-2.github.io/banque/connexion.html"; // Rediriger vers la page de connexion
}
</script>
