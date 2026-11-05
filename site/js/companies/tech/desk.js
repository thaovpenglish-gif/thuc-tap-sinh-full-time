// Nợ Kỹ Thuật Labs — desk work ("Ngồi vào bàn"): the real work of a startup intern, plus Slack drama that pings
// anyway. Engine: game/desk.js + modes/solo.js. Contract: docs/COMPANY_CONTRACT.md §12. Reference: companies/hr/desk.js.
// games (5): 2 hands-on (ui/action.js: đập bug, duyệt PR) + 3 work sims (ui/sims.js):
//   tech_pr_diff  (doc)  review a code diff: SQL injection, lộ khóa, log mật khẩu, N+1, null, số âm, chống trùng
//   tech_incident (doc)  đọc log sự cố, bug report, postmortem không đổ lỗi
//   tech_chat     (chat) CEO đòi "thêm nút nhỏ" trước release, người dùng bị trừ tiền 2 lần, on-call 2 giờ sáng
// chatter: [castId, text, dm?] messages that land WHILE you play, then a short scene with one choice.

const F = (k) => (r) => !!r.flags[k];

export const DESK = {
  games: [
    // ---- hands-on (ui/action.js) ----
    { id: 'tech_server', type: 'action', game: 'scale', title: 'Xếp service vào server', icon: '🖥️', time: 60, pass: 0.6, unit: 'GB', unitName: 'Server', icon2: '🖥️', btn: '✅ DEPLOY',
      items: [{ label: 'API ví', emoji: '💳', w: 8 }, { label: 'App web', emoji: '🌐', w: 4 }, { label: 'Worker gửi mail', emoji: '✉️', w: 2 }, { label: 'Cache', emoji: '⚡', w: 6 }, { label: 'Log agent', emoji: '📜', w: 1 }],
      targets: [[29, 31], [14, 15], [29, 31], [59, 62]], okText: 'Vừa RAM, không tràn!', overText: 'Hết RAM, server sập!', underText: 'Còn phí RAM, nhét thêm!',
      prompt: 'Mỗi server 32GB RAM, giữ chừa 1–2GB cho hệ điều hành. Bấm service để xếp vào, quá thì bấm server lấy ra, vừa thì DEPLOY. Server cuối là con 64GB.',
      hint: 'Nhìn số GB đang dùng ở trên, cần nằm trong khoảng cho phép.' },
    { id: 'tech_whack', type: 'action', game: 'whack', title: 'Đập bug trước giờ demo', icon: '🐛', time: 45, pass: 0.6, count: 26,
      slotText: 'main.js',
      target: { emoji: '🐛', labels: ['NullPointer', 'Crash khi login', 'Lag 3 giây', 'Nút không bấm được', 'Sai múi giờ'], hit: 'Fixed!', miss: 'Bug lọt lên prod' },
      avoid: { emoji: '✨', labels: ['Tính năng mới', 'Dark mode', 'Animation mèo', 'Nút gọi vốn'], hit: 'Ấy, đó là feature!' },
      prompt: 'Còn 30 phút là demo cho nhà đầu tư. Đập 🐛 thật nhanh. Đừng đập ✨: đó là tính năng, đập là mất.' },
    { id: 'tech_pr', type: 'action', game: 'conveyor', mode: 'stamp', title: 'Duyệt PR cuối ngày', icon: '✅', time: 55, pass: 0.6, count: 18,
      stampText: 'APPROVED', hit: 'Approve!', wrongHit: 'Merge nhầm, prod đỏ!', miss: 'PR tốt bị bỏ quên',
      target: { emoji: '🟢', labels: ['PR có test', 'Fix typo', 'Thêm log lỗi', 'PR nhỏ, có mô tả'] },
      avoid: { emoji: '🔴', labels: ['PR 4.000 dòng', 'Xóa test cho xanh', '"fix" không mô tả', 'Commit mật khẩu'] },
      prompt: 'Hàng PR chạy qua. Chỉ đóng dấu APPROVED cho PR ổn khi nó vào khung đỏ.',
      rule: 'Bấm (hoặc Space) khi PR ỔN vào khung đỏ' },
    // ---- work sims (ui/sims.js): real startup engineering work ----
    { id: 'tech_pr_diff', type: 'doc', title: 'Review code trước khi merge', icon: '🔍', time: 80, pass: 0.6,
      prompt: 'Đọc diff. Bấm 🚩 vào mọi dòng phải sửa mới được merge (bảo mật, mất dữ liệu, sập app). Code lạ mắt mà đúng thì để yên.',
      docs: [
        { kind: 'code', head: 'PR #904 · Tùng · Tìm đơn hàng theo tên khách', meta: 'CI: ✅ xanh · 3 file · anh Khải nhờ bạn review trước 17:00',
          lines: [
            { h: 'order-search.js' },
            'const MAX_RESULTS = 50; // giới hạn kết quả mỗi trang',
            'async function searchOrders(req, res) {',
            '  const { keyword } = req.query;',
            { t: "  const sql = `SELECT * FROM orders WHERE customer_name LIKE '%${keyword}%'`;", bad: 'Ghép chuỗi input vào SQL là SQL injection: gõ \' OR 1=1 -- là xem được mọi đơn. Dùng tham số ($1).' },
            '  const rows = await db.query(sql);',
            '  // TODO: thêm phân trang khi có trên 50 kết quả',
            { h: 'payment-client.js' },
            { t: "const PAYGATE_SECRET = 'sk_live_9f3a7c21e8b4d0';", bad: 'Khóa bí mật production nằm trong code là lộ theo Git. Đọc từ biến môi trường / secret manager, và xoay khóa ngay.' },
            'const TIMEOUT_MS = 8000;',
            { h: 'auth.js' },
            'async function login(email, password) {',
            { t: "  logger.info('login attempt', { email, password });", bad: 'Ghi mật khẩu vào log: ai đọc được log là có mật khẩu. Không bao giờ log mật khẩu, OTP, token.' },
            '  const user = await User.findByEmail(email.trim().toLowerCase());',
            "  if (!user) return { ok: false, error: 'Sai email hoặc mật khẩu' };",
            '  const ok = await bcrypt.compare(password, user.passwordHash);',
          ],
          verdict: { q: 'Kết luận review?', options: ['Request changes: chặn merge tới khi sửa xong', 'Approve, comment "sửa sau nhé"', 'Approve vì CI đã xanh'], correct: 0,
            why: 'CI xanh không bắt được SQL injection hay khóa bị lộ. Lỗi bảo mật thì chặn merge, không có "sửa sau".' } },
        { kind: 'code', head: 'PR #911 · Tùng · Giỏ hàng hiện phí ship', meta: 'CI: ✅ xanh · "máy em chạy được" · giỏ trung bình 18 món',
          lines: [
            { h: 'cart.js' },
            'async function loadCart(userId) {',
            '  const cart = await Cart.findByUser(userId);',
            { t: '  for (const item of cart.items) item.product = await api.get(`/products/${item.productId}`);', bad: 'N+1: giỏ 18 món là 18 lần gọi API nối đuôi nhau. Gom thành một lần: /products?ids=…' },
            { t: '  const city = cart.user.address.city;', bad: 'Người dùng mới chưa có địa chỉ thì address là null, app crash. Kiểm tra trước: cart.user.address?.city.' },
            '  const shipFee = SHIP_FEE[city] ?? SHIP_FEE.default;',
            '  const total = cart.items.reduce((s, i) => s + i.product.price * i.qty, 0);',
            '  return { items: cart.items, shipFee, total };',
            { h: 'cart.test.js' },
            "test('giỏ trống thì tổng bằng 0', async () => { … });",
            { t: "test.skip('tính lại phí ship khi đổi địa chỉ', async () => { … }); // hay fail", bad: 'Tắt test vì "hay fail" là giấu bug. Test chập chờn thì sửa test hoặc sửa code, không skip im lặng.' },
            "test('mã giảm 20% cho đơn 500.000đ còn 400.000đ', async () => { … });",
            { h: 'format.js' },
            "export const vnd = (n) => n.toLocaleString('vi-VN') + 'đ'; // 1500000 → 1.500.000đ",
          ],
          verdict: { q: 'Bạn làm gì với PR này?', options: ['Request changes, gợi ý cách sửa từng điểm', 'Approve, máy Tùng chạy được rồi', 'Tự sửa thẳng vào nhánh của Tùng rồi merge'], correct: 0,
            why: 'Review là để tác giả hiểu và tự sửa. Chặn merge kèm gợi ý cụ thể, không merge hộ, không approve cho xong.' } },
        { kind: 'code', head: 'PR #918 · Duy · Nạp tiền ví (ship gấp trước campaign)', meta: 'Hạn mức nạp: 20 triệu/ngày · Duy: "Campaign 8h sáng mai, approve giùm anh"',
          lines: [
            { h: 'wallet-topup.js' },
            "router.post('/wallet/topup', auth, rateLimit({ max: 5, per: '1m' }), async (req, res) => {",
            '  const { amount, requestId } = req.body;',
            { t: "  if (amount > 20_000_000) return res.status(400).json({ error: 'Vượt hạn mức' });", bad: 'Chỉ chặn trên, quên chặn dưới: số âm hoặc 0 vẫn lọt. Server phải kiểm tra amount là số nguyên dương.' },
            '  try {',
            '    await db.tx(async (t) => {',
            { t: '      await t.wallet.increment(req.user.id, amount);', bad: 'requestId nhận vào mà không dùng: bấm "Nạp" 2 lần hay mạng tự retry là cộng tiền 2 lần. Dùng nó làm khóa chống trùng.' },
            "      await t.ledger.insert({ userId: req.user.id, amount, type: 'TOPUP' });",
            '    });',
            { t: '  } catch (e) { /* bỏ qua cho đỡ ồn log */ }', bad: 'Nuốt lỗi im lặng: nạp tiền lỗi mà không ai biết, client chờ mãi. Log lỗi, trả mã lỗi, bắn cảnh báo.' },
            "  logger.info('topup', { userId: req.user.id, amount, requestId });",
            '  res.json({ ok: true });',
          ],
          verdict: { q: 'Duy nhắn lần thứ ba: "Approve đi em". Bạn…', options: ['Request changes, báo anh Khải: code đụng tiền không ship ẩu', 'Approve, Duy là lead mà', 'Approve, có chuyện thì tắt tính năng sau'], correct: 0,
            why: 'Code đụng tiền mà thiếu kiểm tra số âm và chống trùng là mất tiền thật. Deadline marketing không đổi được điều đó.' } },
      ] },

    { id: 'tech_incident', type: 'doc', title: 'Đọc log, bug report, postmortem', icon: '📟', time: 80, pass: 0.6,
      prompt: 'Đọc tài liệu sự cố. Bấm 🚩 vào dòng là nguyên nhân hoặc là vấn đề. Dòng trông đáng sợ mà vô hại (WARN cũ, 404 favicon…) thì để yên.',
      docs: [
        { kind: 'code', head: 'Log wallet-svc · 01:58–02:05', meta: 'Pager 02:03: tỉ lệ lỗi nạp tiền 31% (ngưỡng 5%). Đánh dấu các dòng chỉ ra nguyên nhân.',
          lines: [
            { h: 'deploy' },
            { t: '01:58:10 DEPLOY wallet-svc v4.2.3 (PR #918) · 100% traffic, không canary', bad: 'Bản mới lên 100% ngay, không canary, 3 phút trước khi lỗi bắt đầu: nghi phạm số một.' },
            { h: 'wallet-svc' },
            '01:59:02 INFO  GET /health 200 OK (12ms)',
            '02:00:41 WARN  crypto.createCipher is deprecated, use createCipheriv',
            { t: '02:01:05 ERROR db pool exhausted: 20/20 connections busy, waited 5000ms', bad: 'Hết kết nối DB: mọi request đứng chờ rồi timeout. Đây là triệu chứng chính.' },
            '02:01:06 INFO  GET /favicon.ico 404',
            { t: '02:01:07 ERROR connection not released after rollback (wallet-topup.js:41)', bad: 'Giao dịch lỗi mà không trả kết nối về pool: code mới rò rỉ kết nối, chỉ thẳng vào dòng 41.' },
            '02:02:15 WARN  paygate timeout, retry 1/3 → OK sau 800ms',
            '02:04:30 INFO  user 88213 login ok (2FA)',
          ],
          verdict: { q: 'Việc đầu tiên?', options: ['Rollback về v4.2.2, rồi mới sửa dòng 41', 'Tăng pool DB lên 200 kết nối', 'Restart database production'], correct: 0,
            why: 'Sự cố do bản deploy mới: khôi phục dịch vụ trước (rollback), điều tra sau. Tăng pool chỉ làm rò rỉ chết chậm hơn.' } },
        { kind: 'paper', head: 'NKT-2077 · Bug report của Duy', meta: 'Bug report tốt cần: bước tái hiện, môi trường, kết quả mong đợi và thực tế, bằng chứng. Gán cho: bạn.',
          lines: [
            { h: 'Mô tả' },
            { t: 'Tiêu đề: "App lỗi, sửa gấp!!!"', bad: 'Tiêu đề không nói lỗi gì, ở đâu. Viết lại kiểu: "Thanh toán ví báo E500 khi giỏ có voucher".' },
            'Kết quả thực tế: bấm "Thanh toán" thì hiện "Đã có lỗi xảy ra" (mã E500)',
            'Kết quả mong đợi: thanh toán thành công, chuyển sang màn hình đơn hàng',
            { h: 'Tái hiện' },
            { t: 'Các bước: "cứ dùng một lúc là bị"', bad: 'Không có bước tái hiện thì dev không lặp lại được lỗi, ticket sẽ về "Cannot reproduce".' },
            'Tần suất: 4/5 lần thử, đều là giỏ có voucher GIAM50',
            { h: 'Môi trường' },
            'App 4.2.3 (build 318) · Android 13 · Samsung A52 · Wi-Fi văn phòng',
            { t: 'Tài khoản test: duy@nokythuat.vn · mật khẩu: Duy@2024', bad: 'Mật khẩu thật nằm trong ticket ai cũng đọc được. Dùng tài khoản test chung, không dán mật khẩu.' },
            { h: 'Phân loại' },
            { t: 'Mức độ: P0, vì anh Kevin đang nhắc', bad: 'Mức độ tính theo ảnh hưởng (bao nhiêu người, có mất tiền không), không theo ai đang nhắc.' },
            'Đính kèm: video 14 giây, logcat_0211.txt',
          ],
          verdict: { q: 'Bạn làm gì với ticket này?', options: ['Hỏi Duy phần còn thiếu, sửa ticket cho đủ rồi xếp mức độ', 'Đóng ticket: "Cannot reproduce"', 'Bỏ hết việc đang làm vì nó ghi P0'], correct: 0,
            why: 'Có video và tần suất 4/5 nên lỗi là thật. Bổ sung cho đủ để tái hiện; mức độ thì tính theo ảnh hưởng.' } },
        { kind: 'paper', head: 'Postmortem (nháp) · Sự cố ví 02:01–02:19', meta: 'Postmortem không đổ lỗi (blameless): tìm lỗ hổng quy trình, không tìm người để phạt.',
          lines: [
            { h: 'Tóm tắt' },
            'Từ 02:01 đến 02:19, 31% lệnh nạp tiền lỗi. Khoảng 1.240 người dùng bị ảnh hưởng.',
            { t: 'Thời gian khắc phục, từ lúc pager báo (02:03) đến lúc hết lỗi (02:19): 26 phút', bad: '02:03 đến 02:19 là 16 phút, không phải 26. Một con số sai làm người đọc nghi cả báo cáo.' },
            'Pager báo sau 2 phút kể từ lỗi đầu tiên: cảnh báo hoạt động tốt',
            { h: 'Nguyên nhân' },
            { t: 'Nguyên nhân gốc: Duy code ẩu, người review không đọc kỹ', bad: 'Đổ lỗi cho người thì lần sau không ai dám khai thật. Ghi lỗ hổng: thiếu test, review không có checklist.' },
            'Lỗi kỹ thuật: wallet-topup.js không trả kết nối DB về pool khi giao dịch lỗi',
            'Vì sao lọt: deploy 100% không qua canary; staging không có tải giống thật',
            { h: 'Hành động' },
            { t: 'Mọi người cẩn thận hơn khi code', bad: 'Hành động không đo được, không người phụ trách, không hạn. Phải ghi rõ: ai, làm gì, trước ngày nào.' },
            'Bắt buộc canary 5% cho wallet-svc · anh Lộc · trước 15/11',
            'Thêm test "giao dịch lỗi phải trả kết nối" · anh Khải · trong sprint này',
            'Đối soát 1.240 giao dịch với cổng thanh toán · chị Nguyệt · trong hôm nay',
          ],
          verdict: { q: 'Gửi postmortem này cho cả công ty chưa?', options: ['Sửa 3 điểm đã đánh dấu rồi gửi', 'Gửi luôn, cho Duy nhớ đời', 'Thôi khỏi viết, rollback xong rồi'], correct: 0,
            why: 'Postmortem để sự cố không lặp lại: số đúng, không đổ lỗi, mỗi hành động có người phụ trách và hạn.' } },
      ] },

    { id: 'tech_chat', type: 'chat', title: 'Nhắn tin lúc nước sôi', icon: '💬', time: 85, pass: 0.6,
      prompt: 'Sếp, người dùng hoặc CTO đang nhắn. Trả lời như một kỹ sư tử tế: rõ ràng, có số, không hứa bừa. (Câu dài chưa chắc đã đúng.)',
      convos: [
        { who: { name: 'Anh Kevin', emoji: '🚀', role: 'CEO · 16:40, release lúc 18:00', app: 'Slack' },
          start: ['Em ơi release 18h đúng không? Thêm giúp anh nút "Chia sẻ giỏ hàng lên Zalo" nha. Nhỏ thôi, chừng hai tiếng.'],
          turns: [
            { options: [
              { t: 'Dạ anh, bản 18h đã khóa và test xong. Em đưa nút này vào bản tuần sau được không ạ?', s: 2, react: 'Nhưng 9h sáng mai anh demo cho anh Victor. Phải có cái gì mới.' },
              { t: 'Dạ được anh, em thêm ngay. Nút nhỏ nên chắc không cần qua QA, em tự test trên máy em là đủ, 18h vẫn kịp ạ.', s: 0, react: 'Tuyệt! Team mình nhanh thật. (Chị Nguyệt đang gõ…)' },
              { t: 'Dạ để em hỏi chị Diệp xem còn kịp không, chị ấy chấm RICE xong em báo lại anh sau, chắc tầm tối nay ạ.', s: 1, react: 'Diệp sẽ bắt anh chấm RICE. Anh hỏi em mà.' },
            ] },
            { them: 'Không có nó trong demo là anh mất điểm với quỹ đó em.', options: [
              { t: 'Dạ em làm bản demo trên staging, bật cờ tính năng riêng cho anh. Bản 18h giữ nguyên ạ.', s: 2, react: 'Demo được là được. Anh đâu cần cả nước thấy.' },
              { t: 'Dạ vậy mình dời release sang 22h nha anh, em làm thêm buổi tối, chị Nguyệt test lúc 21h, có gì em với anh Lộc canh đêm ạ.', s: 0, react: 'Ok luôn! …Anh Lộc vừa thả 🫠.' },
              { t: 'Dạ khó lắm anh ạ', s: 1, react: 'Khó thì mới là startup em.' },
            ] },
            { them: 'Mà nút share thì làm gì lâu? Hai tiếng là cùng.', options: [
              { t: 'Dạ tại code giỏ hàng của anh Khải từ 2022, không ai dám đụng, chắc cả tuần ạ.', s: 0, react: 'Anh Khải đang đọc tin này đó em.' },
              { t: 'Dạ nút thì nhanh, nhưng còn link mở app, ảnh xem trước và test trên 7 máy. Em ước 2 ngày ạ.', s: 2, react: 'Hai ngày… Ừ, anh không nghĩ tới ảnh xem trước.' },
              { t: 'Dạ thì đúng là nút thôi ạ', s: 1, react: 'Đó. Vậy làm đi.' },
            ] },
            { them: 'Ok. Vậy giờ anh báo ai?', options: [
              { t: 'Dạ tùy anh ạ', s: 1, react: 'Em là người làm mà "tùy anh"?' },
              { t: 'Dạ anh khỏi báo ai, tối mọi người về hết em tự merge vào bản 18h rồi deploy luôn, sáng mai anh có nút để demo ạ.', s: 0, react: 'Nghe ổn! (Anh Thạc đã thêm reaction 👀)' },
              { t: 'Dạ em tạo ticket, gắn chị Diệp xếp ưu tiên. Link demo em gửi anh trước 21h ạ.', s: 2, react: 'Ok. Có quy trình nghe yên tâm ghê.' },
            ] },
          ],
          end: { good: 'Link staging gửi anh trước 21h nhé. Cảm ơn em, team mình mature ghê.', bad: 'Release lỗi rồi em ơi. Chị Nguyệt nói không ai báo chị ấy test.' } },
        { who: { name: 'Chị Mai', emoji: '🛒', role: 'Người dùng app Lúa · chat hỗ trợ', app: 'Chat trong app' },
          start: ['Tôi bị trừ tiền 2 lần cho một đơn! 389.000đ × 2. Trả lại ngay cho tôi!'],
          turns: [
            { options: [
              { t: 'Dạ em xin lỗi chị. Chị cho em mã đơn và giờ thanh toán để em kiểm tra ngay ạ.', s: 2, react: 'Mã LUA-55821, lúc 12h05 trưa nay.' },
              { t: 'Dạ chị đọc giúp em mật khẩu ví và mã OTP vừa gửi về máy, em đăng nhập vào tài khoản kiểm tra giúp chị cho nhanh ạ.', s: 0, react: 'Mật khẩu với OTP?? Mấy app lừa đảo cũng hỏi y vậy đó.' },
              { t: 'Dạ chị chụp màn hình gửi em ạ', s: 1, react: 'Chụp rồi, gửi rồi. Rồi sao nữa?' },
            ] },
            { them: 'Bao giờ tôi có tiền lại? Tối nay tôi phải trả tiền nhà.', options: [
              { t: 'Dạ chị yên tâm, 5 phút nữa tiền về liền, em cam kết luôn ạ.', s: 0, react: 'Ừ, tôi canh đồng hồ đó.' },
              { t: 'Dạ em đã báo hoàn lần trừ thứ hai, thường 3–5 ngày làm việc tùy ngân hàng. Mã yêu cầu HT-7741 ạ.', s: 2, react: 'Lâu vậy… nhưng có mã thì tôi đỡ lo.' },
              { t: 'Dạ hoàn tiền là do ngân hàng của chị chứ không phải bên em, chị gọi tổng đài ngân hàng hỏi giúp em nhé, bên em không can thiệp được ạ.', s: 1, react: 'Tiền vào túi các bạn mà bảo tôi đi hỏi ngân hàng?' },
            ] },
            { them: 'Lỗi gì mà trừ 2 lần? App các bạn làm ăn kiểu gì vậy?', options: [
              { t: 'Dạ lỗi phía bên em, đội kỹ thuật đang sửa. Em xin lỗi vì làm phiền chị ạ.', s: 2, react: 'Ừ. Nói thật vậy là được.' },
              { t: 'Dạ chắc tại chị bấm nút Thanh toán hai lần liên tiếp đó chị, lần sau chị chỉ bấm một lần rồi chờ màn hình xoay xong là được ạ.', s: 0, react: 'Giờ thành lỗi của tôi hả?' },
              { t: 'Dạ em cũng không rõ ạ', s: 1, react: 'Vậy ai rõ?' },
            ] },
            { them: 'Tôi sẽ đánh giá 1 sao và đăng lên nhóm Review Đi Chợ.', options: [
              { t: 'Dạ chị đừng đăng nha chị, em tặng chị voucher 200 nghìn nếu chị xóa đánh giá và không đăng nhóm, mình giữ kín giúp em ạ.', s: 0, react: 'Mua chuộc à? Tôi chụp màn hình rồi.' },
              { t: 'Dạ vâng, đó là quyền của chị, bên em luôn tôn trọng mọi đánh giá của người dùng ạ.', s: 1, react: 'Ừ, tôi biết. Câu này nghe như văn mẫu.' },
              { t: 'Dạ em hiểu. Tiền về là em nhắn chị ngay ạ.', s: 2, react: 'Được. Tôi chờ tin em.' },
            ] },
          ],
          end: { good: 'Tiền về rồi nha em. Cảm ơn em, lần sau làm cẩn thận nha.', bad: 'Tôi gỡ app rồi. Đi chợ ngoài cho lành.' } },
        { who: { name: 'Anh Thạc', emoji: '🧯', role: 'CTO · on-call cùng bạn · 02:07', app: 'Slack #incident' },
          start: ['@oncall wallet-svc lỗi 31%. Ai cầm?'],
          turns: [
            { options: [
              { t: 'Em ack rồi anh. Đang xem, 5 phút em báo.', s: 2, react: 'Ok.' },
              { t: 'Dạ em thấy rồi, nhưng giờ khuya quá, để sáng mai cả team vào xem cho chắc, sửa lúc buồn ngủ dễ sai hơn ạ.', s: 0, react: '31% lệnh nạp tiền đang lỗi. Sáng mai là 6 tiếng nữa.' },
              { t: '👀', s: 1, react: 'Lộc-ngữ không phải ngôn ngữ chính thức của #incident.' },
            ] },
            { them: 'Có gì mới đổi không?', options: [
              { t: 'Em đang sửa thẳng code trên server production cho nhanh, chạy ổn rồi em commit lên Git sau ạ, anh yên tâm.', s: 0, react: 'Dừng tay. Không ai sửa tay trên prod.' },
              { t: 'Dạ chắc do DB yếu ạ', s: 1, react: '"Chắc"?' },
              { t: 'v4.2.3 deploy 01:58, lỗi từ 02:01, log báo hết kết nối DB. Em đề xuất rollback.', s: 2, react: 'Rollback đi.' },
            ] },
            { them: 'Rollback xong. Lỗi còn 0,2%. Giờ sao?', options: [
              { t: 'Em canh dashboard 30 phút, cập nhật #incident 15 phút một lần.', s: 2, react: 'Đúng. Ghi cả giờ.' },
              { t: 'Em tìm xem ai merge PR #918 rồi tag người đó vào đây để mọi người biết, lần sau người ta cẩn thận hơn ạ.', s: 0, react: 'Mình tìm lỗ hổng, không tìm người. Nhớ.' },
              { t: 'Dạ lỗi về 0,2% rồi thì coi như xong, em đóng cảnh báo rồi đi ngủ, sáng mai em xem lại ạ.', s: 1, react: 'Chưa. Rollback xong mới là nửa đường.' },
            ] },
            { them: 'Còn sót gì không?', options: [
              { t: 'Dạ để mai tính ạ', s: 1, react: 'Mai tính cái gì? Ghi ra.' },
              { t: 'Dạ hết rồi anh, rollback xong thì giao dịch lỗi tự hoàn hết, người dùng có vấn đề thì họ sẽ tự báo mình ạ.', s: 0, react: 'Tiền không tự hoàn. Người dùng sẽ tự báo. Trên mạng.' },
              { t: 'Đối soát giao dịch 02:01–02:19 với cổng thanh toán, gửi CS danh sách bị trừ tiền.', s: 2, react: 'Đúng câu anh định hỏi.' },
            ] },
          ],
          end: { good: 'Tốt. 9h sáng viết postmortem cùng anh. Không đổ lỗi, có hành động. Đi ngủ đi.', bad: 'Anh cầm từ đây. Em ngủ đi. Mai mình nói chuyện.' } },
      ] },
  ],

  // errands that lead into the hands-on games (`play` = a desk game id; engine: game/office.js officeGameFor)
  tasks: [
    { id: 'desk_bug', title: 'Đập bug gấp trước giờ demo', from: 'diep', base: 50, legs: [
      { npc: 'diep', line: ['diep', 'Nửa tiếng nữa demo cho nhà đầu tư. Em về máy đập hết bug trên màn hình chính giúp chị.'] },
      { obj: 'desk', play: 'tech_whack', line: ['nar', 'Bạn đập xong. Một con bug bò ra từ file README, nhưng nhà đầu tư không đọc README.'] },
      { npc: 'diep', line: ['diep', 'Demo chạy. Không ai biết em vừa cứu cả vòng gọi vốn. Chị biết.'] },
    ] },
  ],

  chatter: [
    { id: 'tech_ch_friday', chat: [['tung', 'Em deploy hotfix nhỏ nha, 5 phút thôi 🚀'], ['thac', 'Hôm nay thứ mấy?'], ['tung', 'Thứ Sáu ạ. 16:58.'], ['thac', 'Ai deploy?'], ['bot', '✅ Deploy thành công 🙏']],
      scene: [
        ['think', 'Bot luôn kèm 🙏. Giờ mình hiểu vì sao.'],
        { c: 'tech_desk_friday', o: [
          { t: 'Nhắn #deploy: "Em canh dashboard 30 phút cùng anh Thạc"', fx: { uy: 1, rel: { thac: 2 }, nl: -3 } },
          { t: 'Thả 🔥 vào tin của bot', fx: { dr: 2, rel: { tung: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'tech_ch_linkedin', chat: [['kevin', 'Team ơi anh vừa đăng: "Một đêm mất ngủ, tôi nhận ra văn hóa là tất cả" 🚀 Vào like + comment nha'], ['ngan', 'Đã like! Comment: "Truyền cảm hứng quá anh ơi 💐"'], ['thao', 'Bài đăng lúc 2 giờ sáng. Đêm đó anh không có trong #incident.'], ['kevin', 'Mindset em ạ.']],
      scene: [
        ['think', 'Một đêm mất ngủ của anh Kevin. Ba đêm mất ngủ của anh Thạc. Chỉ một đêm lên LinkedIn.'],
        { c: 'tech_desk_linkedin', o: [
          { t: 'Like, comment một câu có thật', fx: { rel: { kevin: 2 }, clock: 5 } },
          { t: 'Thả 👀 vào tin của chị Thảo', fx: { dr: 2, rel: { thao: 1, kevin: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'tech_ch_repro', chat: [['nguyet', 'Bug NKT-2041: giỏ hàng tự xóa sau khi khóa màn hình. Có video, có log, có 3 máy.'], ['tung', 'Cannot reproduce. Máy em chạy được.'], ['nguyet', 'Máy em là máy gì?'], ['tung', 'Máy em.'], ['nguyet', 'Dòng 215 trong file Excel nha.']],
      scene: [
        ['think', 'File "Không phải bug" của chị Nguyệt sắp có thêm một dòng. Hoặc một nhân chứng.'],
        { c: 'tech_desk_repro', o: [
          { t: 'Thử lại trên máy test số 5, gửi video vào thread', fx: { uy: 2, rel: { nguyet: 2 }, clock: 10, set: { tech_desk_repro: true } } },
          { t: 'Thả 😂 vào tin "Máy em."', fx: { dr: 2, rel: { tung: 1, nguyet: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'tech_ch_quicksync', chat: [['ngan', 'Bạn nào rảnh 15 phút chiều nay mình quick sync nha 💐 Không có gì đâu'], ['duy', 'Lần trước "không có gì đâu" là đợt cắt giảm tháng 6 🙂'], ['ngan', 'Lần này là sinh nhật Mèo 404 thật mà 🎂'], ['hoa', 'Bánh chị đặt rồi. Vị cá ngừ. Người không ăn được.']],
      scene: [
        ['think', 'Ở đây "quick sync" có hai nghĩa. Hôm nay may mắn là nghĩa có bánh.'],
        { c: 'tech_desk_quicksync', o: [
          { t: 'Nhận lời, mang theo dĩa và nến', fx: { rel: { ngan: 2, hoa: 1 }, clock: 5 } },
          { t: 'Nhắn riêng Duy: "Anh cập nhật CV chưa?"', fx: { dr: 3, rel: { duy: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'tech_ch_color', chat: [['vy', 'Ai đổi màu nút "Đặt hàng" trên prod vậy? #FF6B6C. Sai một đơn vị.'], ['khai', 'It depends. Ai hỏi?'], ['vy', 'Vy hỏi. Comment thứ 62.'], ['diep', 'Mình align lại: màu chuẩn nằm trong design token. Ai sửa tay vào code?'], ['khai', '…Code của anh. Năm 2022. Không tính.']],
      scene: [
        ['think', 'Một đơn vị màu. Ba người. Hai năm nợ kỹ thuật.'],
        { c: 'tech_desk_color', o: [
          { t: 'Mở PR đổi về design token, tag Vy review', fx: { uy: 2, rel: { vy: 2, diep: 1 }, nl: -2 } },
          { t: 'Thả 🎨 cho comment thứ 62', fx: { dr: 1, rel: { vy: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'tech_ch_lucgpt', chat: [['chau', 'Mọi người ơi em vừa ăn trưa với chú Victor 🤖'], ['chau', 'Chú bảo app có AI thì định giá x3. Em viết PRD LúaGPT bản 7 rồi!'], ['victor', '(được thêm vào nhóm) Hi team. Love the energy.'], ['thao', 'Ai thêm nhà đầu tư vào group nội bộ vậy?']],
      scene: [
        ['think', 'Nhà đầu tư đang đọc group nội bộ. Tin nhắn phía trên là "runway còn bao lâu vậy mọi người?".'],
        { c: 'tech_desk_lucgpt', o: [
          { t: 'Nhắn riêng Châu: "Gỡ chú Victor ra trước, rồi mình đọc PRD cùng"', fx: { uy: 1, rel: { chau: 1, thao: 1 } } },
          { t: '"Bản 7 có thêm AI không Châu?"', fx: { dr: 2, rel: { chau: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'tech_ch_loc', chat: [['bot', '🚨 ALERT: wallet-svc latency 3.2s 🙏'], ['loc', '🔥'], ['loc', '👀'], ['thac', 'Lộc, cần thêm người không?'], ['loc', '🙏⏪']],
      scene: [
        ['think', 'Dịch Lộc-ngữ: cháy, đang xem, đang rollback, xin đừng ai hỏi gì thêm.'],
        { c: 'tech_desk_loc', o: [
          { t: 'Nhắn: "Em canh dashboard và báo CS giúp anh"', fx: { uy: 1, rel: { loc: 2, thac: 1 }, nl: -3 } },
          { t: 'Gửi meme "This is fine" vào #incident', fx: { dr: 3, rel: { thac: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'tech_ch_runway', chat: [['kevin', 'Series B sắp xong rồi team. Lần này thật 🚀'], ['thao', 'Nhắc nhẹ: từ tháng sau máy lạnh tắt lúc 18:00. Tối ưu chi phí.'], ['hoa', 'Nước tăng lực free chuyển thành nước tăng lực "tự nguyện góp" nha mọi người 🌼'], ['duy', 'Series B này "sắp xong" kiểu Series A không anh?']],
      scene: [
        ['think', 'Tin vui từ CEO, tin thật từ COO. Nước tăng lực luôn là thứ đầu tiên biết sự thật.'],
        { c: 'tech_desk_runway', o: [
          { t: 'Góp tiền một thùng nước tăng lực cho team', fx: { money: -30_000, rel: { hoa: 2 } } },
          { t: 'Thả 🚀 vào tin anh Kevin', fx: { dr: 1, rel: { kevin: 1, thao: -1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
    { id: 'tech_ch_tanaka', chat: [['hieu', 'Tanaka-san gửi Q&A số 148: "Tại sao nút màu đỏ?"'], ['vy', 'Vì design system ạ. #FF6B6B.'], ['hieu', 'Trả lời khách Nhật không dùng "vì" một mình được. Cần 3 đoạn và một lời cảm ơn.'], ['tanaka', 'お世話になっております。Q&A 149: Why 3 paragraph?']],
      scene: [
        ['think', 'Q&A 148 đẻ ra Q&A 149 trong hai phút. Dự án Nhật có hệ sinh thái riêng.'],
        { c: 'tech_desk_tanaka', o: [
          { t: 'Soạn giúp anh Hiếu bản nháp: lý do, tài liệu tham chiếu, lời cảm ơn', fx: { uy: 1, rel: { hieu: 2 }, clock: 10 } },
          { t: 'Thả 🙇 vào tin của Tanaka-san', fx: { dr: 1, rel: { hieu: 1 } } },
          { t: 'Tắt thông báo, làm tiếp', fx: { uy: 1 } },
        ] },
      ] },
  ],

  promoOffer: [
    ['nar', 'Review xong, chị Diệp mở Notion. Một trang tên "Đề xuất headcount Fresher", có bảng, có điểm RICE.'],
    ['diep', 'Chị chấm em theo framework. Reach: ticket nào em cũng đụng. Impact: không incident nào do em. Confidence: cao. Effort: em hơi quá sức.'],
    ['diep', 'Cả tháng, công ty bận drama: LinkedIn, Series B, "quick sync". Chị mở Jira thì thấy cột Done ticket nào cũng có tên em.'],
    { if: F('tech_desk_repro'), then: [['diep', 'Chị Nguyệt nói em là người duy nhất chịu thử lại bug thay vì gõ "cannot reproduce". Chị ghi cái đó vào cột Confidence.']] },
    ['diep', 'Chị đề xuất em lên Fresher chính thức. Mười lăm triệu, hợp đồng lao động, có bảo hiểm. Và có tên trong lịch on-call. Anh Thạc gật rồi.'],
    ['think', 'Mười lăm triệu và một cái pager. Startup gọi đó là "gói đãi ngộ".'],
    { c: 'tech_work_offer', o: [
      { t: 'Nhận lời.', fx: { uy: 5, rel: { diep: 2 }, set: { accept_official: true } }, then: [
        ['diep', 'Welcome to full-time. Thứ Hai chị gửi em OKR cá nhân. Ba Key Result, đo được. Không có chữ "siêu app".'],
      ] },
      { t: '"Em cảm ơn chị, nhưng em muốn thử chỗ khác ạ."', fx: { set: { accept_official: false } }, then: [
        ['diep', 'Ok. Framework của chị không có ô "giữ người bằng mọi giá". Chị chỉ ghi một dòng: "Rủi ro: mất người làm thật."'],
      ] },
    ] },
  ],
};
