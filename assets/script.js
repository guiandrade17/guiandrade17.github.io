/* ============================================================
   script.js – Guilherme Brito Portfólio
============================================================ */

/* 1. LOADER */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 1200);
});

/* 2. PARTÍCULAS */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 70;
  const COLOR = '0,245,200';

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function createParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x: rand(0, W), y: rand(0, H), r: rand(0.5, 2),
      dx: rand(-0.3, 0.3), dy: rand(-0.3, 0.3), alpha: rand(0.2, 0.7),
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${COLOR},${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR},${p.alpha})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  }
  resize(); createParticles(); draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();

/* 3. NAVBAR */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 100) current = sec.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
  });
  navLinks.forEach(l => l.addEventListener('click', () => {
    document.getElementById('nav-links').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  }));
})();

/* 4. HAMBURGER */
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  btn.addEventListener('click', () => { btn.classList.toggle('open'); links.classList.toggle('open'); });
})();

/* 5. TYPING EFFECT */
(function initTyping() {
  const el = document.getElementById('typed-text');
  const phrases = ['Estudante de Eng. Software', 'Front-end Developer', 'Apaixonado por código', 'Futuro Engenheiro'];
  let pi = 0, ci = 0, deleting = false;
  function type() {
    const phrase = phrases[pi];
    el.textContent = deleting ? phrase.substring(0, ci--) : phrase.substring(0, ci++);
    let delay = deleting ? 60 : 100;
    if (!deleting && ci > phrase.length)  { delay = 1800; deleting = true; }
    if (deleting  && ci < 0)             { deleting = false; pi = (pi + 1) % phrases.length; delay = 300; }
    setTimeout(type, delay);
  }
  setTimeout(type, 1400);
})();

/* 6. SCROLL REVEAL */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 80); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* 7. SKILL BARS */
(function initSkillBars() {
  const fills = document.querySelectorAll('.tech-fill');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.w + '%'; io.unobserve(e.target); } });
  }, { threshold: 0.3 });
  fills.forEach(f => io.observe(f));
})();

/* 8. CALENDÁRIO */
(function initCalendar() {
  const WA_NUMBER  = '5561992689516';
  const HOUR_START = 8;
  const HOUR_END   = 18;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let viewYear  = today.getFullYear();
  let viewMonth = today.getMonth();
  let selDay    = null;

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

  const PT_MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const PT_DAYS   = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];

  function sameDay(a, b) { return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
  function isWeekend(d)  { return d.getDay()===0 || d.getDay()===6; }
  function isPast(d)     { return d < today; }

  function buildSlots() {
    const slots = [];
    for (let h = HOUR_START; h < HOUR_END; h++) {
      const hh = String(h).padStart(2,'0');
      const end = String(h+1).padStart(2,'0');
      slots.push({ label: `${hh}:00 – ${end}:00`, value: `${hh}:00` });
    }
    return slots;
  }

  function renderCalendar() {
    monthLabel.textContent = `${PT_MONTHS[viewMonth]} ${viewYear}`;
    daysGrid.innerHTML = '';
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) {
      const e = document.createElement('div'); e.className = 'cal-day empty'; daysGrid.appendChild(e);
    }
    for (let d = 1; d <= lastDate; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const cell = document.createElement('div');
      cell.textContent = d;
      const classes = ['cal-day'];
      if (sameDay(date, today))           classes.push('today');
      if (isPast(date))                    classes.push('past');
      else if (isWeekend(date))            classes.push('available', 'weekend');
      else                                 classes.push('available');
      if (selDay && sameDay(date, selDay)) classes.push('selected');
      cell.className = classes.join(' ');
      if (!isPast(date)) cell.addEventListener('click', () => selectDay(date, cell));
      daysGrid.appendChild(cell);
    }
    const todayFirst = new Date(today.getFullYear(), today.getMonth(), 1);
    const viewFirst  = new Date(viewYear, viewMonth, 1);
    prevBtn.disabled = viewFirst <= todayFirst;
    prevBtn.style.opacity = prevBtn.disabled ? '0.3' : '1';
  }

  function selectDay(date, cell) {
    selDay = date;
    document.querySelectorAll('.cal-day.selected').forEach(c => c.classList.remove('selected'));
    cell.classList.add('selected');
    const dayName = PT_DAYS[date.getDay()];
    const dateStr = `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`;
    slotsTitle.textContent = `Horários disponíveis — ${dayName}, ${dateStr}`;
    slotsGrid.innerHTML = '';
    confirmBox.style.display = 'none';
    buildSlots().forEach(({ label, value }) => {
      const btn = document.createElement('button');
      btn.className = 'cal-slot'; btn.textContent = label;
      btn.addEventListener('click', () => selectSlot(value, label, btn, dateStr, dayName));
      slotsGrid.appendChild(btn);
    });
    slotsWrap.classList.add('visible');
    setTimeout(() => slotsWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  }

  function selectSlot(value, label, btn, dateStr, dayName) {
    document.querySelectorAll('.cal-slot').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    confirmInfo.innerHTML = `📅 <strong>${dayName}, ${dateStr}</strong><br>🕐 <strong>${label}</strong><br><span style="opacity:.7;font-size:.75rem;">Horário de Brasília (UTC-3)</span>`;
    const msg = encodeURIComponent(`Olá, Guilherme! 👋\nVi seu portfólio e gostaria de agendar uma conversa.\n\n📅 Data: ${dayName}, ${dateStr}\n🕐 Horário: ${label}\n\nAguardo sua confirmação!`);
    waBtn.href = `https://wa.me/${WA_NUMBER}?text=${msg}`;
    confirmBox.style.display = 'flex';
    setTimeout(() => confirmBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  }

  prevBtn.addEventListener('click', () => { if (viewMonth===0) { viewMonth=11; viewYear--; } else viewMonth--; renderCalendar(); });
  nextBtn.addEventListener('click', () => { if (viewMonth===11) { viewMonth=0; viewYear++; } else viewMonth++; renderCalendar(); });

  renderCalendar();
})();
