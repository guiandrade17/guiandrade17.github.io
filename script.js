// ============================================================
// script.js – Portfólio Guilherme Brito
// Interações: loader, navbar, menu, scroll reveal,
// typing effect, partículas e barras de skill
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // ------------------------------------------------------------
  // LOADER
  // ------------------------------------------------------------
  const loader = document.getElementById("loader");

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 1200);
  });

  // ------------------------------------------------------------
  // HAMBURGER MENU (mobile)
  // ------------------------------------------------------------
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  // fecha menu ao clicar em link
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  // ------------------------------------------------------------
  // NAVBAR SCROLL EFFECT
  // ------------------------------------------------------------
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // ------------------------------------------------------------
  // SCROLL REVEAL (animações ao aparecer)
  // ------------------------------------------------------------
  const revealElements = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;

    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;

      if (elementTop < windowHeight - 100) {
        el.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  // ------------------------------------------------------------
  // TYPING EFFECT (home)
  // ------------------------------------------------------------
  const typedText = document.getElementById("typed-text");

  const phrases = [
    "Software Engineer Student",
    "Front-end Developer",
    "Back-end Enthusiast",
    "Problem Solver",
    "Tech Explorer"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      typedText.textContent = currentPhrase.substring(0, charIndex++);
      if (charIndex > currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1200);
        return;
      }
    } else {
      typedText.textContent = currentPhrase.substring(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(typeEffect, isDeleting ? 40 : 80);
  }

  typeEffect();

  // ------------------------------------------------------------
  // TECH BARS ANIMATION
  // ------------------------------------------------------------
  const techSection = document.getElementById("tecnologias");
  const techBars = document.querySelectorAll(".tech-fill");

  const fillBars = () => {
    const sectionTop = techSection.getBoundingClientRect().top;

    if (sectionTop < window.innerHeight - 150) {
      techBars.forEach(bar => {
        const width = bar.getAttribute("data-w");
        bar.style.width = width + "%";
      });
    }
  };

  window.addEventListener("scroll", fillBars);
  fillBars();

  // ------------------------------------------------------------
  // ACTIVE LINK (scroll spy simples)
  // ------------------------------------------------------------
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });

  // ------------------------------------------------------------
  // PARTICLES BACKGROUND (canvas simples)
  // ------------------------------------------------------------
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");

  let particlesArray = [];

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.fillStyle = "rgba(0,245,200,0.5)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < 80; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

});