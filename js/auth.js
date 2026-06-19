/* PHG AKHENATON IA — Auth */
const AUTH = {
  token: localStorage.getItem('akhenaton_token'),
  user: JSON.parse(localStorage.getItem('akhenaton_user') || 'null'),

  isLoggedIn() { return !!this.token; },

  save(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('akhenaton_token', token);
    localStorage.setItem('akhenaton_user', JSON.stringify(user));
  },

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('akhenaton_token');
    localStorage.removeItem('akhenaton_user');
    window.location.href = '/';
  }
};

function openModal(type) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  overlay.classList.add('active');

  if (type === 'login') {
    content.innerHTML = `
      <h2>𓂀 CONNEXION</h2>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="login-email" placeholder="votre@email.com">
      </div>
      <div class="form-group">
        <label>Mot de passe</label>
        <input type="password" id="login-pwd" placeholder="••••••••">
      </div>
      <div id="login-err" class="error-msg"></div>
      <button class="btn-gold form-submit" onclick="doLogin()">SE CONNECTER</button>
      <p class="form-switch">Pas de compte ? <a onclick="openModal('register')">Créer un compte</a></p>
    `;
  } else {
    content.innerHTML = `
      <h2>𓂀 CRÉER UN COMPTE</h2>
      <div class="form-group">
        <label>Prénom</label>
        <input type="text" id="reg-prenom" placeholder="Votre prénom">
      </div>
      <div class="form-group">
        <label>Nom</label>
        <input type="text" id="reg-nom" placeholder="Votre nom">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="reg-email" placeholder="votre@email.com">
      </div>
      <div class="form-group">
        <label>Mot de passe</label>
        <input type="password" id="reg-pwd" placeholder="Minimum 8 caractères">
      </div>
      <div class="form-group">
        <label>Je suis</label>
        <select id="reg-role">
          <option value="acheteur">Acheteur — Je veux découvrir des œuvres</option>
          <option value="auteur">Auteur — Je veux publier mes créations</option>
        </select>
      </div>
      <div id="reg-err" class="error-msg"></div>
      <button class="btn-gold form-submit" onclick="doRegister()">CRÉER MON COMPTE</button>
      <p class="form-switch">Déjà un compte ? <a onclick="openModal('login')">Se connecter</a></p>
    `;
  }
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

async function doLogin() {
  const email = document.getElementById('login-email').value;
  const pwd = document.getElementById('login-pwd').value;
  const errEl = document.getElementById('login-err');
  try {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', pwd);
    const res = await fetch(CONFIG.API_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });
    if (!res.ok) throw await res.json();
    const data = await res.json();
    AUTH.save(data.access_token, data.user);
    closeModal();
    updateNavbar();
    if (data.user.role === 'auteur') window.location.href = '/pages/dashboard.html';
  } catch (e) {
    errEl.textContent = e.detail || 'Erreur de connexion';
  }
}

async function doRegister() {
  const errEl = document.getElementById('reg-err');
  try {
    const data = await API.post('/auth/register', {
      nom: document.getElementById('reg-nom').value,
      prenom: document.getElementById('reg-prenom').value,
      email: document.getElementById('reg-email').value,
      password: document.getElementById('reg-pwd').value,
      role: document.getElementById('reg-role').value
    });
    AUTH.save(data.access_token, data.user);
    closeModal();
    updateNavbar();
  } catch (e) {
    errEl.textContent = e.detail || 'Erreur lors de la création';
  }
}

function updateNavbar() {
  const actionsEl = document.querySelector('.nav-actions');
  if (!actionsEl) return;
  if (AUTH.isLoggedIn()) {
    actionsEl.innerHTML = `
      <span style="font-size:0.75rem;color:var(--gold);letter-spacing:1px">𓂀 ${AUTH.user.nom}</span>
      <a href="/pages/dashboard.html" class="btn-outline">Dashboard</a>
      <button class="btn-gold" onclick="AUTH.logout()">Déconnexion</button>
    `;
  }
}

function toggleNav() {
  document.querySelector('.nav-links').classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', updateNavbar);
