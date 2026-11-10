# LEAVE-001 — Cấp leave entitlement cho employee test

| Trường | Nội dung |
|---|---|
| Feature | Leave |
| Priority | High |
| Loại coverage | Manual coverage mới |
| Trạng thái | Not Run |

## Tiền điều kiện

- Admin đăng nhập.
- Employee test từ `PIM-001` tồn tại.
- Có một Leave Type sẵn có.

## Dữ liệu test

Employee test; Leave Type sẵn có; entitlement nhỏ; ngày nghỉ tương lai không trùng lịch.

## Bước thực hiện

1. Vào Leave → Entitlements → Add Entitlement.
2. Chọn employee, Leave Type, nhập số ngày và lưu.
3. Xác nhận balance tăng.

## Kết quả mong đợi

Entitlement được tạo; balance của employee phản ánh số ngày đã cấp.

## Cleanup

Giữ entitlement cho `LEAVE-002` và `LEAVE-003`.

## Notes / Evidence

<!-- Ghi Leave Type, ngày, balance, ảnh chụp hoặc lý do Fail/Blocked. -->
