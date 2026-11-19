/**
 * Thuật toán Âm Lịch Việt Nam (GMT+7) theo Hồ Ngọc Đức (1900 - 2100)
 * Bao gồm: Chuyển đổi Dương <-> Âm lịch, Can Chi (Năm/Tháng/Ngày/Giờ),
 * 24 Tiết khí, Ngày Hoàng Đạo / Hắc Đạo, 12 Giờ Hoàng Đạo / Hắc Đạo,
 * 12 Trực, Ngũ Hành Nạp Âm, Hướng xuất hành, Hợp/Xung tuổi, Ca dao Việt Nam.
 */

const PI = Math.PI;
const TIMEZONE = 7; // Việt Nam GMT+7

export const CAN = [
  "Giáp", "Ất", "Bính", "Đinh", "Mậu",
  "Kỷ", "Canh", "Tân", "Nhâm", "Quý"
];

export const CHI = [
  "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ",
  "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"
];

export const CON_GIAP = [
  "Chuột", "Trâu", "Hổ", "Mão", "Rồng", "Rắn",
  "Ngựa", "Dê", "Khỉ", "Gà", "Chó", "Lợn"
];

export const TUAN_THU = [
  "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư",
  "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
];

export const GIO_CANH = [
  { name: "Tý", range: "23h - 1h", startHour: 23, endHour: 1 },
  { name: "Sửu", range: "1h - 3h", startHour: 1, endHour: 3 },
  { name: "Dần", range: "3h - 5h", startHour: 3, endHour: 5 },
  { name: "Mão", range: "5h - 7h", startHour: 5, endHour: 7 },
  { name: "Thìn", range: "7h - 9h", startHour: 7, endHour: 9 },
  { name: "Tỵ", range: "9h - 11h", startHour: 9, endHour: 11 },
  { name: "Ngọ", range: "11h - 13h", startHour: 11, endHour: 13 },
  { name: "Mùi", range: "13h - 15h", startHour: 13, endHour: 15 },
  { name: "Thân", range: "15h - 17h", startHour: 15, endHour: 17 },
  { name: "Dậu", range: "17h - 19h", startHour: 17, endHour: 19 },
  { name: "Tuất", range: "19h - 21h", startHour: 19, endHour: 21 },
  { name: "Hợi", range: "21h - 23h", startHour: 21, endHour: 23 }
];

// 12 Thần Sát (vòng Hoàng Đạo / Hắc Đạo)
export const THAN_SAT_12 = [
  { name: "Thanh Long", good: true, desc: "Mọi việc hanh thông, cát tường" },
  { name: "Minh Đường", good: true, desc: "Quý nhân phù trợ, cầu tài gặp may" },
  { name: "Thiên Hình", good: false, desc: "Dễ gặp kiện tụng, tranh chấp" },
  { name: "Chu Tước", good: false, desc: "Kỵ tranh cãi, thị phi, văn tự" },
  { name: "Kim Quỹ", good: true, desc: "Tốt cho cưới hỏi, giao dịch tài chính" },
  { name: "Thiên Đức", good: true, desc: "Sao tốt giải hung, bình an thuận lợi" },
  { name: "Bạch Hổ", good: false, desc: "Hung tinh, kỵ động thổ, đi xa" },
  { name: "Ngọc Đường", good: true, desc: "Tốt cho khai trương, ký kết, cầu phúc" },
  { name: "Thiên Lao", good: false, desc: "Trở ngại, bất lợi cho khởi sự lớn" },
  { name: "Nguyên Vũ", good: false, desc: "Đề phòng tiểu nhân, hao tài" },
  { name: "Tư Mệnh", good: true, desc: "Rất tốt cho tế tự, cầu an, lập kế hoạch" },
  { name: "Câu Trận", good: false, desc: "Dễ trì trệ, bất lợi cho kiện cáo, xuất hành" }
];

// 24 Tiết khí theo kinh độ Mặt Trời (mỗi 15 độ, 0° = Xuân phân)
export const TIET_KHI = [
  "Xuân phân", "Thanh minh", "Cốc vũ", "Lập hạ", "Tiểu mãn", "Mang chủng",
  "Hạ chí", "Tiểu thử", "Đại thử", "Lập thu", "Xử thử", "Bạch lộ",
  "Thu phân", "Hàn lộ", "Sương giáng", "Lập đông", "Tiểu tuyết", "Đại tuyết",
  "Đông chí", "Tiểu hàn", "Đại hàn", "Lập xuân", "Vũ thủy", "Kinh trập"
];

export const TRUC_12 = [
  { name: "Kiến", type: "trung", good: ["Xuất hành", "Nhậm chức", "Cầu phúc"], bad: ["Động thổ", "Chôn cất"] },
  { name: "Trừ", type: "tot", good: ["Cầu y chữa bệnh", "Dọn dẹp", "Giải hạn", "Cắt tóc"], bad: ["Ký kết lớn", "Cưới hỏi"] },
  { name: "Mãn", type: "tot", good: ["Khai trương", "Giao dịch", "Cưới hỏi", "Cầu tài"], bad: ["Kiện tụng", "Nhậm chức"] },
  { name: "Bình", type: "tot", good: ["Sửa chữa", "Trồng trọt", "Gặp gỡ bạn bè"], bad: ["Khai trương lớn", "Động thổ"] },
  { name: "Định", type: "tot", good: ["Cưới hỏi", "Ký kết hợp đồng", "Nhập học", "Mua sắm"], bad: ["Kiện tụng", "Xuất hành xa"] },
  { name: "Chấp", type: "trung", good: ["Khởi công nhỏ", "Tu sửa", "Lập ước"], bad: ["Mở kho", "Xuất tiền lớn"] },
  { name: "Phá", type: "xau", good: ["Phá dỡ công trình cũ", "Chữa bệnh"], bad: ["Cưới hỏi", "Khai trương", "Ký kết", "Động thổ"] },
  { name: "Nguy", type: "xau", good: ["Cầu phúc", "Tế tự", "An thần"], bad: ["Đi thuyền", "Leo cao", "Xuất hành xa"] },
  { name: "Thành", type: "tot", good: ["Khai trương", "Cưới hỏi", "Nhập trạch", "Ký kết"], bad: ["Kiện tụng", "Tranh chấp"] },
  { name: "Thu", type: "trung", good: ["Thu hoạch", "Thu nợ", "Cất giữ tài sản"], bad: ["Động thổ", "Châm cứu"] },
  { name: "Khai", type: "tot", good: ["Khai trương", "Xuất hành", "Cầu tài", "Động thổ"], bad: ["An táng"] },
  { name: "Bế", type: "xau", good: ["Đắp đê", "Lấp hố", "Tu dưỡng"], bad: ["Khai trương", "Cưới hỏi", "Xuất hành", "Kiện tụng"] }
];

const NAP_AM_30 = [
  "Hải Trung Kim", "Lư Trung Hỏa", "Đại Lâm Mộc", "Lộ Bàng Thổ", "Kiếm Phong Kim",
  "Sơn Đầu Hỏa", "Giản Hạ Thủy", "Thành Đầu Thổ", "Bạch Lạp Kim", "Dương Liễu Mộc",
  "Tuyền Trung Thủy", "Ốc Thượng Thổ", "Tích Lịch Hỏa", "Tùng Bách Mộc", "Trường Lưu Thủy",
  "Sa Trung Kim", "Sơn Hạ Hỏa", "Bình Địa Mộc", "Bích Thượng Thổ", "Kim Bạch Kim",
  "Phú Đăng Hỏa", "Thiên Hà Thủy", "Đại Trạch Thổ", "Thoa Xuyến Kim", "Tang Đố Mộc",
  "Đại Khê Thủy", "Sa Trung Thổ", "Thiên Thượng Hỏa", "Thạch Lựu Mộc", "Đại Hải Thủy"
];

// Hướng xuất hành theo Thiên Can của ngày
const HUONG_XUAT_HANH = [
  { hyThan: "Đông Bắc", taiThan: "Đông Nam" }, // Giáp
  { hyThan: "Tây Bắc", taiThan: "Đông Nam" },  // Ất
  { hyThan: "Tây Nam", taiThan: "Chính Đông" }, // Bính
  { hyThan: "Chính Nam", taiThan: "Chính Đông" }, // Đinh
  { hyThan: "Đông Nam", taiThan: "Chính Bắc" }, // Mậu
  { hyThan: "Đông Bắc", taiThan: "Chính Nam" }, // Kỷ
  { hyThan: "Tây Bắc", taiThan: "Tây Nam" },   // Canh
  { hyThan: "Tây Nam", taiThan: "Tây Nam" },   // Tân
  { hyThan: "Chính Nam", taiThan: "Chính Tây" }, // Nhâm
  { hyThan: "Đông Nam", taiThan: "Tây Bắc" }   // Quý
];

// Tam hợp & Lục hợp & Lục xung theo Địa Chi (index 0..11)
const TAM_HOP = [
  [0, 4, 8],   // Thân Tý Thìn
  [1, 5, 9],   // Tỵ Dậu Sửu
  [2, 6, 10],  // Dần Ngọ Tuất
  [3, 7, 11]   // Hợi Mão Mùi
];
const LUC_HOP = [1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi
const LUC_XUNG = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5]; // Tý-Ngọ, Sửu-Mùi, Dần-Thân, Mão-Dậu, Thìn-Tuất, Tỵ-Hợi
const TU_HANH_XUNG = [
  [0, 3, 6, 9],   // Tý Ngọ Mão Dậu
  [1, 4, 7, 10],  // Thìn Tuất Sửu Mùi
  [2, 5, 8, 11]   // Dần Thân Tỵ Hợi
];

export const CA_DAO_VIET_NAM = [
  { text: "Một cây làm chẳng nên non,\nBa cây chụm lại nên hòn núi cao.", author: "Ca dao Việt Nam" },
  { text: "Công cha như núi Thái Sơn,\nNghĩa mẹ như nước trong nguồn chảy ra.", author: "Ca dao Việt Nam" },
  { text: "Bầu ơi thương lấy bí cùng,\nTuy rằng khác giống nhưng chung một giàn.", author: "Ca dao Việt Nam" },
  { text: "Có công mài sắt, có ngày nên kim.", author: "Tục ngữ Việt Nam" },
  { text: "Uống nước nhớ nguồn, ăn quả nhớ kẻ trồng cây.", author: "Tục ngữ Việt Nam" },
  { text: "Lời nói chẳng mất tiền mua,\nLựa lời mà nói cho vừa lòng nhau.", author: "Ca dao Việt Nam" },
  { text: "Đêm tháng năm chưa nằm đã sáng,\nNgày tháng mười chưa cười đã tối.", author: "Tục ngữ Việt Nam" },
  { text: "Gần mực thì đen, gần đèn thì rạng.", author: "Tục ngữ Việt Nam" },
  { text: "Thuận vợ thuận chồng tát biển Đông cũng cạn.", author: "Tục ngữ Việt Nam" },
  { text: "Đi một ngày đàng, học một sàng khôn.", author: "Tục ngữ Việt Nam" },
  { text: "Chớ thấy sóng cả mà ngã tay chèo.", author: "Tục ngữ Việt Nam" },
  { text: "Lá lành đùm lá rách, lá rách ít đùm lá rách nhiều.", author: "Tục ngữ Việt Nam" },
  { text: "Trăm năm bia đá thì mòn,\nNghìn năm bia miệng vẫn còn trơ trơ.", author: "Ca dao Việt Nam" },
  { text: "Nhiễu điều phủ lấy giá gương,\nNgười trong một nước phải thương nhau cùng.", author: "Ca dao Việt Nam" },
  { text: "Đói cho sạch, rách cho thơm.", author: "Tục ngữ Việt Nam" },
  { text: "Tiên học lễ, hậu học văn.", author: "Ngạn ngữ truyền thống" },
  { text: "Gió đưa cành trúc la đà,\nTiếng chuông Trấn Vũ, canh gà Thọ Xương.", author: "Ca dao Thăng Long" },
  { text: "Trong đầm gì đẹp bằng sen,\nLá xanh bông trắng lại chen nhị vàng.", author: "Ca dao Việt Nam" },
  { text: "Thất bại là mẹ thành công.", author: "Ngạn ngữ Việt Nam" },
  { text: "Ở hiền gặp lành, ở ác gặp dữ.", author: "Tục ngữ Việt Nam" },
  { text: "Dù ai đi ngược về xuôi,\nNhớ ngày giỗ Tổ mùng mười tháng ba.", author: "Ca dao Việt Nam" },
  { text: "Tốt gỗ hơn tốt nước sơn,\nXấu người đẹp nết còn hơn đẹp người.", author: "Tục ngữ Việt Nam" },
  { text: "An cư lạc nghiệp, vạn sự tùy duyên.", author: "Ngạn ngữ Á Đông" },
  { text: "Tâm an vạn sự an, lòng tĩnh tự nhiên thanh.", author: "Thiền ngữ Á Đông" },
  { text: "Tháng Giêng là tháng ăn chơi,\nTháng Hai trồng đậu, tháng Ba trồng cà.", author: "Ca dao Việt Nam" },
  { text: "Chuồn chuồn bay thấp thì mưa,\nBay cao thì nắng, bay vừa thì râm.", author: "Ca dao Việt Nam" },
  { text: "Nước chảy đá mòn, kiến tha lâu cũng đầy tổ.", author: "Tục ngữ Việt Nam" },
  { text: "Học ăn, học nói, học gói, học mở.", author: "Tục ngữ Việt Nam" },
  { text: "Thương người như thể thương thân.", author: "Tục ngữ Việt Nam" },
  { text: "Sông có khúc, người có lúc.", author: "Tục ngữ Việt Nam" },
  { text: "Mưa dầm thấm lâu, lòng thành cảm hóa.", author: "Ngạn ngữ Việt Nam" }
];

// Lễ Tết Việt Nam nổi bật
export const LE_AM_LICH = {
  "1/1": "Tết Nguyên Đán",
  "2/1": "Mùng 2 Tết",
  "3/1": "Mùng 3 Tết",
  "15/1": "Rằm tháng Giêng (Tết Nguyên Tiêu)",
  "10/3": "Giỗ Tổ Hùng Vương",
  "15/4": "Lễ Phật Đản",
  "5/5": "Tết Đoan Ngọ",
  "15/7": "Lễ Vu Lan (Rằm tháng 7)",
  "15/8": "Tết Trung Thu",
  "23/12": "Ông Công Ông Táo"
};

export const LE_DUONG_LICH = {
  "1/1": "Tết Dương lịch",
  "14/2": "Lễ Tình nhân",
  "8/3": "Quốc tế Phụ nữ",
  "30/4": "Giải phóng miền Nam",
  "1/5": "Quốc tế Lao động",
  "19/5": "Sinh nhật Bác Hồ",
  "1/6": "Quốc tế Thiếu nhi",
  "2/9": "Quốc khánh Việt Nam",
  "20/10": "Phụ nữ Việt Nam",
  "20/11": "Nhà giáo Việt Nam",
  "25/12": "Lễ Giáng Sinh"
};

function INT(d) {
  return Math.floor(d);
}

/**
 * Tính số ngày Julius (Julian Day Number) từ ngày Dương lịch
 */
export function jdFromDate(dd, mm, yy) {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
}

/**
 * Chuyển đổi số ngày Julius sang ngày Dương lịch [dd, mm, yy]
 */
export function jdToDate(jd) {
  let a, b, c;
  if (jd > 2299160) {
    a = jd + 32044;
    b = INT((4 * a + 3) / 146097);
    c = a - INT((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = INT((4 * c + 3) / 1461);
  const e = c - INT((1461 * d) / 4);
  const m = INT((5 * e + 2) / 153);
  const day = e - INT((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * INT(m / 10);
  const year = b * 100 + d - 4800 + INT(m / 10);
  return [day, month, year];
}

/**
 * Tính Delta-T (giây) theo đa thức Espenak & Meeus (NASA) giai đoạn 1900 - 2100
 */
function calcDeltaT(year) {
  if (year < 1920) {
    const t = year - 1900;
    return -2.79 + 1.494119 * t - 0.0598939 * t * t + 0.0061966 * t * t * t - 0.000197 * t * t * t * t;
  } else if (year < 1941) {
    const t = year - 1920;
    return 21.20 + 0.84493 * t - 0.076100 * t * t + 0.0020936 * t * t * t;
  } else if (year < 1961) {
    const t = year - 1950;
    return 29.07 + 0.407 * t - (t * t) / 233 + (t * t * t) / 2547;
  } else if (year < 1986) {
    const t = year - 1975;
    return 45.45 + 1.067 * t - (t * t) / 260 - (t * t * t) / 718;
  } else if (year < 2005) {
    const t = year - 2000;
    return 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t * t * t + 0.000651814 * t * t * t * t + 0.00002373599 * t * t * t * t * t;
  } else if (year <= 2050) {
    const t = year - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  } else {
    const t = (year - 1820) / 100;
    return -20 + 32 * t * t - 0.5628 * (2150 - year);
  }
}

const EPOCH_NEW_MOON_2000 = 2451550.09766;
const SYNODIC_MONTH = 29.530588861;

/**
 * Tính thời điểm Sóc (New Moon) chính xác cao theo Jean Meeus (Ch. 49),
 * k = 0 tại Sóc tháng 1/2000. Trả về Julian Day (UT).
 */
function NewMoon(k) {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;
  const dr = PI / 180;

  const JDE = EPOCH_NEW_MOON_2000 + SYNODIC_MONTH * k + 0.00015437 * T2 - 0.000000150 * T3 + 0.00000000073 * T4;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const E2 = E * E;

  const M = (2.5534 + 29.10535670 * k - 0.0000014 * T2 - 0.00000011 * T3) * dr;
  const Mp = (201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4) * dr;
  const F = (160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4) * dr;
  const Om = (124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3) * dr;

  let corr =
    -0.40720 * Math.sin(Mp) +
    0.17241 * E * Math.sin(M) +
    0.01608 * Math.sin(2 * Mp) +
    0.01039 * Math.sin(2 * F) +
    0.00739 * E * Math.sin(Mp - M) -
    0.00514 * E * Math.sin(Mp + M) +
    0.00208 * E2 * Math.sin(2 * M) -
    0.00111 * Math.sin(Mp - 2 * F) -
    0.00057 * Math.sin(Mp + 2 * F) +
    0.00056 * E * Math.sin(2 * Mp + M) -
    0.00042 * Math.sin(3 * Mp) +
    0.00042 * E * Math.sin(M + 2 * F) +
    0.00038 * E * Math.sin(M - 2 * F) -
    0.00024 * E * Math.sin(2 * Mp - M) -
    0.00017 * Math.sin(Om) -
    0.00007 * Math.sin(Mp + 2 * M) +
    0.00004 * Math.sin(2 * Mp - 2 * F) +
    0.00004 * Math.sin(3 * M) +
    0.00003 * Math.sin(Mp + M - 2 * F) +
    0.00003 * Math.sin(2 * Mp + 2 * F) -
    0.00003 * Math.sin(Mp + M + 2 * F) +
    0.00003 * Math.sin(Mp - M + 2 * F) -
    0.00002 * Math.sin(Mp - M - 2 * F) -
    0.00002 * Math.sin(3 * Mp + M) +
    0.00002 * Math.sin(4 * Mp);

  const A = [
    299.77 + 0.107408 * k - 0.009173 * T2,
    251.88 + 0.016321 * k,
    251.83 + 26.651886 * k,
    349.42 + 36.412478 * k,
    84.66 + 18.206239 * k,
    141.74 + 53.303771 * k,
    207.14 + 2.453732 * k,
    154.84 + 7.306860 * k,
    34.52 + 27.261239 * k,
    207.19 + 0.121824 * k,
    291.34 + 1.844379 * k,
    161.72 + 24.198154 * k,
    239.56 + 25.513099 * k,
    331.55 + 3.592518 * k
  ];
  const Ac = [325, 165, 164, 126, 110, 62, 60, 56, 47, 42, 40, 37, 35, 23];
  for (let i = 0; i < 14; i++) {
    corr += (Ac[i] * 1e-6) * Math.sin(A[i] * dr);
  }

  const approxYear = 2000 + k / 12.3685;
  const deltaT = calcDeltaT(approxYear);
  return JDE + corr - deltaT / 86400;
}

function getNewMoonDay(k, timeZone = TIMEZONE) {
  return INT(NewMoon(k) + 0.5 + timeZone / 24);
}

/**
 * Kinh độ Mặt Trời (radian, từ 0 đến 2*PI) tại thời điểm Julian jdn
 */
function SunLongitude(jdn) {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;
  L = L - PI * 2 * INT(L / (PI * 2));
  return L;
}

function getSunLongitude(dayNumber, timeZone = TIMEZONE) {
  return INT(SunLongitude(dayNumber - 0.5 - timeZone / 24) / PI * 6);
}

function getLunarMonth11(yy, timeZone = TIMEZONE) {
  const off = jdFromDate(31, 12, yy) - EPOCH_NEW_MOON_2000;
  const k = INT(off / SYNODIC_MONTH);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getLeapMonthOffset(a11, timeZone = TIMEZONE) {
  const k = INT((a11 - EPOCH_NEW_MOON_2000) / SYNODIC_MONTH + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Chuyển đổi Dương lịch -> Âm lịch Việt Nam (GMT+7)
 * @returns {{ day: number, month: number, year: number, leap: boolean, jd: number }}
 */
export function convertSolar2Lunar(dd, mm, yy, timeZone = TIMEZONE) {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - EPOCH_NEW_MOON_2000) / SYNODIC_MONTH);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = true;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    leap: lunarLeap,
    jd: dayNumber
  };
}

/**
 * Chuyển đổi Âm lịch -> Dương lịch [dd, mm, yy]
 */
export function convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap = false, timeZone = TIMEZONE) {
  let a11, b11;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }
  const k = INT(0.5 + (a11 - EPOCH_NEW_MOON_2000) / SYNODIC_MONTH);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }
    if (lunarLeap && lunarMonth !== leapMonth) {
      return null;
    } else if (lunarLeap || off >= leapOff) {
      off += 1;
    }
  }
  const monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}

/**
 * Lấy Tiết khí tại một ngày Dương lịch (tính tại thời điểm kết thúc ngày 23:59 GMT+7
 * để xác định chính xác tiết khí đang có hiệu lực / ngày chuyển tiết).
 */
export function getTietKhi(jd, timeZone = TIMEZONE) {
  const endOfDay = jd + 0.5 - timeZone / 24;
  const startOfDay = jd - 0.5 - timeZone / 24;
  const idxEnd = INT((SunLongitude(endOfDay) / PI) * 12) % 24;
  const idxStart = INT((SunLongitude(startOfDay) / PI) * 12) % 24;
  return {
    index: idxEnd,
    name: TIET_KHI[idxEnd],
    isEntryDay: idxEnd !== idxStart
  };
}

/**
 * Tính Can Chi cho Năm, Tháng, Ngày và Giờ đầu ngày
 */
export function getCanChiInfo(lunar, jd) {
  const yearCanIdx = (lunar.year + 6) % 10;
  const yearChiIdx = (lunar.year + 8) % 12;

  const monthCanIdx = (lunar.year * 12 + lunar.month + 3) % 10;
  const monthChiIdx = (lunar.month + 1) % 12;

  const dayCanIdx = (jd + 9) % 10;
  const dayChiIdx = (jd + 1) % 12;

  // Ngũ Thử Độn: Giờ Tý (đầu ngày)
  const firstHourCanIdx = ((dayCanIdx % 5) * 2) % 10;

  // Ngũ Hành Nạp Âm của ngày (60 Hoa Giáp -> index 0..29)
  // Tìm số thứ tự trong vòng 60 Hoa Giáp (Giáp Tý = 0)
  let hoaGiapIdx = 0;
  for (let i = 0; i < 60; i++) {
    if (i % 10 === dayCanIdx && i % 12 === dayChiIdx) {
      hoaGiapIdx = i;
      break;
    }
  }
  const napAm = NAP_AM_30[INT(hoaGiapIdx / 2)];

  return {
    yearCanIdx,
    yearChiIdx,
    yearName: `${CAN[yearCanIdx]} ${CHI[yearChiIdx]}`,
    monthCanIdx,
    monthChiIdx,
    monthName: `${CAN[monthCanIdx]} ${CHI[monthChiIdx]}`,
    dayCanIdx,
    dayChiIdx,
    dayName: `${CAN[dayCanIdx]} ${CHI[dayChiIdx]}`,
    firstHourCanIdx,
    firstHourName: `${CAN[firstHourCanIdx]} Tý`,
    napAm
  };
}

/**
 * Tính Ngày Hoàng Đạo / Hắc Đạo dựa theo Chi của Tháng Âm lịch & Chi của Ngày
 */
export function getDayHoangDao(monthChiIdx, dayChiIdx) {
  // Khởi Thanh Long theo Tháng:
  // Dần(2)/Thân(8) -> Tý(0)
  // Mão(3)/Dậu(9) -> Dần(2)
  // Thìn(4)/Tuất(10) -> Thìn(4)
  // Tỵ(5)/Hợi(11) -> Ngọ(6)
  // Tý(0)/Ngọ(6) -> Thân(8)
  // Sửu(1)/Mùi(7) -> Tuất(10)
  const startChi = ((monthChiIdx - 2 + 12) % 6) * 2;
  const starIdx = (dayChiIdx - startChi + 12) % 12;
  const star = THAN_SAT_12[starIdx];
  return {
    isHoangDao: star.good,
    label: star.good ? "Hoàng đạo" : "Hắc đạo",
    starName: star.name,
    starDesc: star.desc
  };
}

/**
 * Tính đủ 12 Canh Giờ Hoàng Đạo / Hắc Đạo trong ngày
 */
export function getHoursInDay(dayCanIdx, dayChiIdx) {
  const startChi = ((dayChiIdx % 6) * 2 + 8) % 12;
  const firstHourCanIdx = ((dayCanIdx % 5) * 2) % 10;

  return GIO_CANH.map((gio, chiIdx) => {
    const starIdx = (chiIdx - startChi + 12) % 12;
    const star = THAN_SAT_12[starIdx];
    const canIdx = (firstHourCanIdx + chiIdx) % 10;
    return {
      chiIdx,
      chiName: gio.name,
      canChi: `${CAN[canIdx]} ${gio.name}`,
      range: gio.range,
      startHour: gio.startHour,
      endHour: gio.endHour,
      isHoangDao: star.good,
      starName: star.name,
      starDesc: star.desc
    };
  });
}

/**
 * Đánh giá ngày theo tuổi gia chủ (năm sinh Dương lịch -> Chi năm sinh)
 * Trả về mức: 'good' (hợp / hoàng đạo), 'bad' (xung tuổi / đại kỵ), 'neutral'
 */
export function evaluateCompatibility(dayChiIdx, lunarDay, isHoangDao, trucType, birthYear) {
  // Các ngày đại kỵ dân gian (Tam Nương: 3,7,13,18,22,27; Nguyệt Kỵ: 5,14,23)
  const isTamNuong = [3, 7, 13, 18, 22, 27].includes(lunarDay);
  const isNguyetKy = [5, 14, 23].includes(lunarDay);

  let userClash = false;
  let userHarmony = false;
  let userCanChi = "";

  if (birthYear && birthYear >= 1900 && birthYear <= 2100) {
    const userCanIdx = (birthYear + 6) % 10;
    const userChiIdx = (birthYear + 8) % 12;
    userCanChi = `${CAN[userCanIdx]} ${CHI[userChiIdx]}`;

    if (LUC_XUNG[userChiIdx] === dayChiIdx) {
      userClash = true;
    } else {
      const tuHanh = TU_HANH_XUNG.find(group => group.includes(userChiIdx));
      if (tuHanh && tuHanh.includes(dayChiIdx) && userChiIdx !== dayChiIdx) {
        userClash = true;
      }
    }

    if (LUC_HOP[userChiIdx] === dayChiIdx) {
      userHarmony = true;
    } else {
      const tamHop = TAM_HOP.find(group => group.includes(userChiIdx));
      if (tamHop && tamHop.includes(dayChiIdx)) {
        userHarmony = true;
      }
    }
  }

  let status = "neutral";
  let reason = "";

  if (userClash) {
    status = "bad";
    reason = `Xung tuổi ${userCanChi}`;
  } else if (!isHoangDao && (isTamNuong || isNguyetKy || trucType === "xau")) {
    status = "bad";
    reason = isTamNuong ? "Ngày Tam Nương (Hắc đạo)" : isNguyetKy ? "Ngày Nguyệt Kỵ (Hắc đạo)" : "Ngày Hắc đạo xấu";
  } else if (userHarmony && isHoangDao) {
    status = "good";
    reason = `Hợp tuổi ${userCanChi} · Hoàng đạo`;
  } else if (isHoangDao && !isTamNuong && !isNguyetKy && trucType !== "xau") {
    status = "good";
    reason = birthYear ? `Hoàng đạo · Thuận tuổi ${userCanChi}` : "Ngày Hoàng đạo tốt";
  } else if (userHarmony) {
    status = "good";
    reason = `Hợp tuổi ${userCanChi}`;
  }

  // Các tuổi hợp và tuổi xung chung với ngày
  const tamHopGroup = TAM_HOP.find(g => g.includes(dayChiIdx)) || [];
  const hopTuoiList = [
    ...tamHopGroup.filter(c => c !== dayChiIdx),
    LUC_HOP[dayChiIdx]
  ].filter((v, i, a) => a.indexOf(v) === i).map(c => CHI[c]);

  const xungTuoiIdx = LUC_XUNG[dayChiIdx];
  const tuHanhGroup = TU_HANH_XUNG.find(g => g.includes(dayChiIdx)) || [];
  const xungTuoiList = [
    xungTuoiIdx,
    ...tuHanhGroup.filter(c => c !== dayChiIdx && c !== xungTuoiIdx)
  ].map(c => CHI[c]);

  return {
    status, // 'good' | 'bad' | 'neutral'
    reason,
    userCanChi,
    userClash,
    userHarmony,
    isTamNuong,
    isNguyetKy,
    hopTuoiList,
    xungTuoiList
  };
}

/**
 * Lấy câu ca dao/tục ngữ thay đổi theo ngày
 */
export function getDailyQuote(dd, mm, yy) {
  const jd = jdFromDate(dd, mm, yy);
  // Đảm bảo ngày 16/11/2026 hiển thị câu kinh điển hợp với tinh thần Á Đông
  const idx = Math.abs(jd + 12) % CA_DAO_VIET_NAM.length;
  return CA_DAO_VIET_NAM[idx];
}

/**
 * Lấy toàn bộ thông tin phong thủy & lịch cho một ngày Dương lịch
 */
export function getDayFullInfo(dd, mm, yy, birthYear = null) {
  const dateObj = new Date(yy, mm - 1, dd);
  const dayOfWeek = dateObj.getDay(); // 0 = CN, 1 = T2...
  const lunar = convertSolar2Lunar(dd, mm, yy, TIMEZONE);
  const canChi = getCanChiInfo(lunar, lunar.jd);
  const tietKhi = getTietKhi(lunar.jd, TIMEZONE);
  const hoangDao = getDayHoangDao(canChi.monthChiIdx, canChi.dayChiIdx);

  const trucIdx = (canChi.dayChiIdx - canChi.monthChiIdx + 12) % 12;
  const truc = TRUC_12[trucIdx];

  const hours = getHoursInDay(canChi.dayCanIdx, canChi.dayChiIdx);
  const huong = HUONG_XUAT_HANH[canChi.dayCanIdx];
  const compatibility = evaluateCompatibility(
    canChi.dayChiIdx,
    lunar.day,
    hoangDao.isHoangDao,
    truc.type,
    birthYear
  );

  // Việc nên làm & Kiêng kỵ tổng hợp
  const viecNenLam = [...truc.good];
  const viecKiengKy = [...truc.bad];
  if (hoangDao.isHoangDao) {
    if (!viecNenLam.includes("Cầu phúc")) viecNenLam.unshift("Cầu phúc, khởi sự");
  } else {
    if (!viecKiengKy.includes("Khai trương lớn")) viecKiengKy.unshift("Việc đại sự");
  }
  if (compatibility.isTamNuong) viecKiengKy.push("Ngày Tam Nương (kỵ cưới hỏi, khai trương)");
  if (compatibility.isNguyetKy) viecKiengKy.push("Ngày Nguyệt Kỵ (mùng 5, 14, 23)");

  const lunarKey = `${lunar.day}/${lunar.month}`;
  const solarKey = `${dd}/${mm}`;
  const holiday = LE_AM_LICH[lunarKey] || LE_DUONG_LICH[solarKey] || null;

  return {
    solar: {
      day: dd,
      month: mm,
      year: yy,
      dayOfWeek,
      weekdayName: TUAN_THU[dayOfWeek],
      isSunday: dayOfWeek === 0
    },
    lunar: {
      day: lunar.day,
      month: lunar.month,
      year: lunar.year,
      leap: lunar.leap,
      displayShort: (lunar.day === 1 || lunar.day === 15)
        ? `${lunar.day}/${lunar.month}${lunar.leap ? "N" : ""}`
        : `${lunar.day}`,
      displayFull: `Ngày ${lunar.day} tháng ${lunar.month}${lunar.leap ? " (Nhuận)" : ""} năm ${canChi.yearName}`
    },
    jd: lunar.jd,
    canChi,
    tietKhi,
    hoangDao,
    truc,
    huong,
    hours,
    compatibility,
    viecNenLam,
    viecKiengKy,
    holiday,
    quote: getDailyQuote(dd, mm, yy)
  };
}

/**
 * Helper lấy Can Chi của năm sinh
 */
export function getBirthYearInfo(birthYear) {
  if (!birthYear) return null;
  const canIdx = (birthYear + 6) % 10;
  const chiIdx = (birthYear + 8) % 12;
  return {
    year: birthYear,
    canChi: `${CAN[canIdx]} ${CHI[chiIdx]}`,
    conGiap: CON_GIAP[chiIdx],
    chiName: CHI[chiIdx]
  };
}
