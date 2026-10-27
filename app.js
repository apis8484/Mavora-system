/* Shared helpers for every page */
window.sb = window.supabase.createClient(MAVORA_CONFIG.url, MAVORA_CONFIG.key);

function $(id) { return document.getElementById(id); }

/* Never put raw text from the database into the page without escaping it */
function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function fmtDate(v) {
  if (!v) return '';
  return new Date(v).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kuala_Lumpur' });
}

function fmtDateTime(v) {
  if (!v) return '';
  return new Date(v).toLocaleString('ms-MY', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kuala_Lumpur' });
}

function showMsg(id, text, kind) {
  var el = $(id);
  if (!el) return;
  el.textContent = text || '';
  el.className = 'msg' + (kind ? ' ' + kind : '');
  el.hidden = !text;
}

function busy(btn, on, label) {
  if (!btn) return;
  if (on) { btn.dataset.label = btn.textContent; btn.textContent = label || '...'; btn.disabled = true; }
  else { btn.textContent = btn.dataset.label || btn.textContent; btn.disabled = false; }
}

/* Database errors arrive in English; members see them in BM */
function bmError(err) {
  var m = (err && (err.message || err.error_description)) || String(err || '');
  if (/Sponsor code .* not found/i.test(m)) return 'Kod penaja tidak dijumpai. Sila semak semula.';
  if (/is not active/i.test(m)) return 'Penaja ini tidak aktif. Sila hubungi pemimpin anda.';
  if (/already registered as/i.test(m)) return 'Akaun ini sudah didaftarkan sebagai ahli.';
  if (/No unclaimed member record/i.test(m)) return 'Tiada rekod ahli untuk e-mel ini.';
  if (/members_email_key|duplicate key.*email/i.test(m)) return 'E-mel ini sudah digunakan oleh ahli lain.';
  if (/members_ic_no_key|duplicate key.*ic_no/i.test(m)) return 'Nombor kad pengenalan ini sudah didaftarkan.';
  if (/Invalid login credentials/i.test(m)) return 'E-mel atau kata laluan tidak tepat.';
  if (/Email not confirmed/i.test(m)) return 'E-mel belum disahkan. Sila semak peti masuk anda.';
  if (/User already registered/i.test(m)) return 'E-mel ini sudah mempunyai akaun. Sila log masuk.';
  if (/Password should be at least/i.test(m)) return 'Kata laluan mestilah sekurang-kurangnya 6 aksara.';
  if (/rate limit/i.test(m)) return 'Terlalu banyak cubaan. Sila cuba sebentar lagi.';
  return 'Ralat: ' + m;
}

async function signOut() {
  await sb.auth.signOut();
  location.href = 'index.html';
}
