// "Lưu lên mây" panel inside the Solo career menu: email + game password sync, and 8-character save codes.
import { $, esc } from '../core/util.js';
import { toast } from './toast.js';
import { cloud } from '../net/cloud.js';
import { mergeProfiles, validateProfile, listRuns } from '../game/save.js';

const ERR = {
  email: 'Email chưa đúng định dạng.',
  pass: 'Mật khẩu game cần 6–72 ký tự.',
  wrong: 'Sai mật khẩu game cho email này.',
  locked: 'Nhập sai nhiều lần quá. Thử lại sau 15 phút nhé.',
  code: 'Mã không đúng hoặc đã hết hạn (30 ngày).',
  data: 'Dữ liệu lưu không hợp lệ.',
  token: 'Phiên đồng bộ đã hết. Đăng nhập lại nhé.',
};
const maskEmail = (e) => e.replace(/^(.{1,2})[^@]*(@.*)$/, '$1***$2');

/** opts: { getProfile() -> profile, setProfile(profile), onChanged() } */
export function createCloudPanel(opts) {
  const box = $('#cloudBox');
  let pushTimer = null, busy = false, lastSync = null;

  function render() {
    if (cloud.linked) {
      box.innerHTML = `<div class="cloud-card on"><div class="cloud-h">☁️ Đang đồng bộ với <b>${esc(maskEmail(cloud.email))}</b></div>
        <div class="cloud-sub">${lastSync ? `Lần cuối: ${lastSync}` : 'Tự lưu lên mây mỗi khi game lưu.'} Mở game ở máy khác, đăng nhập cùng email + mật khẩu game là chơi tiếp.</div>
        <div class="cloud-row"><button class="btn" id="cloudSync">🔄 Đồng bộ ngay</button><button class="btn" id="cloudMakeCode">🔑 Tạo mã lưu</button><button class="btn ghost" id="cloudOut">Đăng xuất</button></div>
        <div id="cloudCodeOut"></div></div>`;
      $('#cloudSync').onclick = () => syncNow(true);
      $('#cloudOut').onclick = async () => { await cloud.logout(); toast('Đã đăng xuất khỏi mây. Tiến trình vẫn còn trên máy này.', 'msg', 3); render(); };
      $('#cloudMakeCode').onclick = makeCode;
      return;
    }
    box.innerHTML = `<details class="cloud-card"><summary>☁️ <b>Lưu lên mây</b> · chơi tiếp trên máy khác</summary>
      <div class="cloud-grid">
        <div class="cloud-col"><div class="cloud-h">📧 Email + mật khẩu game</div>
          <input id="cloudEmail" type="email" placeholder="email@cua-ban.com" autocomplete="username" maxlength="120">
          <input id="cloudPass" type="password" placeholder="Mật khẩu game (≥ 6 ký tự)" autocomplete="current-password" maxlength="72">
          <button class="btn primary" id="cloudLogin">Lưu & đồng bộ</button>
          <div class="cloud-sub">Lần đầu nhập là tạo tài khoản. Game không gửi email; đừng dùng mật khẩu thật của email.</div></div>
        <div class="cloud-col"><div class="cloud-h">🔑 Mã lưu 8 ký tự</div>
          <button class="btn" id="cloudMakeCode">Tạo mã từ tiến trình hiện tại</button>
          <div id="cloudCodeOut"></div>
          <input id="cloudCode" placeholder="Nhập mã, VD: ABCD-2345" maxlength="12" autocomplete="off">
          <button class="btn" id="cloudClaim">Lấy tiến trình từ mã</button>
          <div class="cloud-sub">Mã dùng được 30 ngày, nhập ở máy nào cũng được. Lượt chơi trùng sẽ giữ bản mới hơn.</div></div>
      </div></details>`;
    $('#cloudLogin').onclick = login;
    $('#cloudPass').addEventListener('keydown', (e) => { if (e.key === 'Enter') login(); });
    $('#cloudMakeCode').onclick = makeCode;
    $('#cloudClaim').onclick = claim;
    $('#cloudCode').addEventListener('keydown', (e) => { if (e.key === 'Enter') claim(); });
  }
  const stamp = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  function adopt(remote) {
    const local = opts.getProfile();
    const merged = mergeProfiles(local, remote);
    const before = listRuns(local).length;
    opts.setProfile(merged);
    return listRuns(merged).length - before;
  }
  async function login() {
    if (busy) return;
    const email = $('#cloudEmail').value.trim(), pass = $('#cloudPass').value;
    busy = true; $('#cloudLogin').disabled = true; $('#cloudLogin').textContent = 'Đang kết nối…';
    try {
      const r = await cloud.login(email, pass);
      if (!r.ok) { toast(`☁️ ${ERR[r.error] || 'Không đăng nhập được.'}`, 'bad', 3.5); return; }
      const added = r.data ? adopt(r.data) : 0;
      const p = await cloud.push(opts.getProfile());
      lastSync = stamp();
      toast(r.created ? '☁️ Đã tạo tài khoản lưu và đẩy tiến trình lên mây!' : `☁️ Đã đồng bộ${added > 0 ? `: thêm ${added} lượt chơi từ mây` : ''}!`, p.ok ? 'good' : 'bad', 3.5);
      opts.onChanged && opts.onChanged();
    } catch (err) { console.warn(err); toast('☁️ Không kết nối được máy chủ. Thử lại sau nhé.', 'bad', 3); }
    finally { busy = false; render(); }
  }
  async function syncNow(loud) {
    if (!cloud.linked || busy) return;
    busy = true;
    try {
      const r = await cloud.pull();
      if (!r.ok) { if (loud) toast(`☁️ ${ERR[r.error] || 'Lỗi đồng bộ'}`, 'bad', 3); return; }
      const added = r.data ? adopt(r.data) : 0;
      const p = await cloud.push(opts.getProfile());
      lastSync = stamp();
      if (loud || added > 0) toast(`☁️ Đồng bộ xong${added > 0 ? `: thêm ${added} lượt chơi` : ''}.`, p.ok ? 'good' : 'bad', 2.5);
      if (added > 0) opts.onChanged && opts.onChanged();
    } catch (err) { if (loud) toast('☁️ Đang offline, sẽ đồng bộ sau.', 'bad', 2.5); }
    finally { busy = false; if (!$('#soloMenu').hidden) render(); }
  }
  async function makeCode() {
    const btn = $('#cloudMakeCode'); btn.disabled = true;
    try {
      const prof = opts.getProfile();
      if (!listRuns(prof).length) { toast('Chưa có lượt chơi nào để tạo mã.', 'bad', 2.5); return; }
      const r = await cloud.createCode(prof);
      if (!r.ok) { toast(`🔑 ${ERR[r.error] || 'Không tạo được mã.'}`, 'bad', 3); return; }
      const pretty = `${r.code.slice(0, 4)}-${r.code.slice(4)}`;
      $('#cloudCodeOut').innerHTML = `<div class="cloud-code"><b>${pretty}</b><button class="btn" id="cloudCopy">📋 Chép</button></div><div class="cloud-sub">Mã chứa tiến trình lúc này, dùng được 30 ngày.</div>`;
      $('#cloudCopy').onclick = () => { try { navigator.clipboard.writeText(pretty); toast('Đã chép mã!', 'good', 2); } catch { /* no clipboard */ } };
    } catch { toast('🔑 Không kết nối được máy chủ.', 'bad', 3); }
    finally { btn.disabled = false; }
  }
  async function claim() {
    const code = $('#cloudCode').value.trim();
    if (code.replace(/[^A-Za-z0-9]/g, '').length !== 8) { toast('Mã lưu có 8 ký tự nhé.', 'bad', 2.5); return; }
    try {
      const r = await cloud.claimCode(code);
      if (!r.ok || !validateProfile(r.data)) { toast(`🔑 ${ERR[r.error] || ERR.data}`, 'bad', 3); return; }
      const added = adopt(r.data);
      toast(`🔑 Đã lấy tiến trình từ mã${added > 0 ? `: thêm ${added} lượt chơi` : ' (đã gộp với máy này)'}!`, 'good', 3);
      opts.onChanged && opts.onChanged();
    } catch { toast('🔑 Không kết nối được máy chủ.', 'bad', 3); }
  }
  // push shortly after each local save (debounced)
  document.addEventListener('solo:saved', () => {
    if (!cloud.linked) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(async () => { try { const r = await cloud.push(opts.getProfile()); if (r.ok) lastSync = stamp(); } catch { /* offline: next save retries */ } }, 5000);
  });
  document.addEventListener('solo:menu', () => { render(); syncNow(false); });
  render();
  return { render, syncNow };
}
