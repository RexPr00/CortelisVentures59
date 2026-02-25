const body = document.body;
const langSwitch = document.querySelector('.lang-switch');
const langBtn = document.querySelector('.lang-active');
if (langSwitch && langBtn) {
  langBtn.addEventListener('click', () => {
    const open = langSwitch.classList.toggle('open');
    langBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!langSwitch.contains(e.target)) {
      langSwitch.classList.remove('open');
      langBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

const drawer = document.querySelector('.mobile-drawer');
const burger = document.querySelector('.burger');
const drawerClose = document.querySelector('.drawer-close');
let lastFocus = null;
const focusableSelector = 'a, button, input, [tabindex]:not([tabindex="-1"])';

function trapFocus(container, e) {
  const nodes = [...container.querySelectorAll(focusableSelector)].filter(n => !n.disabled);
  if (!nodes.length) return;
  const first = nodes[0], last = nodes[nodes.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function toggleDrawer(open) {
  if (!drawer || !burger) return;
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  burger.setAttribute('aria-expanded', String(open));
  body.classList.toggle('no-scroll', open);
  if (open) {
    lastFocus = document.activeElement;
    drawer.querySelector('.drawer-close')?.focus();
  } else {
    lastFocus?.focus();
  }
}
burger?.addEventListener('click', () => toggleDrawer(true));
drawerClose?.addEventListener('click', () => toggleDrawer(false));
drawer?.addEventListener('click', (e) => { if (e.target === drawer) toggleDrawer(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    toggleDrawer(false);
    closeModal();
  }
  if (drawer?.classList.contains('open') && e.key === 'Tab') trapFocus(drawer, e);
  if (modal?.classList.contains('open') && e.key === 'Tab') trapFocus(modal, e);
});

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const btn = item.querySelector('.faq-q');
  btn?.addEventListener('click', () => {
    faqItems.forEach((f) => {
      if (f !== item) {
        f.classList.remove('open');
        f.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      }
    });
    const open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
});

const modal = document.querySelector('#privacy-modal');
const openModalBtn = document.querySelector('[data-open-modal]');
const closeModalBtns = document.querySelectorAll('[data-close-modal]');
function openModal() {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  body.classList.add('no-scroll');
  modal.querySelector('.modal-x')?.focus();
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  body.classList.remove('no-scroll');
}
openModalBtn?.addEventListener('click', openModal);
closeModalBtns.forEach((b) => b.addEventListener('click', closeModal));
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

const ranges = document.querySelectorAll('.calc input[type="range"]');
const totalOut = document.querySelector('#alloc-total');
const noteOut = document.querySelector('#alloc-note');
function updateCalc() {
  const vals = [...ranges].map(r => Number(r.value));
  const sum = vals.reduce((a, b) => a + b, 0);
  if (totalOut) totalOut.textContent = `${sum}%`;
  if (noteOut) {
    noteOut.textContent = sum > 110 ? 'Higher concentration risk: rebalance to improve liquidity flexibility.' : sum < 90 ? 'Under-allocated model: increase exposure for return capture.' : 'Balanced allocation for mandate fit and controlled liquidity risk.';
  }
}
ranges.forEach((r) => r.addEventListener('input', updateCalc));
updateCalc();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.18 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
