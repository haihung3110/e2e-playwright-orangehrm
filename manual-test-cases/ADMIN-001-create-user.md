# ADMIN-001 — Tạo user liên kết employee test

| Trường | Nội dung |
|---|---|
| Feature | Admin / User Management |
| Priority | High |
| Loại coverage | Manual coverage mới |
| Trạng thái | Not Run |

## Tiền điều kiện

- Employee test từ `PIM-001` tồn tại.
- Admin đã đăng nhập.

## Dữ liệu test

- Username: `E2E-MANUAL-<YYYYMMDD>-<initials>-user`
- Password tạm thời phù hợp password policy.
- Role ESS/User được môi trường cho phép.

## Bước thực hiện

1. Vào Admin → User Management → Add.
2. Liên kết user với employee test, chọn role, nhập username/password và lưu.
3. Tìm lại user theo username.

## Kết quả mong đợi

User được tạo thành công, liên kết đúng employee và xuất hiện trong kết quả tìm kiếm.

## Cleanup

Giữ user cho `ADMIN-002`; xóa ở `CLEANUP-001`. Không ghi password vào Notes.

## Notes / Evidence

<!-- Ghi username, URL, thời điểm chạy, ảnh chụp hoặc lý do Fail/Blocked. Không ghi password. -->
