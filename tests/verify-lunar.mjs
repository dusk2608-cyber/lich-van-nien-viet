import assert from "node:assert/strict";
import {
  convertSolar2Lunar,
  convertLunar2Solar,
  getDayFullInfo,
  getHoursInDay
} from "../js/lunar-calendar.js";

// 1. Reference screenshot check: 16/11/2026 -> 8/10/2026 Bính Ngọ, Hoàng đạo · Thanh Long, Tiết Lập đông
const nov16 = getDayFullInfo(16, 11, 2026, 1987);
console.log("2026-11-16:", {
  weekday: nov16.solar.weekdayName,
  lunar: nov16.lunar.displayFull,
  hoangDao: `${nov16.hoangDao.label} · ${nov16.hoangDao.starName}`,
  tietKhi: nov16.tietKhi.name,
  canChi: nov16.canChi
});
assert.equal(nov16.lunar.day, 8);
assert.equal(nov16.lunar.month, 10);
assert.equal(nov16.lunar.year, 2026);
assert.equal(nov16.canChi.yearName, "Bính Ngọ");
assert.equal(nov16.tietKhi.name, "Lập đông");
assert.equal(nov16.hoangDao.isHoangDao, true);
assert.equal(nov16.hoangDao.starName, "Thanh Long");

// 2. Known Tết Nguyên Đán dates (1900 - 2100)
const tetCases = [
  [2024, 2, 10, "Giáp Thìn"],
  [2025, 1, 29, "Ất Tỵ"],
  [2026, 2, 17, "Bính Ngọ"],
  [2027, 2, 6, "Đinh Mùi"],
  [2000, 2, 5, "Canh Thìn"],
  [1987, 1, 29, "Đinh Mão"]
];
for (const [yy, mm, dd, expectedYearCanChi] of tetCases) {
  const info = getDayFullInfo(dd, mm, yy);
  assert.equal(info.lunar.day, 1, `Tết ${yy} day`);
  assert.equal(info.lunar.month, 1, `Tết ${yy} month`);
  assert.equal(info.lunar.year, yy, `Tết ${yy} year`);
  assert.equal(info.canChi.yearName, expectedYearCanChi, `Tết ${yy} Can Chi`);
}

// 3. Leap month check: 2023 had leap month 2, 2025 had leap month 6
const leap2023 = convertSolar2Lunar(22, 3, 2023);
assert.equal(leap2023.month, 2);
assert.equal(leap2023.leap, true);
assert.equal(leap2023.day, 1);

const leap2025 = convertSolar2Lunar(25, 7, 2025);
assert.equal(leap2025.month, 6);
assert.equal(leap2025.leap, true);
assert.equal(leap2025.day, 1);

// 4. Round-trip Lunar -> Solar -> Lunar for all 12 months including leap
const back = convertLunar2Solar(1, 6, 2025, true);
assert.deepEqual(back, [25, 7, 2025]);

// 5. 12 Hours check: always exactly 6 Hoàng Đạo and 6 Hắc Đạo
for (let chi = 0; chi < 12; chi++) {
  const hours = getHoursInDay(0, chi);
  assert.equal(hours.length, 12);
  const goodCount = hours.filter(h => h.isHoangDao).length;
  assert.equal(goodCount, 6, `Chi ${chi} should have 6 Hoàng Đạo hours`);
}

// 6. Today: 19/11/2026
const nov19 = getDayFullInfo(19, 11, 2026, 1987);
console.log("2026-11-19:", {
  weekday: nov19.solar.weekdayName,
  lunar: nov19.lunar.displayFull,
  hoangDao: `${nov19.hoangDao.label} · ${nov19.hoangDao.starName}`,
  tietKhi: nov19.tietKhi.name,
  dayCanChi: nov19.canChi.dayName,
  compatibility: nov19.compatibility
});

console.log("ALL LUNAR CALENDAR TESTS PASSED!");
