# ADMIN-002 — Đăng nhập và xác minh quyền user test

| Trường | Nội dung |
|---|---|
| Feature | Admin / User Management |
| Priority | High |
| Loại coverage | Manual coverage mới |
| Trạng thái | Not Run |

## Tiền điều kiện

- User test từ `ADMIN-001` tồn tại.

## Dữ liệu test

Username/password tạm thời từ `ADMIN-001`.

## Bước thực hiện

1. Logout Admin.
2. Đăng nhập bằng user test.
3. Xác minh Dashboard tải và các menu/quyền phù hợp role.
4. Logout, đăng nhập lại bằng Admin.

## Kết quả mong đợi

User test đăng nhập được; không có quyền Admin nếu role không phải Admin; Admin có thể đăng nhập lại.

## Cleanup

Xóa user ở `CLEANUP-001`.

## Notes / Evidence

<!-- Ghi URL, thời điểm chạy, ảnh chụp hoặc lý do Fail/Blocked. Không ghi password. -->
