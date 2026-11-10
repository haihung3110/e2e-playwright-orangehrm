# AUTH-002 — Từ chối credential không hợp lệ

| Trường | Nội dung |
|---|---|
| Feature | Login |
| Priority | High |
| Loại coverage | Automation hiện có |
| Trạng thái | Not Run |

## Tiền điều kiện

- Đã logout và đang ở trang Login.

## Dữ liệu test

`invalid-user` / `invalid-password`

## Bước thực hiện

1. Nhập credential không hợp lệ.
2. Chọn **Login**.

## Kết quả mong đợi

Thông báo **Invalid credentials** hiển thị; vẫn ở URL Login; không tạo phiên đăng nhập.

## Cleanup

Không có.

## Notes / Evidence

<!-- Ghi URL, thời điểm chạy, ảnh chụp hoặc lý do Fail/Blocked. -->
