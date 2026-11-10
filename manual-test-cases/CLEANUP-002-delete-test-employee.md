# CLEANUP-002 — Xóa employee test

| Trường | Nội dung |
|---|---|
| Feature | Cleanup |
| Priority | High |
| Loại coverage | Manual coverage mới |
| Trạng thái | Not Run |

## Tiền điều kiện

- User test đã xóa.
- Leave records/entitlements đã được xử lý theo `LEAVE-003`.

## Dữ liệu test

Employee ID/tên mang tiền tố `E2E-MANUAL-`.

## Bước thực hiện

1. Trong PIM Employee List, tìm employee test bằng ID/tên chính xác.
2. Xóa employee và xác nhận.
3. Tìm lại để xác minh không còn kết quả.

## Kết quả mong đợi

Employee test không còn tồn tại. Nếu bị chặn do Leave data còn liên kết, ghi Blocked, xử lý các record test còn lại rồi thử lại.

## Cleanup

Hoàn tất cleanup phiên.

## Notes / Evidence

<!-- Ghi Employee ID, bằng chứng xóa hoặc lý do Fail/Blocked. -->
