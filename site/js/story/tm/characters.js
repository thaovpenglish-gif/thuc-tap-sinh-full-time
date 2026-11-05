// T&M Partners cast — Character Bible v3.0 (+ Đạt, Agile Coach, approved).
// Do not change titles, reporting lines, genders or core traits here without the Game Owner's approval.
// Family relationships between characters are PROPOSALS pending approval and are intentionally NOT encoded.

export const COMPANY = { id: 'tm', name: 'T&M Partners', tagline: 'We deliver excellence. Eventually.' };

// `look` feeds art/people.js makePerson; `body:false` = not physically in the office (Teams only).
export const CAST = {
  tuyet: { name: 'Chị Tuyết', role: 'Chủ tịch · Chairperson', emoji: '👩‍💼', color: '#f4a3b5', dept: 'chair',
    look: { shirt: '#f4a3b5', pants: '#5b4a6b', hair: 'bun', hairColor: '#1d1d1f', glasses: true } },
  linh: { name: 'Chị Linh', role: 'Giám đốc Chiến lược', emoji: '📊', color: '#9fb4ff', dept: 'strategy',
    look: { shirt: '#9fb4ff', pants: '#3f4a6b', hair: 'short', hairColor: '#1d1d1f', mug: true } },
  ha: { name: 'Chị Hạ', role: 'Giám đốc Nghiên cứu & Tư vấn', emoji: '📚', color: '#c7e8b5', dept: 'research',
    look: { shirt: '#c7e8b5', pants: '#5f7a5a', hair: 'long', hairColor: '#3b2418', glasses: true } },
  han: { name: 'Chị Hân', role: 'Giám đốc Chuyển đổi Doanh nghiệp', emoji: '✨', color: '#ffb3e6', dept: 'transform',
    look: { shirt: '#ffb3e6', pants: '#7d5a8a', hair: 'wavy', hairColor: '#7a3b1e', phone: true } },
  thu: { name: 'Thư', role: 'Trợ lý Chủ tịch', emoji: '🗂️', color: '#bfe3ff', dept: 'chair',
    look: { shirt: '#bfe3ff', pants: '#5b6b9a', hair: 'pony', hairColor: '#1d1d1f' } },
  nhi: { name: 'Nhi', role: 'Trợ lý Chủ tịch', emoji: '⚡', color: '#ffe08a', dept: 'chair',
    look: { shirt: '#ffe08a', pants: '#6b7a99', hair: 'long', hairColor: '#2b1b14', clip: true, phone: true } },
  mai: { name: 'Mai', role: 'Senior Communications & Business Consultant', emoji: '🌟', color: '#c9b6ff', dept: 'business',
    look: { shirt: '#c9b6ff', pants: '#3f3f55', hair: 'short', hairColor: '#1d1d1f', clip: true, phone: true } },
  long: { name: 'Long', role: 'Business Analyst · team chị Hạ', emoji: '🧮', color: '#a8dcc0', dept: 'research',
    look: { shirt: '#a8dcc0', pants: '#4a5a52', hair: 'short', hairColor: '#1d1d1f', glasses: true } },
  trang: { name: 'Trang', role: 'Junior Consultant · team chị Hạ', emoji: '🌸', color: '#ffc6e0', dept: 'research',
    look: { shirt: '#ffc6e0', pants: '#7d86b3', hair: 'long', hairColor: '#3b2418', clip: true } },
  an: { name: 'An', role: 'Strategy Associate · team chị Linh', emoji: '🏃', color: '#b9cfe6', dept: 'strategy',
    look: { shirt: '#b9cfe6', pants: '#4b5566', hair: 'quiff', hairColor: '#1d1d1f', mug: true } },
  bao: { name: 'Bảo', role: 'Senior Intern · 3 năm', emoji: '🧭', color: '#ffd3b8', dept: 'interns',
    look: { shirt: '#ffd3b8', pants: '#5b6b9a', hair: 'cap', hairColor: '#7fb3ff' } },
  khang: { name: 'Khang', role: 'Business Transformation Consultant · team chị Hân', emoji: '🌍', color: '#9ee8c8', dept: 'transform',
    look: { shirt: '#9ee8c8', pants: '#f2e6cf', hair: 'quiff', hairColor: '#4a3226', pods: true } },
  quynh: { name: 'Chị Quỳnh', role: 'Kế toán · Finance Controller', emoji: '🧾', color: '#e3d9ff', dept: 'finance',
    look: { shirt: '#e3d9ff', pants: '#5a4a6b', hair: 'bun', hairColor: '#2a2a2a', glasses: true } },
  gam: { name: 'Chị Gấm', role: 'Lễ tân kiêm Hành chính', emoji: '🌼', color: '#ffe9a0', dept: 'admin',
    look: { shirt: '#ffe9a0', pants: '#8a6a5a', hair: 'wavy', hairColor: '#4a3226' } },
  binh: { name: 'Bình', role: 'IT Support', emoji: '🔌', color: '#aeb7c9', dept: 'it',
    look: { shirt: '#aeb7c9', pants: '#3a3a4a', hair: 'curly', hairColor: '#1d1d1f' } },
  phuong: { name: 'Chị Phương', role: 'HR & Culture', emoji: '🎈', color: '#ff9f7a', dept: 'hr',
    look: { shirt: '#ff9f7a', pants: '#6b4a5a', hair: 'pony', hairColor: '#3b2418' } },
  minh: { name: 'Minh', role: 'Part-time Analyst · team chị Linh', emoji: '⏳', color: '#d9d9d9', dept: 'strategy', body: false },
  baongoc: { name: 'Bảo Ngọc', role: 'Freelance Researcher · team chị Linh', emoji: '🔎', color: '#d9d9d9', dept: 'strategy', body: false },
  kpi: { name: 'Mèo KPI', role: 'Employee of the Month', emoji: '🐱', color: '#d9d9d9', dept: 'mascot', body: false },
  dat: { name: 'Anh Đạt', role: 'Agile Coach (chị Hân mời về)', emoji: '📌', color: '#ffe08a', dept: 'transform',
    look: { shirt: '#ffe08a', pants: '#6b7a99', hair: 'beanie', hairColor: '#ff9f7a', notes: true } },
};

// Short random lines when you talk to someone outside the current story beat.
export const IDLE = {
  tuyet: ['Chị chỉ có một vài ý nhỏ thôi.', 'Đây là phân tích. Còn business implication đâu em?', 'Em đang làm gì? Ưu tiên của em hôm nay là gì?'],
  linh: ['Team chị có một bạn full-time thôi em ạ.', 'Chị không phản đối chiến lược. Chị phản đối việc triển khai chiến lược bằng một nhân viên rưỡi.', 'Có ai thấy Minh online không?'],
  ha: ['Hôm nay em ăn sáng chưa? Chị vừa đọc một paper rất hay về văn hóa ăn sáng ở doanh nghiệp…', 'Theo literature review thì cách tiếp cận này hoàn toàn có cơ sở.', 'Chị nghĩ mình cần nghiên cứu sâu hơn một chút.'],
  han: ['Em ơi mình cần re-branding lại cái mindset nha.', 'Chị vừa đi networking về, toàn people rất là insightfull.', 'Big pitcher là quan trọng nhất em ạ.'],
  thu: ['Cái này không phải việc của mình, nhưng mà… để mình hỏi nhé.', 'Chờ mình kiểm tra lại với các bên đã nha.', 'Mình có file "Ai làm gì". Đừng nói với ai.'],
  nhi: ['Ủa, sao cái này cũng đến tay mình vậy?', 'Để mình hỏi, nhưng mình không chắc phòng nào đang phụ trách nữa.', 'Số điện thoại khách nào mình cũng nhớ. Hỏi đi.'],
  mai: ['Em xử lý được, nhưng phải chốt brief trước đã.', 'Đừng sửa deck nữa, khách đã approve rồi.', 'Có gì gấp cứ ping chị. Chị trẻ nhất mà, chạy nhanh lắm.'],
  long: ['Để tao dịch cái brief này sang tiếng người.', 'Chị Hạ gửi thêm 40 trang literature review rồi.', 'Tao đang viết "từ điển Hân – Việt". Bản beta.'],
  trang: ['Không sao đâu, để mình làm cho.', 'Mình nghĩ chắc vẫn kịp deadline…', 'Bạn ăn bánh không? Mình mua dư.'],
  an: ['Team anh có một người full-time. Là anh.', 'Bạn part-time hôm nay lại không online. Anh quen rồi.', 'Anh đang làm ba việc. Bốn, nếu tính cái stand-up.'],
  bao: ['Hồi tao mới vào đây ba năm trước…', 'Đừng hỏi tại sao. Quy trình ở đây nó thế.', 'Mật khẩu máy in là 1234. Đừng nói ai tao chỉ.'],
  khang: ['Actually, when I was overseas…', 'Cái này là vấn đề mindset.', 'Ở bên nước ngoài người ta không làm như thế.'],
  quynh: ['Để chị kiểm tra lại file đã nhé.', 'Khách đã chuyển tiền chưa thì phải xem sao kê.', 'Cái này chưa có xác nhận thanh toán em ạ.'],
  gam: ['Ơ… để chị xem một tí đã nhé.', 'Em cần phòng họp hôm nay hả? Chị tưởng tuần sau.', 'À… khách đến rồi à em?'],
  binh: ['Em restart máy thử chưa?', 'Tắt đi bật lại. Chín mươi phần trăm là được.', 'Wifi không chậm. Là em đứng xa cục phát.'],
  phuong: ['Chị nghĩ chúng ta cần một buổi bonding để kết nối cả nhà.', 'Thứ Bảy này team mình làm một buổi team building nhé.', 'Em thấy văn hóa công ty mình thế nào? Chị đang làm khảo sát.'],
  dat: ['Cái này mình estimate mấy point?', 'Đây là blocker hay impediment em?', 'Mình time-box 15 phút thôi nha.'],
};
