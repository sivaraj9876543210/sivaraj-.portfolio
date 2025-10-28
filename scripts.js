/* -------------------------
   Main interactive behavior
   ------------------------- */

// ---------- Typing effect ----------
const typingEl = document.querySelector('.typing');
const words = [ "AI Enthusiast", "Web Developer", ];
let wIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  if(!typingEl) return;
  const word = words[wIndex % words.length];
  if(!deleting){
    charIndex++;
    typingEl.textContent = word.substring(0, charIndex);
    if(charIndex === word.length){
      deleting = true;
      setTimeout(typeLoop, 700);
      return;
    }
  } else {
    charIndex--;
    typingEl.textContent = word.substring(0, charIndex);
    if(charIndex === 0){
      deleting = false;
      wIndex++;
      setTimeout(typeLoop, 300);
      return;
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 120);
}
typeLoop();

// ---------- Vanta Waves background ----------
let vantaEffect = null;
function initVanta(){
  if(window.VANTA && window.VANTA.WAVES){
    // Destroy previous if exists (e.g., hot reload)
    if(vantaEffect) vantaEffect.destroy();
    vantaEffect = VANTA.WAVES({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 300.00,
      minWidth: 200.00,
      scale: 1.0,
      scaleMobile: 0.8,
      color: 0x0077ff,
      shininess: 30.00,
      waveHeight: 20.00,
      waveSpeed: 1.00
    });
  } else {
    // Fallback: add a subtle gradient background if Vanta isn't loaded
    document.getElementById('vanta-bg').style.background = 'linear-gradient(120deg,#0f1724,#071022)';
  }
}
window.addEventListener('load', initVanta);
window.addEventListener('beforeunload', () => { if(vantaEffect) vantaEffect.destroy(); });

// ---------- Smooth scroll for nav ----------
document.querySelectorAll('nav .nav-links a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

// ---------- Dark / Light toggle ----------
const toggleBtn = document.getElementById('toggle-theme');
toggleBtn && toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  toggleBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// ---------- Skill bar animation on intersection ----------
const skillSpans = document.querySelectorAll('.skill-bar span');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const span = entry.target.querySelector('.skill-bar span');
      if(span) span.style.width = span.dataset.skill || span.style.width;
    }
  });
}, {threshold:0.25});
document.querySelectorAll('#skills .skill').forEach(s => skillObserver.observe(s));

// Set data-skill based on markup
skillSpans.forEach(s => {
  // already setup in markup via data-skill attribute; keep as-is
  // ensure CSS starts at 0 width (it does)
});

// ---------- Reveal scroll (fade & slide) ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('reveal-visible');
    }
  });
}, {threshold: 0.12});

document.querySelectorAll('.section-title, .project-card, .cert-card, .lead, .hero-content, .skill, .contact-form').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Add simple CSS for reveal (in JS to ensure it's applied)
const style = document.createElement('style');
style.innerHTML = `
.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease, transform .6s ease}
.reveal-visible{opacity:1;transform:translateY(0)}
`;
document.head.appendChild(style);

// ---------- Contact form (simple UI) ----------
const form = document.getElementById('contact-form');
if(form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Lightweight UI feedback (replace with real backend later)
    const submitBtn = form.querySelector('button[type="submit"]');
    const orig = submitBtn ? submitBtn.textContent : null;
    if(submitBtn) submitBtn.textContent = 'Sending...';
    setTimeout(() => {
      alert('Message sent — I will get back to you soon!');
      form.reset();
      if(submitBtn) submitBtn.textContent = orig;
    }, 900);
  });
}

// ---------- Accessibility: reduce motion for prefers-reduced-motion ----------
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.documentElement.style.scrollBehavior = 'auto';
  // destroy Vanta for reduced motion users
  if(vantaEffect){ vantaEffect.destroy(); vantaEffect = null; }
}