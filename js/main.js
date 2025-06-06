// Animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.module-card').forEach(el => {
            observer.observe(el);
        });

        // Form submissions
        document.getElementById('transactionForm').addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(e, 'Transaction Enregistrée !');
        });

        document.getElementById('offerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(e, 'Offre Publiée !');
        });

        function handleFormSubmission(e, successMessage) {
            const button = e.target.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.textContent = 'Traitement en cours...';
            button.style.background = 'linear-gradient(45deg, #ffed4a, #ffd700)';
            
            setTimeout(() => {
                button.textContent = '✅ ' + successMessage;
                setTimeout(() => {
                    button.textContent = originalText;
                }, 3000);
            }, 1500);
        }
    


  document.getElementById("offerForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const titre = document.getElementById("offreTitre").value.trim();
    const typeOffre = document.getElementById("offreType").value.trim();
    const categorie = document.getElementById("offreCategorie").value.trim();
    const prixPoints = parseInt(document.getElementById("offrePrixPoints").value.trim());
    const description = document.getElementById("offreDescription").value.trim();

    const membreProposant = localStorage.getItem("recordId");
    const dateCreation = new Date().toISOString().split("T")[0];

    const data = {
      titre,
      membreProposant,
      typeOffre,
      categorie,
      description,
      prixPoints,
      dureeQuantite: "",
      avantages: "",
      dateCreation,
      dateLimite: "",
      lieu: "",
      images: [],
      commentaires: ""
    };

    const button = e.target.querySelector("button[type='submit']");
    const originalText = button.textContent;

    button.textContent = "Publication...";
    button.disabled = true;

    try {
      const response = await fetch("https://banque-api-jeu.onrender.com/api/offres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        button.textContent = "✅ Offre publiée !";
        e.target.reset();
        if (typeof chargerOffres === "function") chargerOffres();
      } else {
        console.error(result);
        alert("Erreur API : " + (result.message || "Erreur inconnue"));
        button.textContent = "❌ Échec publication";
      }

    } catch (err) {
      console.error("Erreur réseau :", err);
      alert("Erreur réseau : " + err.message);
      button.textContent = "❌ Erreur réseau";
    }

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 3000);
  });



  document.addEventListener("DOMContentLoaded", function () {
    const nom = localStorage.getItem("nomMembre");
    const code = localStorage.getItem("codeMembre");

    if (nom && code) {
      const nameEl = document.querySelector(".user-name");
      const codeEl = document.querySelector(".member-code");
      if (nameEl) nameEl.textContent = nom;
      if (codeEl) codeEl.textContent = "Membre : " + code;
    }
  });



  document.addEventListener("DOMContentLoaded", function () {
    const nom = localStorage.getItem("nomMembre");
    const code = localStorage.getItem("codeMembre");

    if (nom && code) {
      const userBar = document.createElement("div");
      userBar.style.position = "fixed";
      userBar.style.top = "0";
      userBar.style.right = "0";
      userBar.style.padding = "0.5rem 1rem";
      userBar.style.background = "#222";
      userBar.style.color = "#ffd700";
      userBar.style.zIndex = "9999";
      userBar.innerHTML = `👤 Connecté : <strong>${nom} (${code})</strong> <button id="logoutBtn" style="margin-right: 30 px; padding: 20 px.33 px. 70 px" onclick="window.location.href='index.html'" class="btn-outline";>Déconnexion</button>`;
      document.body.appendChild(userBar);
      document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "/";
      });
    }
  });

// === Accueil ===

// Navbar scroll effect
window.addEventListener('scroll', function() {
const navbar = document.getElementById('navbar');
if (window.scrollY > 50) {
navbar.classList.add('scrolled');
} else {
navbar.classList.remove('scrolled');
}
});

// Tab switching
function switchTab(tab) {
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const tabBtns = document.querySelectorAll('.tab-btn');

tabBtns.forEach(btn => btn.classList.remove('active'));

if (tab === 'signup') {
signupForm.style.display = 'block';
loginForm.style.display = 'none';
event.target.classList.add('active');
} else {
signupForm.style.display = 'none';
loginForm.style.display = 'block';
event.target.classList.add('active');
}
}

// Function to scroll to login form
function scrollToLogin() {
const loginForm = document.getElementById('login-form');
loginForm.style.display = 'block';
document.getElementById('signup-form').style.display = 'none';

// Update tab buttons
document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
document.querySelector('.tab-btn:last-child').classList.add('active');

// Scroll to the form
loginForm.scrollIntoView({
behavior: 'smooth',
block: 'center'
});
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

const observer = new IntersectionObserver(function(entries) {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('fade-in-up');
}
});
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section, .feature-card, .step-card').forEach(el => {
observer.observe(el);
});

// Form submissions
document.querySelectorAll('form').forEach(form => {
form.addEventListener('submit', function(e) {
e.preventDefault();
// Vous pouvez ajouter ici la logique de soumission des formulaires
console.log('Formulaire soumis');
});
});