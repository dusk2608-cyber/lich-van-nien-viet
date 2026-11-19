# Vận Ký — Lịch Vạn Niên Việt Nam & Thời Tiết Thực Tế

Ứng dụng web **Lịch Vạn Niên Việt Nam (Âm - Dương lịch)** kết hợp **Giờ Hoàng Đạo / Hắc Đạo**, **Phong Thủy theo tuổi gia chủ**, và **Thời Tiết Thực Tế theo vị trí GPS** theo phong cách thẩm mỹ Á Đông cổ truyền (giấy dó kem ấm, tranh thủy mặc, dấu triện đỏ). Hỗ trợ Responsive Mobile-first và **PWA**.

## Tính năng chính

- **Thuật toán Âm lịch Việt Nam chuẩn GMT+7 (1900–2100):** Thuật toán Hồ Ngọc Đức kết hợp tính điểm Sóc chính xác cao (Jean Meeus), hỗ trợ đầy đủ tháng nhuận, Can Chi (Năm/Tháng/Ngày/Giờ), 24 Tiết khí, Ngày Hoàng Đạo / Hắc Đạo (12 Thần Sát) và 12 Trực.
- **Tiêu điểm Ngày & Bảng Lịch Tháng trực quan:** Vòng tròn cọ vẽ mực đỏ, cuộn thư Âm lịch, đánh dấu Mùng 1 & Rằm (15), chọn năm sinh gia chủ để làm nổi bật ngày hợp tuổi (xanh ngọc bích) và ngày xung/xấu (đỏ nháy nhẹ), kèm Ca dao – Tục ngữ thay đổi theo ngày.
- **Chi tiết 12 Canh Giờ & Phong Thủy:** Liệt kê đủ 12 canh giờ (`Tý` đến `Hợi`) với Can Chi giờ, sao tốt/xấu, làm nổi bật khung giờ đang diễn ra; hiển thị Ngũ Hành Nạp Âm, Hướng xuất hành (`Hỷ Thần`, `Tài Thần`), Việc nên làm và Việc kiêng kỵ.
- **Thời Tiết Thực Tế (Geolocation + Open-Meteo):** Tự động lấy vị trí GPS + Reverse Geocoding tiếng Việt hoặc chọn/tìm kiếm thủ công các tỉnh thành Việt Nam; hiển thị nhiệt độ, trạng thái thời tiết, độ ẩm, gió và dự báo 5 ngày không cần API key.
- **Đổi ngày Âm ↔ Dương & PWA:** Tra cứu chuyển đổi hai chiều (bao gồm tháng nhuận) và hỗ trợ cài đặt ra màn hình chính điện thoại (`manifest.json` + `sw.js`).

## Chạy thử cục bộ & Kiểm thử

```bash
# Chạy kiểm thử thuật toán Âm lịch
node tests/verify-lunar.mjs

# Khởi chạy máy chủ tĩnh bất kỳ (ví dụ với Node / Python / Live Server)
npx serve .
```
