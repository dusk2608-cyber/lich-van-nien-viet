/**
 * Module Thời Tiết Thực Tế Theo Vị Trí (Open-Meteo + Geolocation + Reverse Geocoding)
 * Không cần API key, hỗ trợ tìm kiếm & chọn thủ công các tỉnh thành Việt Nam.
 */

export const VIETNAM_CITIES = [
  { name: "Hà Nội", region: "Miền Bắc", lat: 21.0285, lon: 105.8542 },
  { name: "TP. Hồ Chí Minh", region: "Miền Nam", lat: 10.7769, lon: 106.7009 },
  { name: "Đà Nẵng", region: "Miền Trung", lat: 16.0544, lon: 108.2022 },
  { name: "Hải Phòng", region: "Miền Bắc", lat: 20.8449, lon: 106.6881 },
  { name: "Cần Thơ", region: "Miền Nam", lat: 10.0452, lon: 105.7469 },
  { name: "Huế", region: "Miền Trung", lat: 16.4637, lon: 107.5909 },
  { name: "Nha Trang (Khánh Hòa)", region: "Miền Trung", lat: 12.2388, lon: 109.1967 },
  { name: "Đà Lạt (Lâm Đồng)", region: "Tây Nguyên", lat: 11.9404, lon: 108.4583 },
  { name: "Vũng Tàu", region: "Miền Nam", lat: 10.3460, lon: 107.0843 },
  { name: "Quy Nhơn (Bình Định)", region: "Miền Trung", lat: 13.7830, lon: 109.2197 },
  { name: "Hạ Long (Quảng Ninh)", region: "Miền Bắc", lat: 20.9599, lon: 107.0425 },
  { name: "Sa Pa (Lào Cai)", region: "Miền Bắc", lat: 22.3364, lon: 103.8438 },
  { name: "Vinh (Nghệ An)", region: "Miền Trung", lat: 18.6796, lon: 105.6813 },
  { name: "Thanh Hóa", region: "Miền Trung", lat: 19.8067, lon: 105.7852 },
  { name: "Buôn Ma Thuột", region: "Tây Nguyên", lat: 12.6667, lon: 108.0500 },
  { name: "Pleiku (Gia Lai)", region: "Tây Nguyên", lat: 13.9833, lon: 108.0000 },
  { name: "Phú Quốc (Kiên Giang)", region: "Miền Nam", lat: 10.2899, lon: 103.9840 },
  { name: "Phan Thiết (Bình Thuận)", region: "Miền Trung", lat: 10.9289, lon: 108.1021 },
  { name: "Biên Hòa (Đồng Nai)", region: "Miền Nam", lat: 10.9574, lon: 106.8427 },
  { name: "Thủ Dầu Một (Bình Dương)", region: "Miền Nam", lat: 10.9804, lon: 106.6519 },
  { name: "Thái Nguyên", region: "Miền Bắc", lat: 21.5672, lon: 105.8252 },
  { name: "Ninh Bình", region: "Miền Bắc", lat: 20.2506, lon: 105.9745 },
  { name: "Nam Định", region: "Miền Bắc", lat: 20.4388, lon: 106.1621 },
  { name: "Bắc Ninh", region: "Miền Bắc", lat: 21.1861, lon: 106.0763 },
  { name: "Hải Dương", region: "Miền Bắc", lat: 20.9373, lon: 106.3146 },
  { name: "Hà Giang", region: "Miền Bắc", lat: 22.8233, lon: 104.9836 },
  { name: "Cao Bằng", region: "Miền Bắc", lat: 22.6657, lon: 106.2579 },
  { name: "Điện Biên Phủ", region: "Miền Bắc", lat: 21.3860, lon: 103.0230 },
  { name: "Sơn La", region: "Miền Bắc", lat: 21.3256, lon: 103.9188 },
  { name: "Đồng Hới (Quảng Bình)", region: "Miền Trung", lat: 17.4689, lon: 106.6223 },
  { name: "Hội An (Quảng Nam)", region: "Miền Trung", lat: 15.8801, lon: 108.3380 },
  { name: "Quảng Ngãi", region: "Miền Trung", lat: 15.1214, lon: 108.8044 },
  { name: "Tuy Hòa (Phú Yên)", region: "Miền Trung", lat: 13.0955, lon: 109.3209 },
  { name: "Phan Rang (Ninh Thuận)", region: "Miền Trung", lat: 11.5677, lon: 108.9886 },
  { name: "Mỹ Tho (Tiền Giang)", region: "Miền Nam", lat: 10.3600, lon: 106.3600 },
  { name: "Long Xuyên (An Giang)", region: "Miền Nam", lat: 10.3864, lon: 105.4352 },
  { name: "Rạch Giá (Kiên Giang)", region: "Miền Nam", lat: 10.0125, lon: 105.0809 },
  { name: "Cà Mau", region: "Miền Nam", lat: 9.1768, lon: 105.1524 }
];

/**
 * Chuyển đổi mã thời tiết WMO sang tiếng Việt & icon
 */
export function interpretWmoCode(code, isDay = 1) {
  const map = {
    0: { label: isDay ? "Trời quang nắng" : "Trời quang mây", icon: isDay ? "sun" : "moon" },
    1: { label: isDay ? "Nắng nhẹ, ít mây" : "Ít mây", icon: isDay ? "partly-sun" : "partly-moon" },
    2: { label: "Mây rải rác", icon: isDay ? "partly-sun" : "partly-moon" },
    3: { label: "Nhiều mây", icon: "cloudy" },
    45: { label: "Sương mù", icon: "fog" },
    48: { label: "Sương mù dày", icon: "fog" },
    51: { label: "Mưa phùn nhẹ", icon: "drizzle" },
    53: { label: "Mưa phùn", icon: "drizzle" },
    55: { label: "Mưa phùn dày", icon: "drizzle" },
    56: { label: "Mưa phùn lạnh", icon: "drizzle" },
    57: { label: "Mưa phùn đóng băng", icon: "drizzle" },
    61: { label: "Mưa nhỏ", icon: "rain" },
    63: { label: "Mưa vừa", icon: "rain" },
    65: { label: "Mưa to", icon: "heavy-rain" },
    66: { label: "Mưa lạnh nhẹ", icon: "rain" },
    67: { label: "Mưa lạnh to", icon: "heavy-rain" },
    71: { label: "Tuyết nhẹ", icon: "snow" },
    73: { label: "Tuyết vừa", icon: "snow" },
    75: { label: "Tuyết dày", icon: "snow" },
    80: { label: "Mưa rào nhẹ", icon: "rain" },
    81: { label: "Mưa rào vừa", icon: "rain" },
    82: { label: "Mưa rào rất to", icon: "heavy-rain" },
    95: { label: "Mưa dông", icon: "thunder" },
    96: { label: "Dông kèm mưa đá", icon: "thunder" },
    99: { label: "Dông bão mạnh", icon: "thunder" }
  };
  return map[code] || { label: "Thời tiết ôn hòa", icon: isDay ? "partly-sun" : "cloudy" };
}

/**
 * Trả về SVG icon thời tiết nét thanh tao hợp thẩm mỹ Á Đông
 */
export function getWeatherSvg(iconType, size = 28) {
  const s = size;
  switch (iconType) {
    case "sun":
      return `<svg width="${s}" height="${s}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="6.5" fill="#D97706" fill-opacity="0.9"/>
        <path d="M16 3V6.5M16 25.5V29M3 16H6.5M25.5 16H29M6.8 6.8L9.3 9.3M22.7 22.7L25.2 25.2M25.2 6.8L22.7 9.3M9.3 22.7L6.8 25.2" stroke="#D97706" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
    case "moon":
      return `<svg width="${s}" height="${s}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M23.5 19.8A8.5 8.5 0 0 1 12.2 8.5a8.5 8.5 0 1 0 11.3 11.3Z" fill="#B45309" fill-opacity="0.85" stroke="#92400E" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>`;
    case "partly-sun":
      return `<svg width="${s}" height="${s}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="12.5" cy="12" r="5" fill="#D97706" fill-opacity="0.9"/>
        <path d="M12.5 3.5V5.5M4 12H6M6.5 6L8 7.5M18.5 6L17 7.5" stroke="#D97706" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M10.5 23.5H23a4 4 0 0 0 .4-7.98A5.5 5.5 0 0 0 12.8 14a4.75 4.75 0 0 0-2.3 9.5Z" fill="#EFE8D8" stroke="#6B5E52" stroke-width="1.6" stroke-linejoin="round"/>
      </svg>`;
    case "partly-moon":
      return `<svg width="${s}" height="${s}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M15.8 11.8a5 5 0 0 1-5.6-5.6 5 5 0 1 0 5.6 5.6Z" fill="#B45309" fill-opacity="0.85"/>
        <path d="M10.5 24H23a4 4 0 0 0 .4-7.98A5.5 5.5 0 0 0 12.8 14.5a4.75 4.75 0 0 0-2.3 9.5Z" fill="#EFE8D8" stroke="#6B5E52" stroke-width="1.6" stroke-linejoin="round"/>
      </svg>`;
    case "cloudy":
      return `<svg width="${s}" height="${s}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M9 23.5h14.5a4.2 4.2 0 0 0 .4-8.38A6 6 0 0 0 12.3 13.5 5 5 0 0 0 9 23.5Z" fill="#E6DFD0" stroke="#5C5046" stroke-width="1.7" stroke-linejoin="round"/>
      </svg>`;
    case "fog":
      return `<svg width="${s}" height="${s}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M9 17.5h14a3.5 3.5 0 0 0 .3-6.98A5 5 0 0 0 13.7 9a4.2 4.2 0 0 0-4.7 8.5Z" fill="#E6DFD0" stroke="#6B5E52" stroke-width="1.6"/>
        <path d="M6 21.5H26M8 25.5H24" stroke="#78716C" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`;
    case "drizzle":
    case "rain":
      return `<svg width="${s}" height="${s}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M8.5 19.5H23a3.8 3.8 0 0 0 .4-7.58A5.4 5.4 0 0 0 13 10.4a4.6 4.6 0 0 0-4.5 9.1Z" fill="#E2E8F0" stroke="#475569" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M11 23L9.5 26.5M16 23L14.5 26.5M21 23L19.5 26.5" stroke="#0F766E" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`;
    case "heavy-rain":
      return `<svg width="${s}" height="${s}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M8.5 18.5H23a3.8 3.8 0 0 0 .4-7.58A5.4 5.4 0 0 0 13 9.4a4.6 4.6 0 0 0-4.5 9.1Z" fill="#CBD5E1" stroke="#334155" stroke-width="1.6"/>
        <path d="M10 21.5L8 27M14.5 21.5L12.5 27M19 21.5L17 27M23 21.5L21 27" stroke="#0E7490" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`;
    case "thunder":
      return `<svg width="${s}" height="${s}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M8.5 18.5H23a3.8 3.8 0 0 0 .4-7.58A5.4 5.4 0 0 0 13 9.4a4.6 4.6 0 0 0-4.5 9.1Z" fill="#CBD5E1" stroke="#334155" stroke-width="1.6"/>
        <path d="M16.5 19.5L13 24.5H16.5L14.5 29L20 23H16.5L18.5 19.5Z" fill="#D97706" stroke="#B45309" stroke-width="0.8" stroke-linejoin="round"/>
      </svg>`;
    default:
      return `<svg width="${s}" height="${s}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="6" fill="#D97706" fill-opacity="0.8"/>
      </svg>`;
  }
}

/**
 * Lấy tọa độ GPS hiện tại từ trình duyệt
 */
export function getCurrentPosition(timeoutMs = 9000) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Trình duyệt không hỗ trợ định vị GPS."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: pos.coords.accuracy
      }),
      err => {
        if (err.code === 1) reject(new Error("Bạn chưa cấp quyền truy cập vị trí GPS."));
        else if (err.code === 2) reject(new Error("Không xác định được vị trí GPS hiện tại."));
        else reject(new Error("Hết thời gian chờ tín hiệu GPS."));
      },
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 300000 }
    );
  });
}

/**
 * Reverse Geocoding lấy tên Quận/Huyện, Tỉnh/Thành bằng tiếng Việt
 */
export async function reverseGeocode(lat, lon) {
  // 1. BigDataCloud (nhanh, miễn phí, không CORS)
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&localityLanguage=vi`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const district = data.locality || data.city || "";
      const province = data.principalSubdivision || "";
      if (district && province && district !== province) {
        return `${district}, ${province}`;
      }
      if (province || district) {
        return province || district;
      }
    }
  } catch {
    // Fallback sang Nominatim
  }

  // 2. OpenStreetMap Nominatim fallback
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&accept-language=vi`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const a = data.address || {};
      const part1 = a.suburb || a.city_district || a.district || a.town || a.village || "";
      const part2 = a.city || a.state || a.province || "";
      if (part1 && part2 && part1 !== part2) return `${part1}, ${part2}`;
      if (part2 || part1) return part2 || part1;
    }
  } catch {
    // Ignore
  }

  return `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
}

/**
 * Gọi Open-Meteo API lấy thời tiết thực tế & dự báo 5 ngày
 */
export async function fetchWeatherByCoords(lat, lon, locationLabel = null) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lon)}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=auto&forecast_days=5`;

  const [weatherRes, resolvedName] = await Promise.all([
    fetch(url),
    locationLabel ? Promise.resolve(locationLabel) : reverseGeocode(lat, lon)
  ]);

  if (!weatherRes.ok) {
    throw new Error("Không thể kết nối máy chủ thời tiết Open-Meteo.");
  }

  const data = await weatherRes.json();
  const cur = data.current || {};
  const daily = data.daily || {};
  const wmo = interpretWmoCode(cur.weather_code, cur.is_day);

  const forecast = (daily.time || []).map((dateStr, idx) => ({
    dateStr,
    code: daily.weather_code?.[idx],
    info: interpretWmoCode(daily.weather_code?.[idx], 1),
    tempMax: Math.round(daily.temperature_2m_max?.[idx] ?? 0),
    tempMin: Math.round(daily.temperature_2m_min?.[idx] ?? 0),
    rainChance: daily.precipitation_probability_max?.[idx] ?? 0
  }));

  return {
    locationName: resolvedName || "Vị trí hiện tại",
    lat,
    lon,
    temp: Math.round(cur.temperature_2m ?? 0),
    feelsLike: Math.round(cur.apparent_temperature ?? cur.temperature_2m ?? 0),
    humidity: Math.round(cur.relative_humidity_2m ?? 0),
    windSpeed: Math.round(cur.wind_speed_10m ?? 0),
    isDay: cur.is_day ?? 1,
    weatherCode: cur.weather_code ?? 0,
    conditionLabel: wmo.label,
    iconType: wmo.icon,
    tempMax: forecast[0]?.tempMax ?? Math.round(cur.temperature_2m ?? 0),
    tempMin: forecast[0]?.tempMin ?? Math.round(cur.temperature_2m ?? 0),
    rainChance: forecast[0]?.rainChance ?? 0,
    forecast,
    updatedAt: new Date()
  };
}

/**
 * Tìm kiếm địa điểm trực tuyến qua Open-Meteo Geocoding API
 */
export async function searchLocations(query) {
  const q = query.trim();
  if (!q) return VIETNAM_CITIES.slice(0, 12);

  // Lọc nhanh danh sách tỉnh thành Việt Nam có sẵn (hỗ trợ tìm không dấu / có dấu)
  const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const nq = norm(q);
  const localMatches = VIETNAM_CITIES.filter(c => norm(c.name).includes(nq));

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=vi&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const apiResults = (data.results || []).map(r => ({
        name: r.admin1 && r.admin1 !== r.name ? `${r.name}, ${r.admin1}` : r.name,
        region: r.country || "Việt Nam",
        lat: r.latitude,
        lon: r.longitude
      }));
      // Hợp nhất không trùng lặp
      const merged = [...localMatches];
      for (const item of apiResults) {
        if (!merged.some(m => Math.abs(m.lat - item.lat) < 0.08 && Math.abs(m.lon - item.lon) < 0.08)) {
          merged.push(item);
        }
      }
      return merged.slice(0, 12);
    }
  } catch {
    // Trả về kết quả nội bộ nếu ngoại tuyến
  }

  return localMatches;
}
