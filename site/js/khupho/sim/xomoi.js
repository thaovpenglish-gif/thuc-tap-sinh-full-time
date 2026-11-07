// Khu phố T&M · "Xóm Ơi", the residents' chat group "Cư dân KP7 Tâm Mỹ" (admin: bà Phấn). DESIGN.md 3.8.
// 3-8 messages a day generated from the day's events. Quiet hours 23:00-06:00 unless there is drama.
import { pick, int, shuffle, rng } from './rng.js';
import { dateOf, hourLabel, WEEKDAYS } from './calendar.js';
import { ITEMS, WEATHER_LABEL } from './economy.js';

export const GROUP_NAME = 'Cư dân KP7 Tâm Mỹ';
export const QUIET_FROM = 23 * 60, QUIET_TO = 6 * 60;
export const LAW_NOTE = '(thông tin giải trí, không phải tư vấn pháp lý)';

const P = {
  phan: ['kp:phan', 'Bà Phấn'], cuong: ['kp:cuong', 'Chú Cường'], nga: ['kp:nga', 'Cô Nga'], lanh: ['kp:lanh', 'Cô Ba Lành'],
  kha: ['kp:kha', 'Anh Kha'], vinh: ['kp:vinh', 'Anh Vĩnh'], oanh: ['kp:oanh', 'Chị Oanh'], thuan: ['kp:thuan', 'Anh Thuận'],
  chin: ['kp:chin', 'Dì Chín'], phu: ['kp:phu', 'Anh Phú'], huyen: ['kp:huyen', 'Chị Huyền'], cosau: ['bama:cosau', 'Cô Sáu Tạp Hóa'],
  nhung: ['kp:nhung', 'Chị Nhung'], bong: ['kp:bong', 'Bông'], tu: ['kp:tu', 'Tú'], cam: ['kp:cam', 'Bà Cẩm'], lai: ['kp:lai', 'Cô Lài'],
  banhmi: ['hr:banhmi', 'Cô Bánh Mì'], khoi: ['kp:khoi', 'Anh Khôi'], tan: ['kp:tan', 'Chú Tấn'], man: ['kp:man', 'Chị Mận'],
  thanh: ['kp:thanh', 'Ông Thanh'], luong: ['kp:luong', 'Chú Lương'], vu: ['kp:vu', 'Anh Vũ'], manh: ['kp:manh', 'Anh Mạnh'],
  lam: ['kp:lam', 'Bác sĩ Lâm'], hoai: ['kp:hoai', 'Cô Hoài'], hao: ['kp:hao', 'Anh Hào'], thinh: ['kp:thinh', 'Anh Thịnh'],
};
const msg = (min, who, text, extra = {}) => ({ min, fromId: P[who][0], from: P[who][1], text, ...extra });

// Everyday chatter. when(ctx) filters; at = [fromMin, toMin] inside 06:00-22:59.
const CHATTER = [
  { who: 'phan', at: [420, 600], text: 'Chào buổi sáng cả nhà. Nhắc nhẹ: rác bỏ đúng giờ, đừng để mèo hẻm 7 làm kiểm toán thùng rác.' },
  { who: 'phan', at: [1200, 1350], text: 'Nhà ai phơi đồ ở lan can tầng 2 dãy trọ Bình An thì vô lấy nha, gió thổi qua nhà tui ba cái rồi.' },
  { who: 'chin', at: [360, 540], text: 'Rau muống sáng nay tươi lắm, ai lấy để dì để riêng. Trả giá nhẹ tay giùm dì.' },
  { who: 'huyen', at: [400, 600], text: 'Xoài cát về rồi bà con ơi, ngọt như lời hứa tăng lương.' },
  { who: 'cosau', at: [480, 720], text: 'Tiệm có nước mắm mới về. Ai mua chịu thì ghi sổ, nhưng nhớ là sổ cô không có trang cuối.' },
  { who: 'nhung', at: [540, 660], text: 'Full Topping hôm nay ra món mới, ai ghé quán nói "Xóm Ơi" được thêm trân châu nha.' },
  { who: 'bong', at: [600, 900], text: 'Ai làm rơi cái móc khóa hình con vịt ở quán trà sữa không ạ? Nó đang ngồi trên quầy nhìn em.' },
  { who: 'cam', at: [380, 560], text: 'Cà phê cóc mở rồi. Bảy ghế, ai tới trước ngồi trước, ai tới sau đứng nghe chuyện.' },
  { who: 'lai', at: [990, 1080], text: 'Sườn tối nay nướng rồi nha, khói bay qua nhà ai thì coi như được mời.' },
  { who: 'banhmi', at: [360, 480], text: 'Xe bánh mì ra đầu hẻm rồi. Giá không đổi, pa tê thì cô xin phép giữ bí mật.' },
  { who: 'khoi', at: [600, 1200], text: 'Tiện lợi đang có mì ly mua 2 tặng... lời chúc ngủ ngon. Mấy bạn ca đêm ghé nha.' },
  { who: 'tan', at: [450, 1100], text: 'Photo Thần Tốc nhận in đề cương, in hợp đồng, in luôn ảnh cưới. Không nhận in tiền.' },
  { who: 'man', at: [600, 1100], text: 'Tiệm tóc vắng, ai muốn đổi kiểu ghé liền. Tin đồn miễn phí, cắt tóc tính tiền.' },
  { who: 'thanh', at: [1110, 1260], text: 'Tối nay tui hát bài mới, cả xóm nghe rồi chấm điểm giùm. Không chấm thì tui hát lại.' },
  { who: 'phan', at: [1270, 1370], text: 'Ông Thanh ơi, bài mới hay lắm, mà nghe ba lần rồi. Bà con xin phép đi ngủ.' },
  { who: 'luong', at: [400, 1300], text: 'Ai cần xe ôm gọi chú. Chú chạy chậm, chắc, kèm tin tức khu phố không tính tiền.' },
  { who: 'vu', at: [500, 1300], text: 'App Xe Tới đang khuyến mãi, mà khuyến mãi cho khách, không cho tài xế nha mọi người.' },
  { who: 'cuong', at: [960, 1050], text: 'Loa 17h: nhắc bà con giữ vỉa hè thông thoáng, xe để gọn. Cảm ơn bà con.' },
  { who: 'kha', at: [700, 1200], text: 'Dãy trọ Bình An vừa sửa xong cái vòi nước tầng 1. Nó vẫn nhỏ giọt, nhưng nhỏ giọt có tâm hơn.' },
  { who: 'tu', at: [800, 1250], text: 'Quán đang tuyển thêm người ca tối, không cần kinh nghiệm, chỉ cần chịu được câu "ít ngọt mà ngọt".' },
  { who: 'phu', at: [380, 600], text: 'Thịt heo sáng nay đẹp, cân đủ, ai nghi thì đem qua cân của cô Sáu đối chứng.' },
  { who: 'nga', at: [500, 900], text: 'Ban công tác Mặt trận khu phố nhắc: ai có quần áo cũ còn dùng được thì gửi văn phòng khu phố nha.' },
  { who: 'lam', at: [480, 960], text: 'Trạm y tế nhắc: uống đủ nước, ngủ đủ giấc, và đừng ăn vụng khô gà trên giàn phơi. Bác biết hết.' },
  { who: 'hao', at: [480, 1300], text: 'Net Không Lag thông báo: 22h đóng cửa đúng luật, ai đang dở trận thì... thua sớm cho kịp.', law: true },
  { who: 'thinh', at: [600, 1300], text: 'Quán nào cần hàng sỉ thì đặt trước 22h, 6h sáng mai Chú Bảy chở tới tận cửa.' },
];
const WEEKDAY_CHAT = {
  1: { who: 'man', at: [700, 900], text: 'Thứ Hai tiệm nghỉ buổi sáng nha, chiều mở. Có chuyện gì để dành chiều kể.' },
  2: { who: 'phan', at: [900, 1000], text: 'Chiều nay thầy Nhân dạy bóng ở sân chơi, phụ huynh nhớ đón con trước 18h.' },
  5: { who: 'manh', at: [960, 1080], text: 'Thứ Sáu rồi, quán Một Hai Ba Dô mở cửa đón dân văn phòng. Uống rồi thì gọi xe ôm nha.' },
  6: { who: 'phan', at: [700, 900], text: 'Cuối tuần hẻm 42 có đám cưới, xe để gọn giùm. Ai được mời nhớ mặc áo đẹp.' },
  0: { who: 'nga', at: [840, 960], text: 'Tối nay Chủ nhật có cơm chung ở văn phòng khu phố, 18h. Ai kẹt thì cứ ghé, không cần báo trước.' },
};
const LOA_WEATHER = { sun: 'trời nắng nhẹ', hot: 'trời nắng nóng, bà con uống đủ nước', rain: 'chiều có mưa, mang áo mưa', heavy: 'mưa lớn, triều cường, hẻm 7 có thể ngập' };

/** → [{ min, from, fromId, text, drama? }] sorted by min. ctx: { day, drama?, weather?, tamTru?, rentTomorrow?, name? } */
export function messagesFor(events = [], ctx = {}, r = rng(ctx.day || 1)) {
  const day = ctx.day || 1;
  const { weekday } = dateOf(day);
  const out = [];
  const weather = ctx.weather || (events.find((e) => e.type === 'weather') || {}).v || 'sun';
  // 1. morning loudspeaker digest
  out.push(msg(int(r, 362, 390), 'cuong', `Loa 6h: chào buổi sáng bà con Khu phố 7. Hôm nay ${LOA_WEATHER[weather] || 'trời đẹp'}.`));
  // 2. event messages
  for (const e of events) {
    switch (e.type) {
      case 'outage_notice': {
        const d = dateOf(e.day);
        out.push(msg(int(r, 480, 640), pick(r, ['vinh', 'oanh']), `Điện lực báo: ${WEEKDAYS[d.weekday]} ${d.short} cúp điện ${hourLabel(e.from)}-${hourLabel(e.to)} để bảo trì. Quán nào có tủ đông nhớ trữ đá từ tối hôm trước.`));
        break;
      }
      case 'outage':
        if (e.sudden) out.push(msg(Math.max(360, Math.min(1370, e.from + 5)), 'phan', 'Cúp điện rồi bà con ơi! Không phải lịch, chắc sự cố do mưa. Ai có đèn sạc thì sạc đầy giùm.'));
        else out.push(msg(Math.max(360, e.from - 30), 'vinh', `Nhắc lại: hôm nay cúp điện ${hourLabel(e.from)}-${hourLabel(e.to)}. Anh đi kiểm tra trụ điện hẻm 42, ai thấy anh thì đừng hỏi "chừng nào có điện".`));
        break;
      case 'price': {
        const who = e.item === 'pork' ? 'phu' : e.item === 'veg' ? 'chin' : e.item === 'coffee' ? 'cam' : e.item === 'creamer' || e.item === 'pearl' ? 'nhung' : e.item === 'fuel' ? 'luong' : 'cosau';
        const name = (ITEMS[e.item] && ITEMS[e.item].name.toLowerCase()) || e.item;
        out.push(msg(int(r, 420, 700), who, e.pct >= 0 ? `Báo bà con: ${name} lên giá rồi (${e.text}). Mua gì thì mua sớm.` : `Tin vui hiếm hoi: ${name} giảm giá. Ai uống cà phê thì mừng, ai bán cà phê thì tính.`));
        break;
      }
      case 'weather':
        if (e.v === 'heavy') out.push(msg(int(r, 900, 1080), 'phan', 'Hẻm 7 ngập tới mắt cá rồi, ai đi làm về thì vòng đường Tâm Mỹ. Đơn giao đồ ăn chắc đông lắm đây.'));
        else if (e.v === 'hot') out.push(msg(int(r, 690, 840), 'lam', 'Trưa nắng gắt, bà con hạn chế ra đường 11h-15h, uống nước thường xuyên.'));
        break;
      case 'payday':
        out.push(msg(int(r, 1020, 1140), 'manh', 'Hôm nay ngày 30, lương về. Quán nhắc nhẹ những ai còn trong sổ nợ của chị Ly.'));
        break;
      case 'remodel':
        out.push(msg(int(r, 600, 900), 'phan', `Nghe nói ${e.placeName || 'một quán trong hẻm'} sắp đổi mô hình. Khu phố không mất quán, chỉ đổi bảng hiệu.`));
        break;
      case 'tax':
        out.push(msg(int(r, 480, 600), 'cuong', `Năm mới, thuế tiêu thụ đặc biệt với bia tăng theo lộ trình. Quán nhậu chắc chỉnh giá. ${LAW_NOTE}`, { law: true }));
        break;
      case 'calendar':
        if (e.id === 'tet') out.push(msg(int(r, 400, 540), 'phan', 'Chúc mừng năm mới cả xóm! An khang, sức khỏe, và năm nay ông Thanh hát nhỏ lại một chút.'));
        else if (e.id === 'nhagiao') out.push(msg(int(r, 420, 600), 'hoai', 'Cảm ơn quý phụ huynh. Trường không nhận hoa quà, ai muốn thì góp học bổng cho tụi nhỏ nha.'));
        else if (e.id === 'daidoanket') out.push(msg(int(r, 420, 600), 'nga', 'Hôm nay Ngày hội Đại đoàn kết khu dân cư. Chiều có văn nghệ ở sân chơi, quán nào góp quà thì báo cô Nga.'));
        else if (e.name) out.push(msg(int(r, 420, 700), 'phan', `Hôm nay ${e.name}. Chúc bà con một ngày vui.`));
        break;
      default: break;
    }
  }
  // 3. landlord / papers
  if (ctx.rentTomorrow) out.push(msg(int(r, 1140, 1260), 'lanh', 'Mai ngày 5 rồi các con. Tiền phòng, điện, nước gom giùm cô. Ai kẹt thì nói cô một tiếng.'));
  if (!ctx.tamTru && day >= 20 && day % 7 === 6) out.push(msg(int(r, 540, 700), 'thuan', `Nhắc bà con thuê trọ: ở từ 30 ngày phải đăng ký tạm trú, làm trên VNeID là xong, không mất tiền. ${LAW_NOTE}`, { law: true }));
  if (ctx.broke && weekday === 6) out.push(msg(int(r, 1080, 1200), 'nga', 'Mai Chủ nhật có cơm chung ở văn phòng khu phố đó con. Cô để phần.'));
  // 4. chatter to reach 3-8 a day
  const wk = WEEKDAY_CHAT[weekday];
  if (wk) out.push(msg(int(r, wk.at[0], wk.at[1]), wk.who, wk.text));
  const want = int(r, 3, 6);
  const pool = shuffle(r, CHATTER);
  for (const c of pool) {
    if (out.length >= want) break;
    out.push(msg(int(r, c.at[0], c.at[1]), c.who, c.text, c.law ? { law: true } : {}));
  }
  for (const m of out) m.min = Math.max(QUIET_TO, Math.min(QUIET_FROM - 1, m.min)); // quiet hours for everyday talk
  const list = out.sort((a, b) => a.min - b.min).slice(0, 8);
  // 5. drama: the only messages allowed in quiet hours (drama 20: nhóm phụ huynh lúc 23 giờ)
  if (ctx.drama) {
    list.push(msg(int(r, 1381, 1430), 'hoai', ctx.dramaText || 'Phụ huynh lớp 9A ơi, 23 giờ rồi, mai mình bàn tiếp chuyện quỹ lớp được không ạ. Cô xin phép đi ngủ.', { drama: true }));
  }
  return list;
}

/** Is a message time inside quiet hours (23:00-06:00)? */
export const inQuietHours = (min) => { const m = ((min % 1440) + 1440) % 1440; return m >= QUIET_FROM || m < QUIET_TO; };
