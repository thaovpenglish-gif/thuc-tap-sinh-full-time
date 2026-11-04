// Named positions in the Solo office (pure data, no Three.js) — shared by the map, the game and the content validator.
// Named spots: [x, z, rotY]  (rotY 0 = facing +z / south, PI = facing north)
// [x, z, rotY]  (rotY 0 = facing +z / south, PI = facing north)
export const SPOTS = {
  // leadership & EA row along the north window
  tuyet: [-11, -8.5, 0],
  thu: [-5.6, -9.1, 0], nhi: [-4.0, -9.1, 0],
  linh: [-2.4, -9.1, 0], an: [-0.8, -9.1, 0], ha: [2.4, -9.1, 0],
  // Hạ's team + interns cluster
  long: [-4.2, -2.6, 0], trang: [-2.2, -2.6, 0], bao: [-2.2, 1.65, Math.PI],
  mai: [5, -3.25, 0],
  han: [2.4, 3.15, 0], khang: [3.6, 2.4, -0.6],
  quynh: [11, -8.5, 0], gam: [-4, 5.3, 0],
  binh: [5.5, 4.3, Math.PI / 2], phuong: [8.5, 8.95, Math.PI],
  dat: [2.6, -6.0, -0.4],
  minh: [0.8, -9.1, 0],
  // free standing spots
  x1: [8.2, 0.5, -Math.PI / 2], x2: [8.2, -1.8, -Math.PI / 2], x3: [2.0, 6.8, Math.PI],
  // scenes
  reception_side: [-1.6, 6.6, -Math.PI / 2],
  pantry_bao: [12.6, 3.4, -Math.PI / 2],
  mr_head: [-14.2, 0.5, Math.PI / 2], mr_n1: [-13, -0.85, 0], mr_n2: [-12, -0.85, 0],
  lunch1: [10.9, -0.15, 0], lunch2: [11.6, -0.15, 0], lunch3: [12.3, -0.15, 0], lunch4: [10.9, 2.55, Math.PI], lunch5: [12.3, 2.55, Math.PI],
  window: [-2.5, -9.1, Math.PI],
  su_dat: [0.5, -5.75, 0],
};
{
  const cx = 0.5, cz = -4.3, rx = 2.6, rz = 1.65;
  const angles = [0.62, 0.78, 0.94, 1.1, 1.26, 0.38, 0.22, 0.06, -0.1, -0.26];
  angles.forEach((a, i) => {
    const x = cx + rx * Math.cos(a * Math.PI), z = cz + rz * Math.sin(a * Math.PI);
    SPOTS['su' + (i + 1)] = [x, z, Math.atan2(cx - x, cz - z)];
  });
}
// Mèo KPI wanders between these points
// Generic slot aliases for non-T&M companies (same positions as the T&M desks).
Object.assign(SPOTS, {
  boss: SPOTS.tuyet, n1: SPOTS.thu, n2: SPOTS.nhi, n3: SPOTS.linh, n4: SPOTS.an, n5: SPOTS.minh, n6: SPOTS.ha,
  c1: SPOTS.long, c2: SPOTS.trang, c3: SPOTS.bao, senior: SPOTS.mai, corner: SPOTS.han, corner2: SPOTS.khang,
  finance: SPOTS.quynh, reception: SPOTS.gam, it: SPOTS.binh, hr: SPOTS.phuong, coach: SPOTS.dat,
  pantry: SPOTS.pantry_bao, meeting_head: SPOTS.mr_head, scrum: SPOTS.su_dat,
});
export const SLOT_HELP = {
  boss: 'phòng sếp (góc tây bắc, có két/bàn lớn)', n1: 'dãy bàn cửa sổ phía bắc #1', n2: '#2', n3: '#3', n4: '#4', n5: '#5', n6: '#6',
  c1: 'cụm bàn giữa, hàng trước trái', c2: 'cụm bàn giữa, hàng trước phải', c3: 'bàn đối diện bàn intern',
  senior: 'bàn riêng giữa phòng phía đông', corner: 'góc bảng trắng (bàn đứng)', corner2: 'cạnh góc bảng trắng',
  finance: 'phòng kế toán (đông bắc)', reception: 'quầy lễ tân', it: 'góc IT cạnh máy in', hr: 'bàn cạnh cửa ra vào',
  coach: 'cạnh bảng scrum', pantry: 'pantry (đông)', meeting_head: 'đầu bàn phòng họp', mr_n1: 'ghế phòng họp 1', mr_n2: 'ghế phòng họp 2',
  x1: 'chỗ trống phía đông', x2: 'chỗ trống phía đông 2', x3: 'gần cửa ra vào', window: 'cạnh cửa sổ bắc',
  'su1…su10': 'vòng stand-up quanh bảng scrum', 'lunch1…lunch5': 'bàn ăn pantry',
};
export const PROP_SLOTS = { p1: [-12.5, 8.8], p2: [-10.0, 8.8], p3: [9.8, 7.2], p4: [12.5, 7.2], p5: [13.4, -5.4], p6: [-13.4, -5.2] };

export const CAT_PATH = [[-3.2, 3.2], [1.5, 3.0], [6.0, 1.5], [11.0, 3.6], [6.0, -1.0], [0.5, -2.8], [-5.5, -4.6], [-5.8, 2.6]];
export const PLAYER_START = [0, 8.6, 0]; // x, z, yaw (yaw 0 looks north)
export const MEETING_SEAT = [-11, 2.1];
export const PLAYER_DESK = [-4.2, 1.6];

// Interactable objects in the office (ids usable as step `who: 'obj:<id>'` and in side-task legs).
export const INTERACTABLE_IDS = ['desk', 'printer', 'okr', 'coffee', 'redchair', 'plant', 'safe', 'interview', 'altar'];
