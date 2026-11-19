import {
  getDayFullInfo,
  getBirthYearInfo,
  convertSolar2Lunar,
  convertLunar2Solar
} from "./lunar-calendar.js";
import {
  VIETNAM_CITIES,
  getWeatherSvg,
  getCurrentPosition,
  fetchWeatherByCoords,
  searchLocations
} from "./weather.js";

const STORAGE_KEYS = {
  BIRTH_YEAR: "vanky_birth_year",
  SAVED_LOCATION: "vanky_weather_location"
};

const todayNow = new Date();
const state = {
  selectedDate: {
    day: todayNow.getDate(),
    month: todayNow.getMonth() + 1,
    year: todayNow.getFullYear()
  },
  viewMonth: todayNow.getMonth() + 1,
  viewYear: todayNow.getFullYear(),
  birthYear: loadBirthYear(),
  weather: null,
  weatherLoading: false,
  weatherError: null,
  converterMode: "solar2lunar"
};

function loadBirthYear() {
  const raw = localStorage.getItem(STORAGE_KEYS.BIRTH_YEAR);
  const yr = raw ? parseInt(raw, 10) : NaN;
  return Number.isInteger(yr) && yr >= 1900 && yr <= 2100 ? yr : null;
}

function isSameDay(a, b) {
  return a.day === b.day && a.month === b.month && a.year === b.year;
}

function getTodayObj() {
  const d = new Date();
  return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
}

function shiftSelectedDate(deltaDays) {
  const dt = new Date(state.selectedDate.year, state.selectedDate.month - 1, state.selectedDate.day + deltaDays);
  const ny = dt.getFullYear();
  if (ny < 1900 || ny > 2100) return;
  state.selectedDate = {
    day: dt.getDate(),
    month: dt.getMonth() + 1,
    year: ny
  };
  state.viewMonth = state.selectedDate.month;
  state.viewYear = state.selectedDate.year;
  renderAll();
}

function selectDate(day, month, year) {
  if (year < 1900 || year > 2100) return;
  state.selectedDate = { day, month, year };
  state.viewMonth = month;
  state.viewYear = year;
  renderAll();
}

function shiftViewMonth(deltaMonths) {
  const dt = new Date(state.viewYear, state.viewMonth - 1 + deltaMonths, 1);
  const ny = dt.getFullYear();
  if (ny < 1900 || ny > 2100) return;
  state.viewMonth = dt.getMonth() + 1;
  state.viewYear = ny;
  renderCalendarGrid();
}

/* ==================== RENDERING ==================== */

function renderBirthYearBadge() {
  const badge = document.getElementById("birthYearBadge");
  const legendBad = document.getElementById("legendBadText");
  const legendGood = document.getElementById("legendGoodText");
  const info = getBirthYearInfo(state.birthYear);

  if (info) {
    badge.textContent = `${info.canChi} (${info.year})`;
    legendBad.textContent = `rất xấu / xung tuổi ${info.chiName}`;
    legendGood.textContent = `hợp tuổi ${info.chiName} / Hoàng đạo`;
  } else {
    badge.textContent = "Tuổi: Chọn";
    legendBad.textContent = "ngày Hắc đạo / đại kỵ";
    legendGood.textContent = "ngày Hoàng đạo tốt";
  }
}

function renderHeroAndDetails() {
  const { day, month, year } = state.selectedDate;
  const info = getDayFullInfo(day, month, year, state.birthYear);

  // Hero circle
  document.getElementById("heroWeekday").textContent = info.solar.weekdayName;
  document.getElementById("heroDay").textContent = info.solar.day;
  document.getElementById("heroMonthYear").textContent = `Tháng ${info.solar.month} năm ${info.solar.year}`;
  document.getElementById("heroLunarText").textContent = info.lunar.displayFull;

  // Pills
  const pillHD = document.getElementById("pillHoangDao");
  pillHD.textContent = `${info.hoangDao.label} · ${info.hoangDao.starName}`;
  pillHD.className = `info-pill pill-hoang-dao ${info.hoangDao.isHoangDao ? "is-good" : "is-bad"}`;

  const pillTK = document.getElementById("pillTietKhi");
  pillTK.textContent = `Tiết ${info.tietKhi.name}`;

  const pillHoliday = document.getElementById("pillHoliday");
  if (info.holiday) {
    pillHoliday.textContent = `★ ${info.holiday}`;
    pillHoliday.classList.remove("hidden");
  } else {
    pillHoliday.classList.add("hidden");
  }

  // Quote
  document.getElementById("dailyQuoteText").textContent = `“${info.quote.text}”`;
  document.getElementById("dailyQuoteAuthor").textContent = `— ${info.quote.author}`;

  // Detail card header
  document.getElementById("detailTitle").textContent =
    `${info.solar.weekdayName}, ${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
  document.getElementById("detailSubtitle").textContent = info.lunar.displayFull;

  const ratingBadge = document.getElementById("detailRatingBadge");
  ratingBadge.textContent = `${info.hoangDao.label} · ${info.hoangDao.starName}`;
  ratingBadge.className = `rating-badge ${info.hoangDao.isHoangDao ? "is-good" : "is-bad"}`;

  // Banner hợp/xung tuổi gia chủ
  const ageBanner = document.getElementById("userAgeBanner");
  if (state.birthYear) {
    ageBanner.className = `user-age-banner status-${info.compatibility.status}`;
    const prefix = info.compatibility.status === "good"
      ? "✦ Ngày thuận lợi:"
      : info.compatibility.status === "bad"
        ? "⚠ Lưu ý:"
        : "● Trung bình:";
    ageBanner.innerHTML = `<span><strong>${prefix}</strong> ${info.compatibility.reason || `Bình hòa với tuổi ${info.compatibility.userCanChi}`}</span>`;
  } else {
    ageBanner.className = "user-age-banner status-neutral";
    ageBanner.innerHTML = `
      <span>Chọn <strong>năm sinh gia chủ</strong> để xem đánh giá hợp/xung riêng cho tuổi của bạn.</span>
      <button type="button" class="btn-gps-inline" id="btnInlinePickAge">Chọn tuổi</button>
    `;
    document.getElementById("btnInlinePickAge")?.addEventListener("click", openBirthYearModal);
  }

  // 12 Canh Giờ
  const hoursGrid = document.getElementById("hoursGrid");
  const isViewingToday = isSameDay(state.selectedDate, getTodayObj());
  const currentHour = new Date().getHours();

  hoursGrid.innerHTML = info.hours.map(h => {
    const isNow = isViewingToday && (
      h.startHour === 23
        ? (currentHour >= 23 || currentHour < 1)
        : (currentHour >= h.startHour && currentHour < h.endHour)
    );
    return `
      <div class="hour-card ${h.isHoangDao ? "is-hoang-dao" : "is-hac-dao"} ${isNow ? "is-current" : ""}">
        <div class="hour-top">
          <span class="hour-name">Giờ ${h.chiName}</span>
          <span class="hour-badge">${h.isHoangDao ? "Hoàng đạo" : "Hắc đạo"}</span>
        </div>
        <div class="hour-range">${h.range} · ${h.canChi}</div>
        <div class="hour-star">Sao ${h.starName}</div>
        ${isNow ? `<span class="hour-now-tag">Đang diễn ra</span>` : ""}
      </div>
    `;
  }).join("");

  // Thông tin phong thủy
  document.getElementById("fsDayCanChi").textContent = info.canChi.dayName;
  document.getElementById("fsMonthYearCanChi").textContent = `${info.canChi.monthName} / ${info.canChi.yearName}`;
  document.getElementById("fsFirstHour").textContent = info.canChi.firstHourName;
  document.getElementById("fsNapAm").textContent = info.canChi.napAm;
  document.getElementById("fsTrucSao").textContent = `Trực ${info.truc.name} · ${info.hoangDao.starName}`;
  document.getElementById("fsHuong").textContent = `Hỷ Thần: ${info.huong.hyThan} · Tài Thần: ${info.huong.taiThan}`;

  document.getElementById("listViecNen").innerHTML = info.viecNenLam.map(v => `<li>${v}</li>`).join("");
  document.getElementById("listViecKy").innerHTML = info.viecKiengKy.map(v => `<li>${v}</li>`).join("");
  document.getElementById("fsHopTuoi").textContent = info.compatibility.hopTuoiList.join(", ");
  document.getElementById("fsXungTuoi").textContent = info.compatibility.xungTuoiList.join(", ");
}

function renderCalendarGrid() {
  const vm = state.viewMonth;
  const vy = state.viewYear;
  document.getElementById("calendarMonthTitle").textContent = `Tháng ${vm} - ${vy}`;

  const firstDay = new Date(vy, vm - 1, 1);
  // Quy đổi Monday = 0 ... Sunday = 6
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(vy, vm, 0).getDate();
  const prevMonthLastDate = new Date(vy, vm - 1, 0).getDate();
  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

  const todayObj = getTodayObj();
  const grid = document.getElementById("calendarGrid");
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < totalCells; i++) {
    let cellDay, cellMonth, cellYear, isOutside = false;

    if (i < startWeekday) {
      cellDay = prevMonthLastDate - startWeekday + 1 + i;
      const dt = new Date(vy, vm - 2, cellDay);
      cellMonth = dt.getMonth() + 1;
      cellYear = dt.getFullYear();
      isOutside = true;
    } else if (i >= startWeekday + daysInMonth) {
      cellDay = i - (startWeekday + daysInMonth) + 1;
      const dt = new Date(vy, vm, cellDay);
      cellMonth = dt.getMonth() + 1;
      cellYear = dt.getFullYear();
      isOutside = true;
    } else {
      cellDay = i - startWeekday + 1;
      cellMonth = vm;
      cellYear = vy;
    }

    const cellInfo = getDayFullInfo(cellDay, cellMonth, cellYear, state.birthYear);
    const cellObj = { day: cellDay, month: cellMonth, year: cellYear };

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "day-cell";
    if (isOutside) btn.classList.add("is-outside");
    if (cellInfo.solar.isSunday) btn.classList.add("is-sunday");
    if (cellInfo.lunar.day === 1 || cellInfo.lunar.day === 15) btn.classList.add("is-lunar-highlight");
    if (!isOutside && cellInfo.compatibility.status === "good") btn.classList.add("is-good");
    if (!isOutside && cellInfo.compatibility.status === "bad") btn.classList.add("is-bad");
    if (isSameDay(cellObj, todayObj)) btn.classList.add("is-today");
    if (isSameDay(cellObj, state.selectedDate)) btn.classList.add("is-selected");

    btn.setAttribute(
      "aria-label",
      `${cellDay} tháng ${cellMonth} năm ${cellYear}, Âm lịch ${cellInfo.lunar.day} tháng ${cellInfo.lunar.month}`
    );

    const hasMarker = Boolean(cellInfo.holiday || cellInfo.tietKhi.isEntryDay);
    btn.innerHTML = `
      <span class="day-solar">${cellDay}</span>
      <span class="day-lunar">${cellInfo.lunar.displayShort}</span>
      ${hasMarker && !isOutside ? `<span class="day-badge-dot" aria-hidden="true"></span>` : ""}
    `;

    btn.addEventListener("click", () => selectDate(cellDay, cellMonth, cellYear));
    fragment.appendChild(btn);
  }

  grid.innerHTML = "";
  grid.appendChild(fragment);
}

function renderAll() {
  renderBirthYearBadge();
  renderHeroAndDetails();
  renderCalendarGrid();
}

/* ==================== THỜI TIẾT THỰC TẾ ==================== */

function renderWeatherUI() {
  const iconWrap = document.getElementById("weatherIconWrap");
  const locEl = document.getElementById("weatherLocation");
  const condEl = document.getElementById("weatherCondition");
  const rangeEl = document.getElementById("weatherRange");
  const tempEl = document.getElementById("weatherTemp");
  const humEl = document.getElementById("weatherHumidity");
  const windEl = document.getElementById("weatherWind");
  const gpsBtn = document.getElementById("btnRefreshGps");

  gpsBtn.classList.toggle("spinning", state.weatherLoading);

  if (state.weatherLoading && !state.weather) {
    locEl.textContent = "Đang định vị vị trí...";
    condEl.textContent = "Đang tải thời tiết Open-Meteo";
    iconWrap.innerHTML = getWeatherSvg("partly-sun", 30);
    return;
  }

  if (state.weatherError && !state.weather) {
    locEl.textContent = "Chưa lấy được vị trí (Nhấn để chọn)";
    condEl.textContent = state.weatherError;
    rangeEl.textContent = "";
    iconWrap.innerHTML = getWeatherSvg("cloudy", 30);
    return;
  }

  const w = state.weather;
  if (!w) return;

  iconWrap.innerHTML = getWeatherSvg(w.iconType, 32);
  locEl.textContent = w.locationName;
  condEl.textContent = w.conditionLabel;
  rangeEl.textContent = `↑${w.tempMax}° ↓${w.tempMin}°`;
  tempEl.textContent = `${w.temp}°C`;
  humEl.textContent = `💧 ${w.humidity}%`;
  windEl.textContent = `💨 ${w.windSpeed} km/h`;

  renderWeatherModalContent();
}

function renderWeatherModalContent() {
  const summaryEl = document.getElementById("weatherModalSummary");
  const forecastEl = document.getElementById("weatherForecastList");
  const w = state.weather;

  if (!w) {
    summaryEl.innerHTML = `<p style="margin:0;font-size:.86rem;">Chưa có dữ liệu thời tiết. Vui lòng bật GPS hoặc chọn tỉnh/thành bên dưới.</p>`;
    forecastEl.innerHTML = "";
    return;
  }

  summaryEl.innerHTML = `
    <div class="wd-top">
      <div>
        <div style="font-size:.74rem;color:var(--ink-secondary);">📍 Vị trí hiện tại</div>
        <strong style="font-size:1.05rem;">${w.locationName}</strong>
        <div style="font-size:.82rem;color:var(--ink-secondary);margin-top:2px;">${w.conditionLabel} · Cảm giác như ${w.feelsLike}°C</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        ${getWeatherSvg(w.iconType, 42)}
        <span class="wd-temp">${w.temp}°C</span>
      </div>
    </div>
    <div class="wd-stats">
      <div><strong>↑${w.tempMax}° / ↓${w.tempMin}°</strong><br/>Cao / Thấp</div>
      <div><strong>${w.humidity}%</strong><br/>Độ ẩm</div>
      <div><strong>${w.windSpeed} km/h</strong><br/>Gió · Mưa ${w.rainChance}%</div>
    </div>
  `;

  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  forecastEl.innerHTML = (w.forecast || []).map((f, idx) => {
    const dt = new Date(f.dateStr + "T00:00:00");
    const label = idx === 0 ? "Hôm nay" : dayNames[dt.getDay()];
    return `
      <div class="fc-item">
        <div class="fc-day">${label}</div>
        <div>${getWeatherSvg(f.info.icon, 26)}</div>
        <div class="fc-temps">${f.tempMax}° / ${f.tempMin}°</div>
      </div>
    `;
  }).join("");
}

async function loadWeatherByGPS(forceGps = false) {
  state.weatherLoading = true;
  state.weatherError = null;
  renderWeatherUI();

  try {
    const pos = await getCurrentPosition(8500);
    const weatherData = await fetchWeatherByCoords(pos.lat, pos.lon);
    state.weather = weatherData;
    localStorage.setItem(STORAGE_KEYS.SAVED_LOCATION, JSON.stringify({
      mode: "gps",
      lat: pos.lat,
      lon: pos.lon,
      name: weatherData.locationName
    }));
  } catch (err) {
    if (!forceGps) {
      // Nếu người dùng từ chối GPS lúc mới mở, dùng vị trí đã lưu hoặc mặc định Hà Nội
      const saved = readSavedLocation();
      const fallback = saved || { name: "Hà Nội", lat: 21.0285, lon: 105.8542 };
      try {
        state.weather = await fetchWeatherByCoords(fallback.lat, fallback.lon, fallback.name);
      } catch (e2) {
        state.weatherError = e2.message;
      }
    } else {
      state.weatherError = err.message;
      alert(`${err.message} Bạn có thể chọn tỉnh/thành thủ công trong danh sách.`);
      openModal("weatherModal");
    }
  } finally {
    state.weatherLoading = false;
    renderWeatherUI();
  }
}

function readSavedLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_LOCATION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function selectManualCity(city) {
  state.weatherLoading = true;
  renderWeatherUI();
  try {
    state.weather = await fetchWeatherByCoords(city.lat, city.lon, city.name);
    localStorage.setItem(STORAGE_KEYS.SAVED_LOCATION, JSON.stringify({
      mode: "manual",
      lat: city.lat,
      lon: city.lon,
      name: city.name
    }));
  } catch (err) {
    state.weatherError = err.message;
  } finally {
    state.weatherLoading = false;
    renderWeatherUI();
  }
}

async function initWeather() {
  const saved = readSavedLocation();
  if (saved && saved.mode === "manual") {
    await selectManualCity(saved);
  } else {
    await loadWeatherByGPS(false);
  }
}

/* ==================== MODALS & CONTROLS ==================== */

function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

function renderCityList(cities) {
  const container = document.getElementById("cityList");
  if (!cities.length) {
    container.innerHTML = `<div style="grid-column:1/-1;font-size:.8rem;color:var(--ink-muted);padding:8px;">Không tìm thấy địa điểm phù hợp.</div>`;
    return;
  }
  container.innerHTML = cities.map((c, idx) => `
    <button type="button" class="city-option" data-idx="${idx}">
      <strong>${c.name}</strong>
      <span>${c.region || "Việt Nam"}</span>
    </button>
  `).join("");

  container.querySelectorAll(".city-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const city = cities[parseInt(btn.dataset.idx, 10)];
      if (city) {
        selectManualCity(city);
      }
    });
  });
}

function openBirthYearModal() {
  const input = document.getElementById("birthYearInput");
  input.value = state.birthYear || "";
  updateBirthYearPreview(state.birthYear);
  openModal("birthYearModal");
}

function updateBirthYearPreview(val) {
  const preview = document.getElementById("birthYearPreview");
  const yr = parseInt(val, 10);
  if (!Number.isInteger(yr) || yr < 1900 || yr > 2100) {
    preview.textContent = val ? "Vui lòng nhập năm từ 1900 đến 2100" : "";
    return;
  }
  const info = getBirthYearInfo(yr);
  preview.textContent = `Tuổi ${info.canChi} (Con giáp: ${info.conGiap})`;
}

function saveBirthYear(yr) {
  if (!Number.isInteger(yr) || yr < 1900 || yr > 2100) return;
  state.birthYear = yr;
  localStorage.setItem(STORAGE_KEYS.BIRTH_YEAR, String(yr));
  closeModal("birthYearModal");
  renderAll();
}

function setupQuickBirthYears() {
  const years = [1975, 1980, 1984, 1987, 1990, 1992, 1995, 1998, 2000];
  const grid = document.getElementById("quickYearsGrid");
  grid.innerHTML = years.map(y => {
    const info = getBirthYearInfo(y);
    return `<button type="button" class="quick-year-btn" data-year="${y}"><strong>${y}</strong> · ${info.canChi}</button>`;
  }).join("");

  grid.querySelectorAll(".quick-year-btn").forEach(btn => {
    btn.addEventListener("click", () => saveBirthYear(parseInt(btn.dataset.year, 10)));
  });
}

function setupConverterModal() {
  const tabs = document.querySelectorAll(".conv-tab");
  const leapWrap = document.getElementById("convLeapWrap");
  const dayIn = document.getElementById("convDay");
  const monthIn = document.getElementById("convMonth");
  const yearIn = document.getElementById("convYear");
  const leapIn = document.getElementById("convLeap");
  const resultEl = document.getElementById("convResult");

  dayIn.value = state.selectedDate.day;
  monthIn.value = state.selectedDate.month;
  yearIn.value = state.selectedDate.year;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.converterMode = tab.dataset.mode;
      leapWrap.classList.toggle("hidden", state.converterMode === "solar2lunar");
      resultEl.innerHTML = "";
    });
  });

  document.getElementById("btnConvertDate").addEventListener("click", () => {
    const d = parseInt(dayIn.value, 10);
    const m = parseInt(monthIn.value, 10);
    const y = parseInt(yearIn.value, 10);
    if (!d || !m || !y || y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) {
      resultEl.textContent = "Vui lòng nhập ngày tháng năm hợp lệ (1900 - 2100).";
      return;
    }

    if (state.converterMode === "solar2lunar") {
      const check = new Date(y, m - 1, d);
      if (check.getFullYear() !== y || check.getMonth() + 1 !== m || check.getDate() !== d) {
        resultEl.textContent = "Ngày Dương lịch không tồn tại.";
        return;
      }
      const info = getDayFullInfo(d, m, y, state.birthYear);
      resultEl.innerHTML = `
        <strong>Dương lịch:</strong> ${info.solar.weekdayName}, ${d}/${m}/${y}<br/>
        <strong>Âm lịch:</strong> ${info.lunar.displayFull}<br/>
        <strong>Can Chi ngày:</strong> ${info.canChi.dayName} · ${info.hoangDao.label} (${info.hoangDao.starName})
      `;
      selectDate(d, m, y);
    } else {
      const solarArr = convertLunar2Solar(d, m, y, leapIn.checked);
      if (!solarArr) {
        resultEl.textContent = "Ngày/tháng nhuận Âm lịch không tồn tại trong năm này.";
        return;
      }
      const [sd, sm, sy] = solarArr;
      const info = getDayFullInfo(sd, sm, sy, state.birthYear);
      resultEl.innerHTML = `
        <strong>Âm lịch:</strong> Ngày ${d}/${m}${leapIn.checked ? " (Nhuận)" : ""}/${y}<br/>
        <strong>Dương lịch:</strong> ${info.solar.weekdayName}, ${sd}/${sm}/${sy}<br/>
        <strong>Can Chi ngày:</strong> ${info.canChi.dayName} · ${info.hoangDao.label} (${info.hoangDao.starName})
      `;
      selectDate(sd, sm, sy);
    }
  });
}

function bindEvents() {
  document.getElementById("btnToday").addEventListener("click", () => {
    const t = getTodayObj();
    selectDate(t.day, t.month, t.year);
  });

  document.getElementById("btnPrevDay").addEventListener("click", () => shiftSelectedDate(-1));
  document.getElementById("btnNextDay").addEventListener("click", () => shiftSelectedDate(1));
  document.getElementById("btnPrevMonth").addEventListener("click", () => shiftViewMonth(-1));
  document.getElementById("btnNextMonth").addEventListener("click", () => shiftViewMonth(1));

  const scrollToDetails = () => {
    document.getElementById("dayDetailSection").scrollIntoView({ behavior: "smooth", block: "start" });
  };
  document.getElementById("btnJumpDetails").addEventListener("click", scrollToDetails);
  document.getElementById("heroCircleTrigger").addEventListener("click", scrollToDetails);

  // Weather triggers
  document.getElementById("btnOpenWeather").addEventListener("click", () => {
    renderWeatherModalContent();
    renderCityList(VIETNAM_CITIES);
    openModal("weatherModal");
  });
  document.getElementById("btnRefreshGps").addEventListener("click", () => loadWeatherByGPS(true));
  document.getElementById("btnModalGps").addEventListener("click", () => loadWeatherByGPS(true));

  let searchTimer = null;
  document.getElementById("citySearchInput").addEventListener("input", e => {
    clearTimeout(searchTimer);
    const val = e.target.value;
    searchTimer = setTimeout(async () => {
      const results = await searchLocations(val);
      renderCityList(results);
    }, 260);
  });

  // Birth year triggers
  document.getElementById("btnConverterDesktop")?.addEventListener("click", () => {
    document.getElementById("convDay").value = state.selectedDate.day;
    document.getElementById("convMonth").value = state.selectedDate.month;
    document.getElementById("convYear").value = state.selectedDate.year;
    openModal("converterModal");
  });
  document.getElementById("btnBirthYear").addEventListener("click", openBirthYearModal);
  document.getElementById("birthYearInput").addEventListener("input", e => updateBirthYearPreview(e.target.value));
  document.getElementById("btnSaveBirthYear").addEventListener("click", () => {
    saveBirthYear(parseInt(document.getElementById("birthYearInput").value, 10));
  });
  document.getElementById("btnClearBirthYear").addEventListener("click", () => {
    state.birthYear = null;
    localStorage.removeItem(STORAGE_KEYS.BIRTH_YEAR);
    closeModal("birthYearModal");
    renderAll();
  });

  // Modal close buttons & backdrop click
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });
  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", e => {
      if (e.target === backdrop) backdrop.classList.add("hidden");
    });
  });

  // Bottom navigation bar
  document.querySelectorAll(".bnav-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".bnav-item").forEach(b => b.classList.remove("active"));
      item.classList.add("active");
      const target = item.dataset.target;
      if (target === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (target === "hours") {
        scrollToDetails();
      } else if (target === "weather") {
        renderWeatherModalContent();
        renderCityList(VIETNAM_CITIES);
        openModal("weatherModal");
      } else if (target === "converter") {
        document.getElementById("convDay").value = state.selectedDate.day;
        document.getElementById("convMonth").value = state.selectedDate.month;
        document.getElementById("convYear").value = state.selectedDate.year;
        openModal("converterModal");
      } else if (target === "settings") {
        openBirthYearModal();
      }
    });
  });

  // Keyboard navigation
  document.addEventListener("keydown", e => {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.key === "ArrowLeft") shiftSelectedDate(-1);
    else if (e.key === "ArrowRight") shiftSelectedDate(1);
    else if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.add("hidden"));
    }
  });
}

function registerPWA() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Service worker registration skipped in unsupported environments
    });
  }
}

/* ==================== BOOTSTRAP ==================== */

setupQuickBirthYears();
setupConverterModal();
bindEvents();
renderAll();
initWeather();
registerPWA();

// Cập nhật lại mốc "Đang diễn ra" mỗi 60 giây
setInterval(() => {
  if (isSameDay(state.selectedDate, getTodayObj())) {
    renderHeroAndDetails();
  }
}, 60000);
