// Thin wrapper over the members API. Every call sends the session cookie.
(function () {
  async function request(method, url, body) {
    const opts = { method, credentials: 'same-origin', headers: {} };
    if (body !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    const res = await fetch(url, opts);
    let data = null;
    try { data = await res.json(); } catch (_) { /* empty body */ }
    if (!res.ok) {
      const err = new Error((data && data.error) || `http_${res.status}`);
      err.status = res.status;
      err.details = data && data.details;
      throw err;
    }
    return data;
  }

  window.API = {
    login: (username, pin) => request('POST', '/api/auth/login', { username, pin }),
    logout: () => request('POST', '/api/auth/logout'),
    list: (tab, q) => request('GET', `/api/members?tab=${encodeURIComponent(tab)}&q=${encodeURIComponent(q || '')}`),
    get: (id) => request('GET', `/api/members/${encodeURIComponent(id)}`),
    create: (body) => request('POST', '/api/members', body),
    update: (id, body) => request('PATCH', `/api/members/${encodeURIComponent(id)}`, body),
    archive: (id) => request('POST', `/api/members/${encodeURIComponent(id)}/archive`),
    restore: (id) => request('POST', `/api/members/${encodeURIComponent(id)}/restore`),
  };
})();
