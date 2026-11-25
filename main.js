// ===== Santhosh — premium site interactions =====

const PHONE = '918951068599';
const EMAIL = 'santhoshdevaraj2003@gmail.com';
const finePointer = window.matchMedia('(pointer: fine)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------------- Smooth scroll ---------------- */
let lenis = null;
if (!reduceMotion && typeof window.Lenis === 'function') {
  lenis = new window.Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id === '#top' ? 0 : document.querySelector(id);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: id === '#top' ? 0 : -80 });
    })
  );
}

/* ---------------- Loader ---------------- */
const loader = document.getElementById('loader');
const heroTitle = document.getElementById('heroTitle');
function startHero() {
  heroTitle.classList.add('go');
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    el.style.transitionDelay = `${300 + i * 110}ms`;
    el.classList.add('in');
  });
}
if (loader && !reduceMotion) {
  document.body.classList.add('loading');
  lenis?.stop();
  const bar = document.getElementById('loaderBar');
  const count = document.getElementById('loaderCount');
  const t0 = performance.now();
  const DURATION = 1700;
  (function tick(now) {
    const p = Math.min(1, (now - t0) / DURATION);
    const eased = 1 - Math.pow(1 - p, 3);
    bar.style.width = `${eased * 100}%`;
    count.textContent = String(Math.round(eased * 100)).padStart(2, '0');
    if (p < 1) return requestAnimationFrame(tick);
    setTimeout(() => {
      loader.classList.add('done');
      document.body.classList.remove('loading');
      lenis?.start();
      setTimeout(startHero, 250);
      setTimeout(() => loader.remove(), 1300);
    }, 200);
  })(t0);
} else {
  loader?.remove();
  startHero();
}

/* ---------------- Theme toggle (moon / sun) ---------------- */
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
function syncThemeLabel() {
  const light = root.dataset.theme === 'light';
  themeBtn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f6f1e7' : '#08080b');
}
syncThemeLabel();
themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.classList.add('theme-anim');
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
  syncThemeLabel();
  clearTimeout(themeBtn.t);
  themeBtn.t = setTimeout(() => root.classList.remove('theme-anim'), 700);
});

/* ---------------- Nav + progress ---------------- */
const nav = document.getElementById('nav');
const progress = document.getElementById('progress');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 30);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  updateManifesto();
  parallax(y);
}
window.addEventListener('scroll', onScroll, { passive: true });

menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => { navLinks.classList.remove('open'); menuBtn.classList.remove('open'); })
);

/* ---------------- Reveal on scroll ---------------- */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
      el.style.transitionDelay = `${Math.min(Math.max(sibs.indexOf(el), 0), 6) * 90}ms`;
      el.classList.add('in');
      io.unobserve(el);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal:not(.hero .reveal), .step, .skills').forEach((el) => io.observe(el));

/* ---------------- Manifesto: words light up on scroll ---------------- */
const manifesto = document.getElementById('manifesto');
const GOLD_WORDS = new Set(['design,', 'engineering', 'intelligence', 'premium', 'thinks']);
let mWords = [];
if (manifesto) {
  manifesto.innerHTML = manifesto.textContent
    .trim()
    .split(/\s+/)
    .map((w) => `<span class="mw${GOLD_WORDS.has(w) ? ' g' : ''}">${w}</span>`)
    .join(' ');
  mWords = [...manifesto.querySelectorAll('.mw')];
}
function updateManifesto() {
  if (!manifesto) return;
  const r = manifesto.getBoundingClientRect();
  const start = innerHeight * 0.85;
  const end = innerHeight * 0.35;
  const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height * 0.6)));
  const n = Math.round(p * mWords.length);
  mWords.forEach((w, i) => w.classList.toggle('lit', i < n));
}

/* ---------------- Parallax ---------------- */
const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');
const codeCard = document.querySelector('.code-card');
function parallax(y) {
  if (reduceMotion || y > innerHeight * 1.5) return;
  if (orb1) orb1.style.translate = `0 ${y * 0.25}px`;
  if (orb2) orb2.style.translate = `0 ${y * -0.15}px`;
  if (codeCard && innerWidth > 1020) codeCard.style.translate = `0 ${y * -0.12}px`;
}

/* ---------------- Custom cursor ---------------- */
const glow = document.querySelector('.cursor-glow');
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
if (finePointer && !reduceMotion) {
  document.body.classList.add('has-cursor');
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, gx = x, gy = y;
  addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });
  (function loop() {
    rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
    gx += (x - gx) * 0.08; gy += (y - gy) * 0.08;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    glow.style.left = `${gx}px`; glow.style.top = `${gy}px`;
    requestAnimationFrame(loop);
  })();

  const ringLabel = ring.querySelector('span');
  document.querySelectorAll('a, button, .tile, [data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (el.dataset.cursor) { ringLabel.textContent = el.dataset.cursor; ring.classList.add('label'); dot.style.opacity = 0; }
      else ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => { ring.classList.remove('hover', 'label'); dot.style.opacity = ''; });
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = 0; ring.style.opacity = 0; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = ''; ring.style.opacity = ''; });
} else {
  glow?.remove(); dot?.remove(); ring?.remove();
}

/* ---------------- Tilt, spotlight, magnetic ---------------- */
if (finePointer) {
  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
  document.querySelectorAll('.tile').forEach((t) =>
    t.addEventListener('mousemove', (e) => {
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', `${e.clientX - r.left}px`);
      t.style.setProperty('--my', `${e.clientY - r.top}px`);
    })
  );
  document.querySelectorAll('.magnetic, .round-badge').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ---------------- Neural network canvas (hero) ---------------- */
const canvas = document.getElementById('neural');
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(devicePixelRatio || 1, 2);
  let W, H, nodes = [], mouse = { x: -9999, y: -9999 }, visible = true;

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const count = Math.round(Math.min(90, (W * H) / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6, gold: Math.random() < 0.18,
    }));
  }
  resize();
  addEventListener('resize', resize);
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  const LINK = 130;
  const isLight = () => document.documentElement.dataset.theme === 'light';
  (function draw() {
    requestAnimationFrame(draw);
    if (!visible) return;
    ctx.clearRect(0, 0, W, H);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
      if (d < 160) { n.x -= dx * 0.004; n.y -= dy * 0.004; }
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          const md = Math.hypot(mouse.x - (a.x + b.x) / 2, mouse.y - (a.y + b.y) / 2);
          const boost = md < 180 ? 0.35 : 0;
          ctx.strokeStyle = `rgba(${isLight() ? '168,119,42' : '232,194,122'},${(1 - d / LINK) * 0.18 + boost * (1 - d / LINK)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      const L = isLight();
      ctx.fillStyle = n.gold ? (L ? 'rgba(176,122,34,0.95)' : 'rgba(246,222,168,0.95)') : (L ? 'rgba(40,32,20,0.35)' : 'rgba(243,239,230,0.45)');
      if (n.gold) { ctx.shadowColor = L ? '#d9a441' : '#e8c27a'; ctx.shadowBlur = 10; }
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  })();
}

/* ---------------- Copy buttons + toast ---------------- */
const toast = document.getElementById('toast');
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove('show'), 1800);
}
document.querySelectorAll('.copy').forEach((b) =>
  b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); showToast('Copied to clipboard ✓'); }
    catch { showToast(b.dataset.copy); }
  })
);

/* ---------------- Contact form → WhatsApp / Email ---------------- */
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
let via = 'whatsapp';
form.querySelectorAll('button[type="submit"]').forEach((b) => b.addEventListener('click', () => { via = b.dataset.via; }));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  let ok = true;
  ['name', 'message'].forEach((k) => {
    const field = form.querySelector(`#${k}`).parentElement;
    const bad = !String(data[k] || '').trim();
    field.classList.toggle('error', bad);
    if (bad) ok = false;
  });
  if (!ok) { note.textContent = 'Please add your name and a short project description.'; return; }

  const text =
    `Hi Santhosh! 👋\n\nName: ${data.name}\n` +
    (data.phone ? `Contact: ${data.phone}\n` : '') +
    `Interested in: ${data.service}\n\nProject details:\n${data.message}`;

  if (via === 'email') {
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Project enquiry — ${data.service}`)}&body=${encodeURIComponent(text)}`;
    note.textContent = 'Opening your email app…';
  } else {
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    note.textContent = 'Opening WhatsApp…';
  }
  form.reset();
});

onScroll();
