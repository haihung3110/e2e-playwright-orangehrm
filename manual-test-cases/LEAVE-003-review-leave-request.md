# LEAVE-003 — Duyệt hoặc từ chối yêu cầu nghỉ phép

| Trường | Nội dung |
|---|---|
| Feature | Leave |
| Priority | High |
| Loại coverage | Manual coverage mới |
| Trạng thái | Not Run |

## Tiền điều kiện

- Request từ `LEAVE-002` tồn tại.
- Admin đã đăng nhập.

## Dữ liệu test

Request của employee test.

## Bước thực hiện

1. Vào Leave List, lọc theo employee test.
2. Duyệt request; nếu workflow không hỗ trợ, từ chối request và ghi nhận.
3. Mở My Leave/Leave List để kiểm tra status và balance.

## Kết quả mong đợi

Trạng thái chuyển đúng theo action (Approved hoặc Rejected); balance/status nhất quán trên các màn hình liên quan.

## Cleanup

Xóa/cancel leave record và entitlement còn lại nếu UI/chính sách môi trường cho phép.

## Notes / Evidence

<!-- Ghi action, trạng thái cuối, ảnh chụp hoặc lý do Fail/Blocked. -->
