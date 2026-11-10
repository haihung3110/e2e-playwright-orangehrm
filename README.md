# Playwright TypeScript E2E Framework

Framework E2E TypeScript tái sử dụng, hiện có site adapter đầu tiên cho OrangeHRM. Test chỉ đọc credential qua environment; không đưa secrets vào Git.

## Cài đặt và chạy

```bash
npm install
npx playwright install chromium
cp .env.example .env
npm run typecheck
npm run test:smoke
```

Scripts hữu ích: `npm test` và `npm run test:all` (Chromium), `npm run test:sequential` (một test tại một thời điểm), `npm run test:parallel` (tối đa bốn worker), `npm run test:headed`, `npm run test:ui`, `npm run test:debug`, và `npm run test:report`.

Chạy một test spec: `npm run test:single -- tests/orangehrm/login.spec.ts`. Chạy một test theo ID: `npm run test:single -- --grep "TEST-0002"`. Terminal reporter sẽ in từng `test.step()` với trạng thái, thời lượng và lỗi (nếu có); HTML report vẫn được tạo bình thường.

Với API test, import `printPrettyDescription` từ `src/core/terminalLog` để in log đồng nhất và che các giá trị nhạy cảm phổ biến:

```ts
printPrettyDescription('Create employee', true, '/api/v2/employees');
// Terminal: API: Create employee :: /api/v2/employees
```

Đặt `LOG_LEVEL=verbose` để vẫn in các log đã truyền `loggingEnabled` là `false`.

Mặc định local mở Chromium (`PW_HEADLESS=false`) và chạy tuần tự (`PW_WORKERS=1`) để phù hợp luồng có dữ liệu tạo/xóa. CI tự chạy headless. Không cần cài Firefox/WebKit vì config chỉ còn project Chromium. Thay đổi các biến `PW_HEADLESS`, `PW_WORKERS`, `PW_FULLY_PARALLEL`, `PW_RETRIES`, và `PW_RETAIN_TRACE` trong `.env` khi cần.

Biến bắt buộc khi chạy test có login: `E2E_USERNAME`, `E2E_PASSWORD`. `BASE_URL` có mặc định OrangeHRM demo. Trong GitHub Actions, cấu hình hai credentials bằng repository secrets và (tùy chọn) `BASE_URL` bằng repository variable.

## Cấu trúc và cách thêm site mới

- `src/core`: primitives dùng chung: `BasePage` cho UI actions/assertions và `BaseSteps` cho business-flow/report steps.
- `src/config`: environment contract (`env.ts`) và runtime switches Playwright (`runtime.ts`).
- `src/fixtures`: page-scoped fixtures. `orangeHrm` cung cấp step object cho trang mới; `authenticatedOrangeHrm` đăng nhập trong chính test cần session.
- `src/sites/<site>/elements`: locator của từng màn hình, không chứa thao tác.
- `src/sites/<site>/pages`: page objects thao tác UI qua elements.
- `src/sites/<site>/steps`: business steps; mỗi instance nhận `Page` của riêng test và tạo `test.step()` trong report.
- `tests/<site>`: test specs theo website/feature.

Để thêm website mới, tạo `elements`, `pages`, `steps` và tests trong các thư mục tên site tương ứng. Tạo fixture mới để inject một Step object được gắn với `page`; không dùng `Page` global hay singleton Step vì chúng không an toàn khi có nhiều worker. Dùng locator theo thứ tự ưu tiên: role, label, placeholder, rồi locator CSS ổn định. Spec chỉ gọi hàm Step, còn Page chỉ chịu trách nhiệm thao tác UI. Mỗi test phải tự thiết lập trạng thái cần thiết và không phụ thuộc vào thứ tự chạy.

Không dùng `globalSetup`, nên lệnh chạy một test không mở thêm browser để chuẩn bị session. Các test cần session dùng `authenticatedOrangeHrm` và tự đăng nhập trong browser của chính test đó.
