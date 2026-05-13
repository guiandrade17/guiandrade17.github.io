/* ============================================================
   script.js – Guilherme Brito Portfolio
   Interações, animações e efeitos
============================================================ */

/* ──────────────────────────────────────────────────────────
   LOADER
────────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');

  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1200);
});

/* ──────────────────────────────────────────────────────────
   NAVBAR SCROLL
────────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ──────────────────────────────────────────────────────────
   MOBILE MENU
────────────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ──────────────────────────────────────────────────────────
   ACTIVE NAV LINK
────────────────────────────────────────────────────────── */
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinkItems.forEach(link => {
    link.classList.remove('active');

    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});

/* ──────────────────────────────────────────────────────────
   REVEAL ON SCROLL
────────────────────────────────────────────────────────── */
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.88;

  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < triggerBottom) {
      el.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* ──────────────────────────────────────────────────────────
   TYPING EFFECT
────────────────────────────────────────────────────────── */
const typedText = document.getElementById('typed-text');

const words = [
  'Software Engineer',
  'Front-end Developer',
  'C# Developer',
  'Java & SQL Student',
  'Technology Enthusiast'
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  const currentWord = words[wordIndex];

  if (!deleting) {
    typedText.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentWord.length) {
      deleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    typedText.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      deleting = false;
      wordIndex++;

      if (wordIndex >= words.length) {
        wordIndex = 0;
      }
    }
  }

  setTimeout(typeEffect, deleting ? 45 : 90);
}

document.addEventListener('DOMContentLoaded', typeEffect);

/* ──────────────────────────────────────────────────────────
   TECH BARS ANIMATION
────────────────────────────────────────────────────────── */
const techFills = document.querySelectorAll('.tech-fill');

const animateTechBars = () => {
  techFills.forEach(fill => {
    const rect = fill.getBoundingClientRect();

    if (rect.top < window.innerHeight - 60) {
      const width = fill.getAttribute('data-w');
      fill.style.width = width + '%';
    }
  });
};

window.addEventListener('scroll', animateTechBars);
window.addEventListener('load', animateTechBars);

/* ──────────────────────────────────────────────────────────
   PARTICLE BACKGROUND
────────────────────────────────────────────────────────── */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.size = Math.random() * 2 + 1;

    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;

    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;

    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

    ctx.fillStyle = `rgba(0,245,200,${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];

  const numberOfParticles = Math.min(
    Math.floor(window.innerWidth / 12),
    120
  );

  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function connectParticles() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;

      const distance = dx * dx + dy * dy;

      if (distance < 9000) {
        ctx.beginPath();

        ctx.strokeStyle = `rgba(0,245,200,${
          0.08 - distance / 120000
        })`;

        ctx.lineWidth = 0.5;

        ctx.moveTo(
          particlesArray[a].x,
          particlesArray[a].y
        );

        ctx.lineTo(
          particlesArray[b].x,
          particlesArray[b].y
        );

        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particlesArray.forEach(particle => {
    particle.update();
    particle.draw();
  });

  connectParticles();

  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

/* ──────────────────────────────────────────────────────────
   RESIZE CANVAS
────────────────────────────────────────────────────────── */
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  initParticles();
});

/* ──────────────────────────────────────────────────────────
   PARALLAX EFFECT
────────────────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  const avatar = document.querySelector('.avatar-frame');

  if (avatar) {
    avatar.style.transform = `translateY(${scrollY * 0.06}px)`;
  }
});

/* ──────────────────────────────────────────────────────────
   PROJECT CARD HOVER GLOW
────────────────────────────────────────────────────────── */
const cards = document.querySelectorAll('.project-card');

cards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.background = `
      radial-gradient(
        circle at ${x}px ${y}px,
        rgba(0,245,200,0.10),
        rgba(17,24,39,1) 45%
      )
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ──────────────────────────────────────────────────────────
   SMOOTH SCROLL
────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.querySelector(
      this.getAttribute('href')
    );

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

/* ──────────────────────────────────────────────────────────
   CONSOLE EASTER EGG
────────────────────────────────────────────────────────── */
console.log(`
╔══════════════════════════════════════╗
║        Guilherme Brito Portfolio     ║
║     Software Engineer Student        ║
╚══════════════════════════════════════╝

GitHub: https://github.com/guiandrade17
LinkedIn:
https://linkedin.com/in/guilherme-brito-andrade-090b81348
`);