/* PHG AKHENATON IA — API Client */
const API = {
  async get(endpoint) {
    const token = localStorage.getItem('akhenaton_token');
    const res = await fetch(CONFIG.API_URL + endpoint, {
      headers: token ? { Authorization: 'Bearer ' + token } : {}
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async post(endpoint, data) {
    const token = localStorage.getItem('akhenaton_token');
    const res = await fetch(CONFIG.API_URL + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {})
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async postForm(endpoint, formData) {
    const token = localStorage.getItem('akhenaton_token');
    const res = await fetch(CONFIG.API_URL + endpoint, {
      method: 'POST',
      headers: token ? { Authorization: 'Bearer ' + token } : {},
      body: formData
    });
    if (!res.ok) throw await res.json();
    return res.json();
  }
};
