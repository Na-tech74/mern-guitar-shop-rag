# Backend - Nam Acoustic Guitar Shop API

## Giới thiệu

Backend REST API cho website bán đàn guitar **Nam Acoustic**, xây dựng bằng **Node.js + Express 5** và **MongoDB (Mongoose 9)**. Hỗ trợ quản lý sản phẩm, danh mục, đơn hàng, người dùng, blog, khóa học, nội dung trang chủ/giới thiệu/footer/liên hệ và xác thực JWT dual-token.

## Công nghệ sử dụng

| Công nghệ | Mục đích |
|-----------|----------|
| **Express 5** | Web framework |
| **Mongoose 9** | MongoDB ODM |
| **JWT (access + refresh token)** | Xác thực |
| **bcryptjs** | Mã hóa mật khẩu |
| **Cloudinary** | Lưu trữ & tối ưu hình ảnh/video |
| **Multer** | Upload file |
| **Nodemailer** | Gửi email (Gmail SMTP) |
| **express-rate-limit** | Giới hạn tần suất request |
| **helmet** | Bảo mật HTTP headers |
| **cors + cookie-parser** | CORS & cookie |
| **compression** | Nén response (gzip) |
| **morgan** | Log request |
| **dotenv** | Biến môi trường |

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── server.js                  # Entry point (kết nối DB, khởi động server)
│   ├── app.js                     # Cấu hình Express app (tách riêng để dễ test)
│   ├── config/
│   │   ├── db.config.js           # Kết nối MongoDB
│   │   ├── cloudinary.config.js    # Cấu hình Cloudinary
│   │   └── middleware.config.js   # Global middleware (helmet, cors, rate-limit...)
│   ├── middleware/
│   │   ├── auth.middleware.js      # Xác thực JWT, phân quyền (protect, adminOnly)
│   │   ├── error.middleware.js     # Xử lý lỗi tập trung
│   │   ├── upload.middleware.js    # Multer upload (ảnh + video)
│   │   ├── sanitize.middleware.js  # Chống MongoDB injection ($, .)
│   │   ├── notFound.middleware.js  # Bắt route 404
│   │   └── asyncHandler.js        # Bọc async handler
│   ├── models/
│   │   ├── users.model.js         # Người dùng
│   │   ├── product.model.js       # Sản phẩm
│   │   ├── categories.model.js    # Danh mục
│   │   ├── blogs.model.js         # Bài viết
│   │   ├── order.model.js         # Đơn hàng + OrderItem
│   │   ├── course.model.js        # Khóa học + Lesson
│   │   ├── homeContent.model.js   # Nội dung trang chủ (singleton)
│   │   ├── aboutContent.model.js  # Nội dung trang giới thiệu (singleton)
│   │   ├── footerContent.model.js # Nội dung footer (singleton)
│   │   └── contactContent.model.js# Nội dung trang liên hệ (singleton)
│   ├── routers/                   # Định tuyến
│   │   ├── index.js               # Mount tất cả routes
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── categories.routes.js
│   │   ├── product.routes.js
│   │   ├── blog.routes.js
│   │   ├── order.routes.js
│   │   ├── course.routes.js
│   │   ├── homeContent.routes.js
│   │   ├── aboutContent.routes.js
│   │   ├── footerContent.routes.js
│   │   └── contactContent.routes.js
│   ├── controller/                # Xử lý nghiệp vụ
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── products.controller.js
│   │   ├── categories.controller.js
│   │   ├── blog.controller.js
│   │   ├── order.controller.js
│   │   ├── course.controller.js
│   │   ├── homeContent.controller.js
│   │   ├── aboutContent.controller.js
│   │   ├── footerContent.controller.js
│   │   └── contactContent.controller.js
│   ├── services/
│   │   ├── generateToken.js       # Tạo JWT access + refresh
│   │   ├── sendEmail.js           # Gửi email (Gmail SMTP)
│   │   ├── uploadImages.js        # Upload ảnh lên Cloudinary
│   │   └── uploadVideos.js        # Upload video lên Cloudinary
│   └── utils/
│       ├── appResponse.js         # Response/Error helpers (appSuccess, appError)
│       ├── valid.js               # Validation helpers
│       ├── format.js              # Format dữ liệu
│       └── cookier.js             # Cookie helpers
└── .env                           # Biến môi trường
```

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/register` | Đăng ký tài khoản (rate-limited) |
| POST | `/login` | Đăng nhập (rate-limited) |
| POST | `/logout` | Đăng xuất |
| POST | `/refresh` | Refresh access token (rate-limited) |
| POST | `/password/forgot` | Gửi OTP quên mật khẩu (rate-limited) |
| POST | `/password/reset` | Đặt lại mật khẩu với OTP (rate-limited) |

### Users (`/api/users`)

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| GET | `/me` | User | Lấy thông tin cá nhân |
| PUT | `/me` | User | Cập nhật thông tin cá nhân |
| POST | `/me/avatar` | User | Upload avatar |
| DELETE | `/me/avatar` | User | Xóa avatar |
| PUT | `/password` | User | Đổi mật khẩu (rate-limited) |
| GET | `/` | Admin | Danh sách người dùng |
| GET | `/:id` | Admin | Chi tiết người dùng |
| PUT | `/:id` | Admin | Cập nhật người dùng |
| DELETE | `/:id` | Admin | Xóa người dùng |

### Categories (`/api/categories`)

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| GET | `/` | Public | Danh sách danh mục (đang hoạt động) |
| GET | `/:id` | Public | Chi tiết danh mục |
| POST | `/create` | Admin | Tạo danh mục (có ảnh) |
| PUT | `/:id` | Admin | Cập nhật danh mục |
| DELETE | `/:id` | Admin | Xóa danh mục |

### Products (`/api/products`)

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| GET | `/` | Public | Danh sách sản phẩm (phân trang, lọc, tìm kiếm) |
| GET | `/top` | Public | Sản phẩm nổi bật |
| GET | `/:id` | Public | Chi tiết sản phẩm |
| POST | `/` | Admin | Tạo sản phẩm (tối đa 5 ảnh) |
| POST | `/upload-images/:id` | Admin | Upload ảnh cho sản phẩm |
| PUT | `/:id` | Admin | Cập nhật sản phẩm |
| DELETE | `/:id` | Admin | Xóa sản phẩm |

### Blogs (`/api/blogs`)

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| GET | `/` | Public | Danh sách bài viết |
| GET | `/:id` | Public | Chi tiết bài viết |
| POST | `/` | Admin | Tạo bài viết (có banner) |
| PUT | `/:id` | Admin | Cập nhật bài viết |
| DELETE | `/:id` | Admin | Xóa bài viết |

### Orders (`/api/orders`)

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| POST | `/` | User | Tạo đơn hàng từ giỏ hàng |
| GET | `/me` | User | Lịch sử đơn hàng cá nhân |
| GET | `/stats` | Admin | Thống kê dashboard |
| GET | `/` | Admin | Danh sách đơn hàng (phân trang, lọc trạng thái) |
| GET | `/:id` | User/Admin | Chi tiết đơn hàng |
| PUT | `/:id/status` | Admin | Cập nhật trạng thái đơn hàng |
| DELETE | `/:id` | Admin | Xóa đơn hàng |

### Courses (`/api/courses`)

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| GET | `/published` | Public | Khóa học đã xuất bản |
| GET | `/slug/:slug` | Public | Chi tiết khóa học theo slug |
| GET | `/` | Admin | Tất cả khóa học |
| GET | `/:id` | User | Chi tiết khóa học (bao gồm chưa xuất bản) |
| POST | `/` | Admin | Tạo khóa học (có thumbnail) |
| PUT | `/:id` | Admin | Cập nhật khóa học |
| DELETE | `/:id` | Admin | Xóa khóa học |

### Home Content (`/api/home-content`)

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| GET | `/` | Public | Lấy nội dung trang chủ (singleton) |
| PUT | `/` | Admin | Cập nhật nội dung trang chủ |
| POST | `/upload` | Admin | Upload ảnh (carousel, featuredTypes...) |
| POST | `/upload-video` | Admin | Upload video (clip khuyến mãi) |

### Footer Content (`/api/footer-content`)

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| GET | `/` | Public | Lấy nội dung footer (singleton) |
| PUT | `/` | Admin | Cập nhật nội dung footer |

### Contact Content (`/api/contact-content`)

| Method | Endpoint | Quyền | Mô tả |
|--------|----------|-------|-------|
| GET | `/` | Public | Lấy nội dung trang liên hệ (singleton) |
| PUT | `/` | Admin | Cập nhật nội dung trang liên hệ |

## Health Check

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Server health check |
| GET | `/api/health` | Kiểm tra trạng thái server + DB + uptime |

## Xác thực & Bảo mật

- **JWT dual-token**: Access token (15 phút) + Refresh token (7 ngày)
- Refresh token lưu trong **httpOnly cookie** (bảo vệ XSS)
- Cookie có `secure` + `sameSite: strict` ở production (chống CSRF)
- **Refresh token rotation**: cấp token mới mỗi lần refresh
- Mật khẩu **bcrypt** 10 rounds
- **Rate limiting** trên các endpoint nhạy cảm (auth, đổi mật khẩu) - bỏ qua cho admin
- **Phân quyền** qua middleware `protect` + `adminOnly`
- Chống **MongoDB injection** (`$`, `.`) qua `sanitize.middleware.js` (tự viết cho Express 5)
- **helmet** bảo vệ HTTP headers
- **CORS** whitelist qua biến môi trường `CORS_ORIGIN`
- **Global rate limit**: 100 request / 15 phút

## Lưu ý Express 5

- Dự án sử dụng **Express 5** (thay vì Express 4) - framework beta đã release chính thức.
- Một số middleware cũ (ví dụ `express-mongo-sanitize`) chưa tương thích Express 5 do `req.query` là read-only getter → đã tự viết `sanitize.middleware.js`.
- `app.use(express.json())` hoạt động bình thường, không cần body-parser riêng.

## Cài đặt & Chạy

```bash
# Clone và di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env với các biến:
# PORT=5000
# MONGO_URL=mongodb://localhost:27017/Guitar_Shop
# JWT_ACCESS_SECRET=...
# JWT_REFRESH_SECRET=...
# EMAIL_USER=...
# EMAIL_PASS=...
# CLOUDINARY_CLOUD_NAME=...
# CLOUDINARY_API_KEY=...
# CLOUDINARY_API_SECRET=...
# CORS_ORIGIN=http://localhost:5173,http://localhost:5174

# Chạy development
npm run dev

# Chạy production
npm start
```

## Tài liệu chi tiết

Xem thêm trong thư mục `docs/backend/`:

| File | Mô tả |
|------|-------|
| `api.md` | API endpoints chi tiết (params, body, response, errors) |
| `middleware.md` | Auth (protect, adminOnly, rate limit), error handler, upload, asyncHandler |
| `models.md` | 11 Mongoose models (Users, Product, Category, Blog, Order, Course, HomeContent, AboutContent, FooterContent, ContactContent) |
| `services.md` | generateToken, sendEmail, uploadImages, uploadVideos |
| `utils.md` | appResponse, valid, format, cookier |
| `config.md` | Kết nối DB, cấu hình Cloudinary, global middleware |
| `controllers.md` | Chi tiết 11 controllers (logic, validation, errors) |

## Môi trường

- **Node.js**: >= 18
- **MongoDB**: Local instance (mặc định `mongodb://localhost:27017/Guitar_Shop`)
- **Cổng**: 5000 (mặc định)
