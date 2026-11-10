# PIM-001 — Tạo employee test

| Trường | Nội dung |
|---|---|
| Feature | PIM / Employee |
| Priority | High |
| Loại coverage | Manual coverage mới |
| Trạng thái | Not Run |

## Tiền điều kiện

- Đăng nhập Admin.
- Chưa có employee mang mã test.

## Dữ liệu test

- First Name: `E2E-MANUAL-<YYYYMMDD>-<initials>`
- Last Name: `Employee`

## Bước thực hiện

1. Vào PIM → Add Employee.
2. Nhập tên bắt buộc và lưu.
3. Lưu Employee ID do hệ thống hiển thị.

## Kết quả mong đợi

Thông báo lưu thành công; trang Personal Details hiển thị; Employee ID được tạo.

## Cleanup

Giữ employee cho các flow sau; xóa ở `CLEANUP-002`.

## Notes / Evidence

<!-- Ghi Employee ID, URL, thời điểm chạy, ảnh chụp hoặc lý do Fail/Blocked. -->
