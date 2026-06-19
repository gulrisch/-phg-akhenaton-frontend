const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000'
  : 'https://phg-akhenaton-ia.up.railway.app';

function animerCompteur(el, cible, duree) {
  if (!el) return;
  duree = duree || 2000;
  let debut = 0;
  const step = cible / (duree / 16);
  const timer = setInterval(function() {
    debut += step;
    if (debut >= cible) { el.textContent = cible; clearInterval(timer); }
    else el.textContent = Math.floor(debut);
  }, 16);
}

document.addEventListener('DOMContentLoaded', function() {
  animerCompteur(document.getElementById('nb-oeuvres'), 12);
  animerCompteur(document.getElementById('nb-auteurs'), 3);
  animerCompteur(document.getElementById('nb-pays'), 8);
  chargerCatalogue();
});

async function chargerCatalogue() {
  try {
    const res = await fetch(API_URL + '/oeuvres/?limit=5');
    if (!res.ok) return;
    const oeuvres = await res.json();
    if (oeuvres.length > 0) console.log('Catalogue live:', oeuvres.length);
  } catch (e) {
    console.log('Mode statique');
  }
}

function filtrer(cat) {
  const cartes = document.querySelectorAll('.livre-card[data-cat]');
  cartes.forEach(function(c) {
    c.style.display = (cat === 'tous' || c.dataset.cat === cat) ? 'block' : 'none';
  });
  document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
  event.target.classList.add('active');
}

function toggleMenu() {
  const nav = document.querySelector('.nav-links');
  if (nav.style.display === 'flex') {
    nav.removeAttribute('style');
  } else {
    nav.style.display = 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.top = '70px';
    nav.style.right = '1rem';
    nav.style.background = '#111';
    nav.style.padding = '1rem';
    nav.style.border = '1px solid rgba(212,168,50,0.3)';
    nav.style.borderRadius = '8px';
    nav.style.zIndex = '200';
  }
}

const demoReplies = [
  "La domination digitale repose sur 3 piliers : visibilité, autorité et conversion. Lequel souhaitez-vous approfondir ?",
  "L'auteur explique que la présence numérique est le nouveau territoire de conquête de l'entrepreneur africain.",
  "Achetez l'oeuvre pour accéder au chatbot complet — 200+ pages de stratégies applicables immédiatement."
];
let demoCount = 0;

async function sendDemo() {
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  const question = input.value.trim();
  if (!question) return;

  const msgUser = document.createElement('div');
  msgUser.className = 'msg msg-user';
  msgUser.textContent = question;
  messages.appendChild(msgUser);
  input.value = '';

  const typing = document.createElement('div');
  typing.className = 'msg msg-ia';
  typing.textContent = '...';
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  await new Promise(function(r) { setTimeout(r, 800); });
  typing.textContent = demoReplies[demoCount % demoReplies.length];
  demoCount++;
  messages.scrollTop = messages.scrollHeight;

  if (demoCount >= 3) {
    const cta = document.createElement('div');
    cta.className = 'msg msg-ia';
    cta.innerHTML = 'Preview termine. Achetez l\'oeuvre pour un acces illimite.';
    messages.appendChild(cta);
    const row = document.querySelector('.chat-input-row');
    row.style.opacity = '0.5';
    row.querySelector('input').disabled = true;
  }
}
