# Tổng quan repository: OrangeHRM Playwright E2E

## 1. Mục đích

Repository này là một framework E2E tái sử dụng, viết bằng **TypeScript** và **Playwright Test**. Site adapter hiện tại là [OrangeHRM demo](https://opensource-demo.orangehrmlive.com), với coverage cho các luồng Login, Dashboard, PIM, Admin, Leave, Directory và cleanup dữ liệu test.

Framework được thiết kế để test spec chỉ thể hiện business flow; locator và thao tác UI được tách riêng để dễ bảo trì khi UI thay đổi.

## 2. Tech stack

| Thành phần | Vai trò |
| --- | --- |
| Node.js + TypeScript | Runtime và type safety |
| Playwright Test | E2E runner, assertion, fixture, trace, video và screenshot |
| dotenv | Đọc cấu hình/credential từ environment |
| Chromium | Browser project duy nhất được cấu hình |
| HTML reporter + `TerminalReporter` | Báo cáo HTML và log `test.step()` rõ ràng trên terminal |

## 3. Kiến trúc

```text
tests/<site>/*.spec.ts
        │ gọi fixture và business flow
        ▼
src/fixtures/
        │ tạo Step object gắn với Page riêng của từng test
        ▼
src/sites/<site>/steps/
        │ điều phối business flow và test.step()
        ▼
src/sites/<site>/pages/
        │ thao tác UI và assertion theo màn hình
        ▼
src/sites/<site>/elements/
        │ khai báo locator
```

Các lớp dùng chung nằm trong `src/core`:

- `BasePage`: primitive cho thao tác UI và assertion dùng lại.
- `BaseSteps`: chạy business step, đồng thời nhận `StepRunner` để xuất hiện nested `test.step()` trong report.
- `terminalLog`: helper chuẩn hóa terminal log, bao gồm che một số giá trị nhạy cảm phổ biến.

`OrangeHrmSteps` tập hợp page objects cho Login, Dashboard, PIM, Admin, Leave và Directory. Mỗi instance nhận đúng `Page` của test hiện tại; vì vậy không sử dụng `Page` global hoặc singleton Step và có thể chạy nhiều worker khi dữ liệu test được cô lập.

## 4. Fixtures và authentication

- `src/fixtures/orangehrm.ts` export fixture `orangeHrm`, tạo `OrangeHrmSteps` theo từng test.
- `src/fixtures/authenticated.ts` mở rộng fixture trên bằng `authenticatedOrangeHrm`; fixture này login ngay trong browser context của test trước khi yield Step object.
- Repository không dùng `globalSetup`. Chạy một spec hoặc lọc bằng `--grep` không tạo browser phụ chỉ để chuẩn bị session.

Credential chỉ được đọc qua `E2E_USERNAME` và `E2E_PASSWORD`; không ghi credential vào source hay tài liệu.

## 5. Test coverage hiện có

| Nhóm | Spec/luồng chính |
| --- | --- |
| Login & Dashboard | Render form, login hợp lệ/không hợp lệ, dashboard smoke flow |
| PIM | Tạo, tìm, cập nhật nhân viên cô lập |
| Admin | Tạo/tìm ESS user, login bằng ESS user và kiểm tra quyền Admin |
| Leave | Thêm entitlement, apply/cancel leave, approve/cancel leave |
| Directory | Tìm nhân viên test trong Directory |
| Cleanup | Xóa đúng employee hoặc user được tạo bởi test |

Các case tạo dữ liệu dùng pattern `E2E-MANUAL-*` và helper trong `tests/orangehrm/support/` để tránh tác động dữ liệu mẫu không liên quan. Các case `@manual` là automation được viết theo manual test case; không có nghĩa là chúng chỉ chạy thủ công.

## 6. Cấu hình runtime

`playwright.config.ts` cấu hình:

- test directory là `tests/`, project là Chromium desktop.
- screenshot khi fail, video giữ lại khi fail.
- trace giữ lại khi fail; đặt `PW_RETAIN_TRACE=true` để giữ trace cho toàn bộ test.
- HTML reporter không tự mở browser, kèm custom terminal reporter.

Các biến trong `.env.example`:

| Biến | Mục đích | Default local |
| --- | --- | --- |
| `BASE_URL` | URL OrangeHRM mục tiêu | `https://opensource-demo.orangehrmlive.com` |
| `E2E_USERNAME`, `E2E_PASSWORD` | Credential bắt buộc cho case cần login | Không có default hợp lệ |
| `PW_HEADLESS` | Chạy browser ẩn/hiện | `false` (CI là headless) |
| `PW_WORKERS` | Số worker | `1` |
| `PW_FULLY_PARALLEL` | Bật parallel toàn phần | `false` |
| `PW_RETRIES` | Số lần retry | `0` local, `2` ở CI nếu không override |
| `PW_RETAIN_TRACE` | Giữ trace cả khi pass | `false` |

Default local ưu tiên chạy tuần tự vì một số flow tạo và xóa dữ liệu. Chỉ tăng worker/parallel khi xác nhận dữ liệu test được cô lập.

## 7. Cài đặt và chạy

```bash
npm install
npx playwright install chromium
cp .env.example .env
# Điền E2E_USERNAME và E2E_PASSWORD vào .env
npm run typecheck
npm run test:smoke
```

Các lệnh thường dùng:

```bash
npm test                                      # Chromium suite
npm run test:sequential                       # 1 worker, không fully parallel
npm run test:parallel                         # 4 workers, fully parallel
npm run test:single -- tests/orangehrm/login.spec.ts
npm run test:single -- --grep "TEST-0002"
npm run test:headed
npm run test:ui
npm run test:debug
npm run test:report                           # Mở HTML report sau khi đã chạy test
```

## 8. Quy ước khi mở rộng framework

1. Tạo `elements`, `pages`, `steps` và `tests` dưới thư mục tên site tương ứng.
2. Giữ locator trong Elements; không đặt thao tác UI ở đây.
3. Giữ thao tác và assertion theo màn hình trong Pages.
4. Đặt business flow có ý nghĩa với người đọc test trong Steps và dùng `test.step()` qua fixture.
5. Để spec gọi Step methods thay vì thao tác Page trực tiếp.
6. Tạo fixture page-scoped cho Step object mới; không dùng global state.
7. Ưu tiên locator theo role, label, placeholder, sau đó mới đến CSS ổn định. Xác minh tính duy nhất của locator trước khi dùng.
8. Dùng web-first assertion và observable UI state; không dùng hard wait cho business flow.
9. Mỗi test tự chuẩn bị và cleanup dữ liệu của mình, không phụ thuộc thứ tự chạy.

## 9. Giới hạn cần lưu ý

- `npx playwright test --list` hoặc `npm run typecheck` chỉ xác nhận discovery/typecheck; chúng không chứng minh browser, credential hoặc OrangeHRM runtime đang hoạt động.
- Kết quả E2E phụ thuộc vào credential được cấp, trạng thái của OrangeHRM demo và quyền chạy Chromium trong môi trường hiện tại.
- Artifact (trace, video, screenshot và HTML report) là bằng chứng cần kiểm tra khi phân loại lỗi test hay lỗi môi trường.
