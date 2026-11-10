# LEAVE-002 — Gửi yêu cầu nghỉ phép

| Trường | Nội dung |
|---|---|
| Feature | Leave |
| Priority | High |
| Loại coverage | Manual coverage mới |
| Trạng thái | Not Run |

## Tiền điều kiện

- Entitlement từ `LEAVE-001` còn đủ.
- Có thể login ESS user hoặc dùng Apply Leave cho employee test theo cấu hình môi trường.

## Dữ liệu test

Leave Type và ngày tương lai từ `LEAVE-001`.

## Bước thực hiện

1. Đăng nhập employee test nếu có ESS user; nếu không, thực hiện theo khả năng môi trường và ghi Blocked.
2. Vào Leave → Apply, chọn Leave Type và ngày.
3. Gửi request.

## Kết quả mong đợi

Request được gửi; status ban đầu (ví dụ Pending Approval) và số ngày hiển thị đúng; balance cập nhật theo workflow.

## Cleanup

Giữ request cho `LEAVE-003`.

## Notes / Evidence

<!-- Ghi workflow, giới hạn môi trường, ảnh chụp hoặc lý do Fail/Blocked. -->
