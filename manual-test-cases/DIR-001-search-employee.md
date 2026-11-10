# DIR-001 — Tìm kiếm employee trong Directory

| Trường | Nội dung |
|---|---|
| Feature | Directory |
| Priority | Medium |
| Loại coverage | Manual coverage mới |
| Trạng thái | Not Run |

## Tiền điều kiện

- Employee test từ `PIM-001` đang active.
- Directory được bật.

## Dữ liệu test

Tên employee test; Job Title/Location nếu đã gán và có trong UI.

## Bước thực hiện

1. Vào Directory.
2. Tìm theo tên employee test.
3. Nếu filter có dữ liệu, tìm tiếp bằng Job Title và Location.
4. Mở kết quả employee.

## Kết quả mong đợi

Kết quả trả đúng employee test; không trả employee không khớp. Filter Job Title/Location chỉ xác nhận khi dữ liệu đã tồn tại; nếu không có, ghi Blocked thay vì sửa dữ liệu mẫu.

## Cleanup

Không có; employee xóa ở `CLEANUP-002`.

## Notes / Evidence

<!-- Ghi URL, thời điểm chạy, ảnh chụp hoặc lý do Fail/Blocked. -->
