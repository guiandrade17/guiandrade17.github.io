/* ============================================================
   script.js – Guilherme Brito Portfólio v2
   Mantém toda a lógica original + melhorias de animação,
   acessibilidade e interatividade.
============================================================ */

/* ─── 1. LOADER ───────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Garante tempo mínimo de exibição para a animação ser apreciada
  setTimeout(() => {
    loader.classList.add('hidden');
    // Remove do DOM após a transição para não bloquear eventos
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }, 1400);
});

/* ─── 2. PARTÍCULAS (canvas) ──────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const COUNT      = 70;
  const COLOR      = '0,245,200';
  const MAX_DIST   = 120;
  const MOUSE_DIST = 160;

  // Posição do mouse para interatividade sutil
  const mouse = { x: -9999, y: -9999 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x:     rand(0, W),
      y:     rand(0, H),
      r:     rand(0.6, 2.2),
      dx:    rand(-0.28, 0.28),
      dy:    rand(-0.28, 0.28),
      alpha: rand(0.2, 0.65),
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Linhas de conexão entre partículas próximas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${COLOR},${0.08 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth   = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Partículas
    particles.forEach(p => {
      // Leve repulsão do cursor
      const mdx  = p.x - mouse.x;
      const mdy  = p.y - mouse.y;
      const mdst = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdst < MOUSE_DIST) {
        const force = (MOUSE_DIST - mdst) / MOUSE_DIST * 0.4;
        p.x += (mdx / mdst) * force;
        p.y += (mdy / mdst) * force;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR},${p.alpha})`;
      ctx.fill();

      // Movimento
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  // Recria partículas no resize para preencher novo tamanho
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); createParticles(); }, 150);
  });
})();

/* ─── 3. NAVBAR ───────────────────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Ativa link e aplica classe .scrolled com requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);

      // Destaca link da seção visível
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
      });
      navLinks.forEach(l =>
        l.classList.toggle('active', l.getAttribute('href') === `#${current}`)
      );

      ticking = false;
    });
    ticking = true;
  });

  // Fecha menu mobile ao clicar em link
  navLinks.forEach(l =>
    l.addEventListener('click', () => {
      document.getElementById('nav-links').classList.remove('open');
      const btn = document.getElementById('hamburger');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    })
  );
})();

/* ─── 4. HAMBURGER ────────────────────────────────────────── */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Fecha ao pressionar ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });
})();

/* ─── 5. EFEITO DE DIGITAÇÃO (typing) ─────────────────────── */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Estudante de Eng. Software',
    'Front-end Developer',
    'Apaixonado por código',
    'Futuro Engenheiro',
  ];

  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    el.textContent = deleting
      ? phrase.substring(0, ci--)
      : phrase.substring(0, ci++);

    let delay = deleting ? 55 : 95;

    if (!deleting && ci > phrase.length) {
      delay    = 1900;
      deleting = true;
    }
    if (deleting && ci < 0) {
      deleting = false;
      pi       = (pi + 1) % phrases.length;
      delay    = 320;
    }

    setTimeout(type, delay);
  }

  // Inicia após o loader
  setTimeout(type, 1500);
})();

/* ─── 6. SCROLL REVEAL ────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Delay escalonado por grupo de elementos visíveis juntos
          setTimeout(
            () => entry.target.classList.add('visible'),
            i * 70
          );
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => io.observe(el));
})();

/* ─── 7. BARRAS DE HABILIDADE ─────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.tech-fill');
  if (!fills.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Pequeno delay para a animação acontecer após o card entrar na tela
          setTimeout(() => {
            entry.target.style.width = entry.target.dataset.w + '%';
          }, 200);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach(f => io.observe(f));
})();

/* ─── 8. MICRO-INTERAÇÃO: CARDS DE PROJETO ────────────────── */
(function initProjectCards() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect    = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const dx      = (e.clientX - centerX) / (rect.width  / 2);
      const dy      = (e.clientY - centerY) / (rect.height / 2);

      // Leve inclinação 3D no hover (max 4°)
      card.style.transform = `translateY(-8px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease, border-color 0.3s ease, box-shadow 0.3s ease';
    });
  });
})();

/* ─── 9. MICRO-INTERAÇÃO: TECH CARDS ─────────────────────── */
(function initTechCards() {
  const cards = document.querySelectorAll('.tech-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect    = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const dx      = (e.clientX - centerX) / (rect.width  / 2);
      const dy      = (e.clientY - centerY) / (rect.height / 2);

      card.style.transform = `translateY(-6px) scale(1.02) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── 10. EFEITO RIPPLE NOS BOTÕES ────────────────────────── */
(function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Remove ripples anteriores
      this.querySelectorAll('.ripple').forEach(r => r.remove());

      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 1.5;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      Object.assign(ripple.style, {
        position:  'absolute',
        width:     `${size}px`,
        height:    `${size}px`,
        left:      `${x}px`,
        top:       `${y}px`,
        borderRadius: '50%',
        background:   'rgba(255,255,255,0.15)',
        transform:    'scale(0)',
        animation:    'ripple-anim 0.55s ease-out forwards',
        pointerEvents:'none',
      });

      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });
  });

  // Keyframe da animação de ripple injetado via JS para não poluir o CSS
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple-anim {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ─── 11. ANIMAÇÃO DE ENTRADA DOS NÚMEROS (stats) ────────── */
(function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  // Extrai apenas o número de um elemento como "60+"
  function getNumber(el) {
    return parseInt(el.textContent.replace(/\D/g, ''), 10) || 0;
  }

  function animateCount(el, target, duration = 1200) {
    const suffix  = el.innerHTML.match(/(<span[^>]*>.*?<\/span>)/)?.[1] || '';
    const nonNum  = el.textContent.replace(/[0-9]/g, '').replace(/\+|st|nd|rd|th/g, '').trim();
    let start     = 0;
    const step    = target / (duration / 16);

    function update() {
      start = Math.min(start + step, target);
      const extra = el.innerHTML.match(/(<span[^>]*>.*?<\/span>)/)?.[1] || '';
      el.innerHTML = Math.floor(start) + extra;
      if (start < target) requestAnimationFrame(update);
    }
    update();
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const num = getNumber(el);
      if (num > 0) animateCount(el, num, 1000);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => io.observe(el));
})();

/* ─── 12. CALENDÁRIO ──────────────────────────────────────── */
(function initCalendar() {
  const WA_NUMBER  = '5561992689516';
  const HOUR_START = 8;
  const HOUR_END   = 18;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let viewYear  = today.getFullYear();
  let viewMonth = today.getMonth();
  let selDay    = null;

  // Elementos do DOM
  const monthLabel  = document.getElementById('cal-month-label');
  const daysGrid    = document.getElementById('cal-days');
  const prevBtn     = document.getElementById('cal-prev');
  const nextBtn     = document.getElementById('cal-next');
  const slotsWrap   = document.getElementById('cal-slots-wrap');
  const slotsTitle  = document.getElementById('cal-slots-title');
  const slotsGrid   = document.getElementById('cal-slots');
  const confirmBox  = document.getElementById('cal-confirm');
  const confirmInfo = document.getElementById('cal-confirm-info');
  const waBtn       = document.getElementById('cal-whatsapp-btn');

  // Sai silenciosamente se o calendário não existir na página
  if (!monthLabel) return;

  const PT_MONTHS = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
  ];
  const PT_DAYS = [
    'domingo','segunda-feira','terça-feira','quarta-feira',
    'quinta-feira','sexta-feira','sábado',
  ];

  // ── Helpers ──────────────────────────────────────────────
  function sameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth()    === b.getMonth()    &&
      a.getDate()     === b.getDate()
    );
  }
  function isWeekend(d) { return d.getDay() === 0 || d.getDay() === 6; }
  function isPast(d)    { return d < today; }

  // Gera os slots de horário (08:00–17:00, cada 1h)
  function buildSlots() {
    const slots = [];
    for (let h = HOUR_START; h < HOUR_END; h++) {
      const hh  = String(h).padStart(2, '0');
      const end = String(h + 1).padStart(2, '0');
      slots.push({ label: `${hh}:00 – ${end}:00`, value: `${hh}:00` });
    }
    return slots;
  }

  // ── Renderiza calendário ──────────────────────────────────
  function renderCalendar() {
    monthLabel.textContent = `${PT_MONTHS[viewMonth]} ${viewYear}`;
    daysGrid.innerHTML = '';

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Células vazias antes do primeiro dia
    for (let i = 0; i < firstDay; i++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day empty';
      cell.setAttribute('aria-hidden', 'true');
      daysGrid.appendChild(cell);
    }

    // Dias do mês
    for (let d = 1; d <= lastDate; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const cell = document.createElement('div');
      cell.textContent = d;
      cell.setAttribute('role', 'gridcell');

      const classes = ['cal-day'];
      if (sameDay(date, today))            classes.push('today');
      if (isPast(date))                    { classes.push('past'); cell.setAttribute('aria-disabled', 'true'); }
      else if (isWeekend(date))            classes.push('available', 'weekend');
      else                                 classes.push('available');
      if (selDay && sameDay(date, selDay)) classes.push('selected');

      cell.className = classes.join(' ');

      if (!isPast(date)) {
        cell.setAttribute('tabindex', '0');
        cell.setAttribute('aria-label', `${d} de ${PT_MONTHS[viewMonth]}`);
        // Click e teclado
        cell.addEventListener('click', () => selectDay(date, cell));
        cell.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectDay(date, cell);
          }
        });
      }

      daysGrid.appendChild(cell);
    }

    // Desabilita botão "voltar" se já está no mês atual
    const todayFirst = new Date(today.getFullYear(), today.getMonth(), 1);
    const viewFirst  = new Date(viewYear, viewMonth, 1);
    prevBtn.disabled = viewFirst <= todayFirst;
  }

  // ── Seleciona um dia ──────────────────────────────────────
  function selectDay(date, cell) {
    selDay = date;

    // Remove seleção anterior
    document.querySelectorAll('.cal-day.selected').forEach(c =>
      c.classList.remove('selected')
    );
    cell.classList.add('selected');

    const dayName = PT_DAYS[date.getDay()];
    const dateStr = [
      String(date.getDate()).padStart(2, '0'),
      String(date.getMonth() + 1).padStart(2, '0'),
      date.getFullYear(),
    ].join('/');

    slotsTitle.textContent = `Horários disponíveis — ${dayName}, ${dateStr}`;
    slotsGrid.innerHTML    = '';
    confirmBox.style.display = 'none';

    // Monta horários
    buildSlots().forEach(({ label, value }) => {
      const btn = document.createElement('button');
      btn.className   = 'cal-slot';
      btn.textContent = label;
      btn.setAttribute('aria-label', `Selecionar horário ${label}`);
      btn.addEventListener('click', () => selectSlot(value, label, btn, dateStr, dayName));
      slotsGrid.appendChild(btn);
    });

    slotsWrap.classList.add('visible');

    // Scroll suave até os horários
    setTimeout(() =>
      slotsWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }),
      120
    );
  }

  // ── Seleciona um horário ──────────────────────────────────
  function selectSlot(value, label, btn, dateStr, dayName) {
    document.querySelectorAll('.cal-slot').forEach(b =>
      b.classList.remove('selected')
    );
    btn.classList.add('selected');

    confirmInfo.innerHTML = `
      📅 <strong>${dayName}, ${dateStr}</strong><br>
      🕐 <strong>${label}</strong><br>
      <span style="opacity:.65;font-size:.72rem;">Horário de Brasília (UTC-3)</span>
    `;

    const msg = encodeURIComponent(
      `Olá, Guilherme! 👋\nVi seu portfólio e gostaria de agendar uma conversa.\n\n📅 Data: ${dayName}, ${dateStr}\n🕐 Horário: ${label}\n\nAguardo sua confirmação!`
    );
    waBtn.href = `https://wa.me/${WA_NUMBER}?text=${msg}`;

    confirmBox.style.display = 'flex';

    setTimeout(() =>
      confirmBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' }),
      120
    );
  }

  // ── Navegação entre meses ─────────────────────────────────
  prevBtn.addEventListener('click', () => {
    if (viewMonth === 0) { viewMonth = 11; viewYear--; }
    else viewMonth--;
    // Limpa seleção ao mudar de mês
    selDay = null;
    slotsWrap.classList.remove('visible');
    renderCalendar();
  });

  nextBtn.addEventListener('click', () => {
    if (viewMonth === 11) { viewMonth = 0; viewYear++; }
    else viewMonth++;
    selDay = null;
    slotsWrap.classList.remove('visible');
    renderCalendar();
  });

  // ── Init ──────────────────────────────────────────────────
  renderCalendar();
})();

/* ─── 13. SMOOTH SCROLL PARA LINKS ÂNCORA ────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ─── 14. HIGHLIGHT ATIVO NO SCROLL (IntersectionObserver) ── */
// Complementa a versão do scroll listener da navbar para
// maior precisão usando IntersectionObserver
(function initActiveSection() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(l =>
            l.classList.toggle('active', l.getAttribute('href') === `#${id}`)
          );
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(sec => io.observe(sec));
})();