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
        if (loginForm) loginForm.style.display = 'none';
        event.target.classList.add('active');
    } else {
        signupForm.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
        event.target.classList.add('active');
    }
}

// Function to scroll to login form
function scrollToLogin() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
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
    rootMargin:
