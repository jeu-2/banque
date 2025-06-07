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

// Form submissions
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Vous pouvez ajouter ici la logique de soumission des formulaires
    console.log('Formulaire soumis');
  });
});

// Observer all sections and cards
document.querySelectorAll('.section, .feature-card, .step-card').forEach(el => {
    observer.observe(el);
});
