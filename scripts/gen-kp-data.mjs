// Generates site/js/khupho/data/{people,places}.js from docs/khupho/people.json (+ the hours/descriptions table below,
// from DESIGN.md section 2.3). Run: node scripts/gen-kp-data.mjs   (commit the generated JS; the game never fetches JSON)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = JSON.parse(readFileSync(join(root, 'docs/khupho/people.json'), 'utf8'));
const h = (s) => { const [a, b = '0'] = String(s).split(':'); return Number(a) * 60 + Number(b); };
const R = (...pairs) => pairs.map(([a, b]) => [h(a), h(b)]);
const ALL = R(['0', '24']);
const WEEK = (r) => ({ 1: r, 2: r, 3: r, 4: r, 5: r });

// id → { short, hours: { all, <weekday 0..6>: ranges (override) }, desc, enterable, work, hoursText }
// Ranges are [fromMin, toMin) and may run past 24:00 (e.g. cơm tấm 17h-1h = [1020, 1500]).
const EXTRA = {
  phongtro: { short: 'Dãy trọ Bình An', hours: { all: ALL }, hoursText: 'Cổng khóa 23h, bạn có chìa riêng', enterable: true,
    desc: 'Phòng 5, 16 m², quạt trần kêu như đang suy nghĩ. Cô Ba Lành thu tiền ngày 5, tiền điện thu theo "giá tình cảm".' },
  hem: { short: 'Hẻm 42 và hẻm 7', hours: { all: ALL }, hoursText: 'Luôn mở',
    desc: 'Nhà dân sát vách, karaoke nhà ông Thanh bảy tối một tuần, bà Phấn quản trị nhóm Xóm Ơi bằng cả trái tim.' },
  chungcu: { short: 'Chung cư cũ Lô C', hours: { all: ALL }, hoursText: 'Luôn mở (HR tầng 4: 8h30-18h)',
    desc: 'Không thang máy. Ứng viên lên tới tầng 4 là đã qua vòng thể lực.' },
  dienluc: { short: 'Điện lực', hours: { all: R(['7:30', '16:30']), 0: [] }, hoursText: '7h30-16h30, nghỉ Chủ nhật',
    desc: 'Phòng giao dịch khu vực. Chị Oanh in hóa đơn, anh Vĩnh ghi chỉ số và biết trước lịch cúp điện.' },
  congan: { short: 'Công an phường', hours: { all: ALL }, hoursText: 'Trực 24h; tuần tra 21h45-22h15',
    desc: 'Anh Thuận, cảnh sát khu vực, nhắc tạm trú bằng giọng của người đã nhắc câu đó cả nghìn lần.' },
  khupho: { short: 'Văn phòng Khu phố 7', hours: { all: R(['7', '11']), 0: R(['7', '11'], ['17', '20']) }, hoursText: '7h-11h; loa đọc 6h và 17h; Chủ nhật tối có cơm chung',
    desc: 'Chú Cường giữ loa, cô Nga giữ sổ vận động. Tối Chủ nhật ai khó khăn thì ghé ăn cơm chung, không ai hỏi vì sao.' },
  truong_th: { short: 'Trường Tiểu học', hours: { all: [], ...WEEK(R(['6:30', '17'])) }, hoursText: 'Cổng mở 6h30, tan 16h-17h (Thứ Hai-Thứ Sáu)',
    desc: 'Cô Xuân hiệu trưởng, chú Tình bảo vệ. Giờ tan trường là một sự kiện giao thông cấp phường.' },
  truong_thcs: { short: 'Trường THCS', hours: { all: [], ...WEEK(R(['6:30', '17:15'])) }, hoursText: 'Cổng mở 6h30, tan lệch tiểu học 15 phút',
    desc: 'Chung cổng với trường tiểu học. Lớp 9A đang ôn thi vào 10, nhóm phụ huynh hoạt động tới 23 giờ.' },
  tramyte: { short: 'Trạm y tế phường', hours: { all: R(['7', '17']) }, emergency: true, hoursText: '7h-17h, trực cấp cứu đêm',
    desc: 'Bác sĩ Lâm khám BHYT 36.500đ một lượt và cằn nhằn miễn phí. Có nhà thuốc của chị Ánh.' },
  congvien: { short: 'Sân chơi', hours: { all: R(['5', '21']) }, hoursText: '5h-21h',
    desc: 'Sân bóng mini, ghế đá, tụi nhỏ tập thể dục lúc 17h. Ngồi nghỉ ở đây hồi chút năng lượng.' },
  cho: { short: 'Chợ Tâm Mỹ', hours: { all: R(['4:30', '12'], ['15', '18']) }, hoursText: '4h30-12h, chiều 15h-18h', enterable: true,
    desc: 'Rau Dì Chín, cá Cô Mười, thịt Anh Phú, trái cây Chị Huyền, tạp hóa Cô Sáu. Trả giá là môn thể thao chính.' },
  daumoi: { short: 'Đầu mối Thuận Phát', hours: { all: R(['0', '11']) }, hoursText: 'Nhận hàng 0h-5h, bán sỉ 5h-11h', enterable: true,
    desc: 'Anh Thịnh lên chợ đầu mối lúc nửa đêm. Đặt trước 22h là 6h sáng mai ba gác Chú Bảy chở tới.' },
  trasua: { short: 'Trà Sữa Full Topping', hours: { all: R(['9', '22']) }, hoursText: '9h-22h', enterable: true, work: true,
    desc: 'Quán của chị Nhung. Tú thuộc 41 công thức, Bông dập nắp nhanh nhất phường. Đang tuyển người, không cần kinh nghiệm.' },
  caphe: { short: 'Cà Phê Cóc Bảy Ghế', hours: { all: R(['5:30', '11'], ['15', '19']) }, hoursText: '5h30-11h, chiều 15h-19h',
    desc: 'Bà Cẩm, bảy cái ghế nhựa và một tầm nhìn thẳng sang quán trà sữa của con dâu.' },
  comtam: { short: 'Cơm Tấm Cô Lài', hours: { all: R(['6', '10'], ['17', '25']) }, hoursText: '6h-10h, 17h-1h',
    desc: 'Sườn nướng than của Thông, mùi khói bay tới tầng 12 cao ốc. Giá theo giá heo, chậm vài ngày.' },
  banhmi: { short: 'Xe bánh mì hẻm 42', hours: { all: R(['5:30', '9:30'], ['16', '19']) }, hoursText: '5h30-9h30, 16h-19h',
    desc: 'Cô Bánh Mì không tăng giá, cô chỉ bớt pa tê. Cho ghi sổ khi bạn kẹt tiền.' },
  tienloi: { short: 'Tiện lợi Luôn Mở', hours: { all: ALL }, hoursText: '24/24', enterable: true,
    desc: 'Anh Khôi ca ngày, Như ca đêm. Mì ly, nước suối, máy lạnh miễn phí cho ai đứng đọc nhãn đủ lâu.' },
  photo: { short: 'Photo Thần Tốc', hours: { all: R(['7', '21']) }, hoursText: '7h-21h', enterable: true,
    desc: 'Chú Tấn in tờ rơi, đề cương, hợp đồng thuê trọ. Máy photocopy biết nhiều bí mật hơn cả tiệm tóc.' },
  net: { short: 'Net Không Lag', hours: { all: R(['8', '22']) }, hoursText: '8h-22h (luật: không hoạt động 22h-8h)',
    lawNote: 'Điểm cung cấp dịch vụ trò chơi điện tử công cộng không hoạt động từ 22h đến 8h sáng hôm sau.',
    desc: 'Anh Hào và Pháo. Tên quán là một lời hứa chưa từng được giữ.' },
  cattoc: { short: 'Tiệm tóc Đẹp Mỗi Ngày', hours: { all: R(['8', '20']), 1: R(['12', '20']) }, hoursText: '8h-20h, nghỉ sáng Thứ Hai',
    desc: 'Chị Mận cắt, chú Ninh hớt, khách ngồi chờ thì cập nhật tin khu phố. Trung tâm tin đồn số hai sau chợ.' },
  quannhau: { short: 'Quán nhậu Một Hai Ba Dô', hours: { all: R(['16', '24']) }, hoursText: '16h-24h',
    desc: 'Anh Mạnh, chị Ly giữ sổ nợ, Tèo chạy bàn. Quán luôn gợi ý gọi xe ôm cho khách đã "dô".' },
  noithat: { short: 'Nội Thất Nhà Mình', hours: { all: R(['8', '21']) }, hoursText: '8h-21h', enterable: true,
    desc: 'Anh Tín bán thảm, đèn dây, cây giả, kệ sách và nệm. Đồ to thì Chú Bảy chở về bằng ba gác, 30.000đ một chuyến.' },
  xeom: { short: 'Bến xe ôm hẻm 42', hours: { all: R(['5', '23']) }, hoursText: '5h-23h',
    desc: 'Chú Lương xe ôm truyền thống, ông Quế xe đạp ôm cuối cùng của khu phố, anh Vũ chạy app Xe Tới.' },
  bagac: { short: 'Ba gác Chú Bảy', hours: { all: R(['5', '18']) }, hoursText: '5h-18h, đậu trước Ba & Má',
    desc: 'Chở khô gà, bàn ghế sự kiện, đồ dọn trọ, và đôi khi chở cả người nếu thân Chú Bảy.' },
  toanha: { short: 'Cao ốc Tâm Mỹ', hours: { all: R(['6:30', '22']) }, hoursText: '6h30-22h, thang máy kẹt lúc 8h và 12h',
    desc: 'Anh Định trực sảnh. Ba công ty văn phòng kính ở chung, thang máy là nơi xảy ra nhiều cuộc họp nhất.' },
  tm: { short: 'T&M Partners', hours: { all: [], ...WEEK(R(['8:30', '18'])) }, hoursText: '8h30-18h (thực tế: tới khi chị Tuyết về)',
    desc: 'Tầng 12, cao nhất tòa nhà, đúng tính cách. Chế độ Solo kể chuyện ở đây.' },
  tech: { short: 'Nợ Kỹ Thuật Labs', hours: { all: [], ...WEEK(R(['9:30', '22'])) }, hoursText: '9h30 tới khi "deploy xong"',
    desc: 'Tầng 7. Anh Quân "Kevin" và một backlog dài hơn hẻm 42.' },
  audit: { short: 'Cân Đối & Cộng Sự', hours: { all: [], ...WEEK(R(['8', '17:30'])) }, hoursText: '8h-17h30, mùa kiểm toán tới 3h sáng',
    desc: 'Tầng 3 đến 5. Công ty lớn nhất tòa nhà, mỗi tờ giấy đều có chữ ký nháy.' },
  bama: { short: 'Ba & Má', hours: { all: R(['8', '21']) }, hoursText: 'Cửa hàng 8h-21h, xưởng 6h-17h', enterable: true,
    desc: 'Khô gà, khô bò, xoài sấy. Giàn phơi sân sau nhìn ra cổng trường, có bảng "đừng ăn vụng" mà không ai đọc.' },
  event: { short: 'Đi Đâu Cũng Được', hours: { all: [], ...WEEK(R(['8:30', '18'])) }, hoursText: '8h30-18h, kho mở khi có sự kiện',
    desc: 'Văn phòng nhỏ và cái kho chứa đủ bàn ghế cho ba đám cưới cùng lúc.' },
  hr: { short: 'Người Đúng Chỗ HR', hours: { all: [], ...WEEK(R(['8:30', '18'])) }, hoursText: '8h30-18h',
    desc: 'Căn hộ tầng 4 Lô C. Đọc hồ sơ của bạn kỹ hơn bạn đọc nó.' },
  agency: { short: 'Trend Trễ Agency', hours: { all: R(['10', '20']) }, hoursText: '10h tới "khi khách duyệt"',
    desc: 'Loft sân thượng, đèn dây, bàn gỗ pallet. Trend tới đây thường đã hết trend.' },
  ngoai: { short: 'Ngoài khu phố', hours: { all: [] }, offmap: true, hoursText: 'Không đi tới trong giai đoạn này',
    desc: 'Bình Dương cũ, Sa Đéc, chợ đầu mối Bình Điền: chỉ gọi điện hoặc nghe kể.' },
};
const KIND_LABEL = { housing: 'Nhà trọ', home: 'Nhà ở', civic: 'Cơ quan', school: 'Trường học', health: 'Y tế', park: 'Công viên',
  market: 'Chợ', wholesale: 'Bán sỉ', shop: 'Cửa hàng', transport: 'Giao thông', vehicle: 'Phương tiện', building: 'Tòa nhà',
  office: 'Công ty', factory: 'Công ty', warehouse: 'Công ty', offmap: 'Ngoài bản đồ' };

const places = src.places.map((p) => {
  const x = EXTRA[p.id];
  if (!x) throw new Error('no extra data for place ' + p.id);
  const people = src.people.filter((q) => q.place === p.id).map((q) => q.id);
  return { id: p.id, name: p.name, short: x.short, kind: p.kind, kindLabel: KIND_LABEL[p.kind] || p.kind,
    hours: x.hours, hoursText: x.hoursText, desc: x.desc, enterable: !!x.enterable, work: !!x.work,
    ...(x.emergency ? { emergency: true } : {}), ...(x.offmap ? { offmap: true } : {}), ...(x.lawNote ? { lawNote: x.lawNote } : {}), people };
});
for (const id of Object.keys(EXTRA)) if (!places.find((p) => p.id === id)) throw new Error('extra place not in people.json: ' + id);

const banner = '// GENERATED by scripts/gen-kp-data.mjs from docs/khupho/people.json. Edit the source, then re-run the script.\n';
const placesJs = banner + `// Places of Khu phố T&M: names/kinds from people.json, hours/descriptions from DESIGN.md 2.3.
// hours: { all: [[fromMin, toMin], ...], <weekday 0..6>: override } ; ranges may run past 1440 (after midnight).
// enterable: has an interior in phase 1; work: has a playable job in phase 1.
export const PLACES = ${JSON.stringify(places, null, 1)};
export const PLACE = Object.fromEntries(PLACES.map((p) => [p.id, p]));
export const placeById = (id) => PLACE[id] || null;
export const ENTERABLE = PLACES.filter((p) => p.enterable).map((p) => p.id);
export const WORKPLACES = PLACES.filter((p) => p.work).map((p) => p.id);
export const LAW_NOTE = '(thông tin giải trí, không phải tư vấn pháp lý)';

/** Ranges for one weekday (0 = CN), falling back to hours.all. */
export function rangesOn(place, weekday) {
  if (!place) return [];
  const o = place.hours[weekday];
  return Array.isArray(o) ? o : place.hours.all || [];
}
/** Is a place open at (weekday, min)? Also honours yesterday's ranges that run past midnight. */
export function openAt(placeOrId, weekday, min) {
  const p = typeof placeOrId === 'string' ? PLACE[placeOrId] : placeOrId;
  if (!p) return false;
  const m = ((min % 1440) + 1440) % 1440;
  if (rangesOn(p, weekday).some(([a, b]) => m >= a && m < b)) return true;
  return rangesOn(p, (weekday + 6) % 7).some(([a, b]) => b > 1440 && m + 1440 >= a && m + 1440 < b);
}
`;
const peopleJs = banner + `// 157 people (59 residents incl. 11 kids + 98 from the 7 companies) and 230 relations. Data only.
export const PEOPLE = ${JSON.stringify(src.people, null, 0).replace(/\},\{/g, '},\n{')};
export const RELATIONS = ${JSON.stringify(src.relations, null, 0).replace(/\},\{/g, '},\n{')};
export const PERSON = Object.fromEntries(PEOPLE.map((p) => [p.id, p]));
export const personById = (id) => PERSON[id] || null;
export const peopleAt = (placeId) => PEOPLE.filter((p) => p.place === placeId);
export const relationsOf = (id, { secret = true } = {}) => RELATIONS.filter((r) => (r.a === id || r.b === id) && (secret || !r.secret));
`;
writeFileSync(join(root, 'site/js/khupho/data/places.js'), placesJs);
writeFileSync(join(root, 'site/js/khupho/data/people.js'), peopleJs);
console.log(`places: ${places.length}, people: ${src.people.length}, relations: ${src.relations.length}`);
