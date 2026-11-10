# PIM-002 — Tìm kiếm và cập nhật employee test

| Trường | Nội dung |
|---|---|
| Feature | PIM / Employee |
| Priority | Medium |
| Loại coverage | Manual coverage mới |
| Trạng thái | Not Run |

## Tiền điều kiện

- Employee từ `PIM-001` tồn tại.

## Dữ liệu test

- Employee ID/tên từ `PIM-001`.
- Một giá trị Phone hoặc Other ID mới.

## Bước thực hiện

1. Vào Employee List, tìm theo tên hoặc Employee ID.
2. Mở employee test.
3. Cập nhật một trường cơ bản không nhạy cảm và lưu.
4. Tải lại trang và tìm lại employee.

## Kết quả mong đợi

Employee được tìm đúng; cập nhật được lưu và vẫn hiển thị sau khi tải lại.

## Cleanup

Không cần hoàn tác trường test; xóa employee ở `CLEANUP-002`.

## Notes / Evidence

<!-- Ghi URL, thời điểm chạy, ảnh chụp hoặc lý do Fail/Blocked. -->
