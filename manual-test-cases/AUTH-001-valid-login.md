# AUTH-001 — Đăng nhập bằng credential hợp lệ

| Trường | Nội dung |
|---|---|
| Feature | Login |
| Priority | High |
| Loại coverage | Automation hiện có |
| Trạng thái | Not Run |

## Tiền điều kiện

- Đã logout và đang ở `/auth/login`.
- Có tài khoản Admin hợp lệ qua `E2E_USERNAME` và `E2E_PASSWORD`.

## Dữ liệu test

Credential Admin hợp lệ từ environment. Không ghi mật khẩu vào kết quả test.

## Bước thực hiện

1. Nhập username và password hợp lệ.
2. Chọn **Login**.

## Kết quả mong đợi

Chuyển đến Dashboard; heading **Dashboard** và sidebar hiển thị.

## Cleanup

Logout cuối flow nếu không chạy case sau.

## Notes / Evidence

<!-- Ghi URL, thời điểm chạy, ảnh chụp hoặc lý do Fail/Blocked. -->
