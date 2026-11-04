// In-game phone: Teams-style chat log + anonymous confession wall (Supabase).
import { $, esc } from '../core/util.js';
import { toast } from './toast.js';

function timeAgo(iso) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'vừa xong';
  if (s < 3600) return Math.floor(s / 60) + ' phút trước';
  if (s < 86400) return Math.floor(s / 3600) + ' giờ trước';
  return Math.floor(s / 86400) + ' ngày trước';
}
const confHTML = (c, isNew) => `<div class="conf${isNew ? ' new' : ''}"><div class="meta"><span>👻 ${esc(c.nickname)}</span><span>${timeAgo(c.created_at)}</span></div><div class="txt">${esc(c.body)}</div></div>`;

/**
 * opts: { net, charInfo(id), getChat() -> [{from,t,dm,time}], getName() -> string,
 *         onOpen(), onClose(), onReadChat() }
 */
export function createPhone(opts) {
  let tab = 'zalo';
  let open = false;
  let ttsLoaded = false;

  function renderChat() {
    const list = $('#chatList');
    const chat = opts.getChat();
    if (!chat.length) { list.innerHTML = '<div class="empty">Chưa có tin nhắn nào. Yên bình… quá yên bình.</div>'; return; }
    list.innerHTML = chat.map((m) => {
      if (m.from === 'nar') return `<div class="sys">${esc(m.t)}</div>`;
      const c = opts.charInfo(m.from);
      return `<div class="msg"><div class="av" style="background:${c.color}">${c.emoji}</div><div class="bub"><div class="who">${esc(c.name)}${m.dm ? '<span class="dm">nhắn riêng</span>' : ''}</div><div class="txt">${esc(m.t)}</div><div class="tm">${esc(m.time)}</div></div></div>`;
    }).join('');
    list.scrollTop = list.scrollHeight;
  }

  async function loadTts() {
    if (ttsLoaded) return;
    ttsLoaded = true;
    const list = $('#ttsList');
    list.innerHTML = '<div class="empty">Đang tải…</div>';
    if (!opts.net.ok) { list.innerHTML = '<div class="empty">Không kết nối được. Thử lại sau nhé.</div>'; return; }
    const rows = await opts.net.loadConfessions();
    list.innerHTML = rows.length ? rows.map((r) => confHTML(r)).join('') : '<div class="empty">Chưa ai than thở. Bạn mở bát đi!</div>';
  }

  function setTab(t) {
    tab = t;
    document.querySelectorAll('.phone-tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === t));
    $('#paneZalo').hidden = t !== 'zalo';
    $('#paneTts').hidden = t !== 'tts';
    if (t === 'zalo') { opts.onReadChat(); renderChat(); }
    if (t === 'tts') loadTts();
  }

  opts.net.onConfession((row) => {
    if (!ttsLoaded) return;
    const list = $('#ttsList');
    const empty = list.querySelector('.empty'); if (empty) empty.remove();
    list.insertAdjacentHTML('afterbegin', confHTML(row, true));
  });
  $('#ttsBody').addEventListener('input', () => { $('#ttsLeft').textContent = 280 - $('#ttsBody').value.length; });
  $('#ttsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = $('#ttsBody').value.trim();
    if (!body) return;
    const btn = $('#ttsForm button');
    btn.disabled = true;
    try {
      const nick = $('#ttsAnon').checked ? 'Intern ẩn danh' : `Intern ${opts.getName() || 'ẩn danh'}`;
      await opts.net.postConfession(nick, body);
      $('#ttsBody').value = ''; $('#ttsLeft').textContent = '280';
      toast('Đã đăng lên Hội Intern 👻', 'good');
    } catch (err) {
      toast('Không đăng được: ' + esc(err.message || 'lỗi mạng'), 'bad', 3);
    }
    btn.disabled = false;
  });
  document.querySelectorAll('.phone-tabs button').forEach((b) => { b.onclick = () => setTab(b.dataset.tab); });
  $('#phoneClose').onclick = () => api.close();
  $('#phone').addEventListener('click', (e) => { if (e.target.id === 'phone') api.close(); });

  const api = {
    get isOpen() { return open; },
    get tab() { return tab; },
    open(t) {
      if (t) setTab(t);
      $('#phone').hidden = false;
      open = true;
      if (tab === 'zalo') opts.onReadChat();
      renderChat();
      if (tab === 'tts') loadTts();
      opts.onOpen();
    },
    close() {
      if (!open) return;
      $('#phone').hidden = true;
      open = false;
      opts.onClose();
    },
    refresh() { if (open && tab === 'zalo') renderChat(); },
  };
  return api;
}
