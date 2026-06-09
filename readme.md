# Nam Acoustic Guitar Shop

Hệ thống thương mại điện tử bán đàn guitar fullstack (MERN stack) với chatbot AI tư vấn sản phẩm sử dụng RAG (Retrieval-Augmented Generation).

## Kiến trúc hệ thống

```
User (Browser)
       │
       ▼
  Frontend (React 19 + Vite 8 + Tailwind CSS 3)
       │
       ├── Axios gọi REST API
       │        │
       │        ▼
       │   Backend (Express 5 + Mongoose 9)
       │        │
       │        ├── Auth (JWT dual-token)
       │        ├── Products / Categories / Orders
       │        ├── Users / Blog / Courses
       │        ├── HomeContent / AboutContent
       │        ▼
       │     MongoDB
       │
       └── Chat API (RAG - đang phát triển)
                │
                ▼
          Chat Service
                │
           ┌────┴────┐
           ▼         ▼
      Vector DB    LLM Model
     (FAISS)     (Mistral/OpenAI)
           │         │
           └── RAG ──┘
                │
                ▼
            Response
```

## Công nghệ sử dụng

### Frontend

| Công nghệ | Mục đích |
|-----------|----------|
| React 19 + Vite 8 | UI library & build tool |
| React Router DOM 7 | Định tuyến (lazy loading) |
| Axios | HTTP client (interceptor + refresh token queue) |
| Tailwind CSS 3 | Utility-first styling |
| FontAwesome 7 | Icon (solid + brands) |
| ESLint 10 | Kiểm tra code |

### Backend

| Công nghệ | Mục đích |
|-----------|----------|
| Express 5 | Web framework |
| Mongoose 9 | MongoDB ODM |
| JWT (access + refresh token) | Xác thực dual-token |
| bcryptjs | Mã hóa mật khẩu (10 rounds) |
| Cloudinary | Lưu trữ & tối ưu ảnh/video |
| Multer | Upload file (ảnh + video) |
| Nodemailer | Gửi email (Gmail SMTP) |
| express-rate-limit | Giới hạn request |
| helmet + compression + morgan | Bảo mật, nén gzip, log |

### AI / Chatbot (đang phát triển)

| Công nghệ | Mục đích |
|-----------|----------|
| RAG (Retrieval-Augmented Generation) | Tư vấn sản phẩm thông minh |
| FAISS | Vector database |
| Mistral / OpenAI | LLM model |
| Embedding model | Chuyển văn bản thành vector |

## Cấu trúc thư mục

```
/
├── backend/                    # REST API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── server.js           # Entry point (kết nối DB + khởi động server)
│   │   ├── app.js              # Express app (tách riêng để test)
│   │   ├── config/             # DB, Cloudinary, global middleware
│   │   ├── middleware/         # Auth, error, upload, sanitize, notFound, asyncHandler
│   │   ├── models/             # 8 Mongoose models
│   │   ├── routers/            # Route definitions (9 modules)
│   │   ├── controller/         # Business logic (9 controllers)
│   │   ├── services/           # generateToken, sendEmail, uploadImages, uploadVideos
│   │   └── utils/              # appResponse, valid, format, cookier
│   └── readme.md
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── main.jsx            # Entry point
│   │   ├── App.jsx             # Root + Router (lazy loading)
│   │   ├── api/                # Axios client + interceptors + 9 API modules
│   │   ├── components/         # 14 shared components
│   │   ├── hooks/              # 4 custom hooks
│   │   ├── helpers/            # Format utilities
│   │   ├── layouts/            # MainLayout, AdminLayout
│   │   └── pages/              # 14 page groups (14 user + 10 admin + 2 admin components + 10 admin hooks)
│   └── readme.md
│
├── docs/                       # Tài liệu chi tiết (đang cập nhật)
│
└── readme.md                   # (file này)
```

## Tính năng

### Người dùng (Shop)

- **Trang chủ**: Hero carousel (3 slides), banner tính năng, danh mục, sản phẩm nổi bật, clip quảng cáo, bộ sưu tập, CTA hỗ trợ
- **Sản phẩm**: Danh sách phân trang, lọc danh mục, sắp xếp, tìm kiếm, gallery ảnh
- **Giỏ hàng**: localStorage, thêm/sửa/xoá, mã giảm giá GUITAR10
- **Thanh toán**: Form địa chỉ, COD / chuyển khoản
- **Yêu thích**: localStorage, thêm/xoá/thêm tất cả vào giỏ
- **Khóa học**: Danh sách, chi tiết (video player + danh sách bài học động)
- **Blog**: Danh sách & chi tiết bài viết
- **Xác thực**: Đăng ký, đăng nhập, quên mật khẩu (OTP qua email)
- **Tài khoản**: Thông tin cá nhân, đổi mật khẩu, avatar, lịch sử đơn hàng
- **Tìm kiếm**: Tìm kiếm sản phẩm theo từ khóa (debounce)

### Quản trị (Admin)

- **Dashboard**: Thống kê (sản phẩm, users, đơn hàng), biểu đồ doanh thu 7 ngày, đơn hàng gần đây
- **Sản phẩm**: CRUD, upload nhiều ảnh, tìm kiếm
- **Danh mục**: CRUD, upload ảnh, bật/tắt trạng thái
- **Đơn hàng**: Lọc trạng thái, cập nhật workflow (pending → confirmed → shipping → delivered/cancelled)
- **Người dùng**: CRUD, phân quyền (user/admin)
- **Bài viết**: CRUD, upload banner
- **Khóa học**: CRUD, quản lý bài học động (thêm/xoá/sắp xếp), xuất bản/draft
- **Nội dung trang chủ**: Chỉnh sửa carousel, features, danh mục, sản phẩm nổi bật, clip, bộ sưu tập, CTA
- **Nội dung trang giới thiệu**: Chỉnh sửa story, stats, team, commitments
- **Cài đặt**: Thông tin cá nhân, đổi mật khẩu

### Chatbot AI (RAG) - đang phát triển

- Tư vấn sản phẩm dựa trên dữ liệu thực tế từ database
- Hỏi đáp kiến thức guitar
- Embedding + vector search (FAISS)
- Sinh câu trả lời bằng LLM (Mistral/OpenAI)

## Luồng dữ liệu

### Xác thực (JWT dual-token)

```
Login → Backend verify → Generate accessToken (15m) + refreshToken (7d)
  → accessToken lưu sessionStorage
  → refreshToken lưu httpOnly cookie
  → Request gắn Authorization: Bearer
  → 401 → Axios interceptor tự động gọi /auth/refresh → cấp token mới
```

### Giỏ hàng & Đặt hàng

```
User chọn sản phẩm → localStorage cart
  → Checkout → POST /api/orders
  → Backend validate stock, tính tổng tiền
  → Tạo Order + OrderItem trong MongoDB
  → Giảm stock sản phẩm
  → Xoá cart (localStorage)
```

### Quản lý nội dung (Singleton)

```
Admin chỉnh sửa → PUT /api/home-content (hoặc about-content)
  → Backend cập nhật document duy nhất
  → Frontend GET → render trang chủ / giới thiệu
```

### Chatbot RAG (kế hoạch)

```
User hỏi → Frontend gửi message → Chat Service
  → 1. Embed câu hỏi → vector
  → 2. Search FAISS → top-k documents
  → 3. Ghép context + question
  → 4. Gửi LLM (Mistral/OpenAI)
  → 5. Generate answer → response
```

## Cài đặt & Chạy

### Yêu cầu

- **Node.js** >= 18
- **MongoDB** (local hoặc cloud)
- **npm**

### Backend

```bash
cd backend
npm install
# Tạo file .env (xem backend/readme.md)
npm run dev       # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
# Tạo file .env: VITE_API_URL=/api
npm run dev       # http://localhost:5173 (proxy /api → backend)
```

### Biến môi trường

Xem chi tiết tại `backend/readme.md` và `frontend/readme.md`.

## Tài liệu liên quan

| File | Mô tả |
|------|-------|
| `backend/readme.md` | Chi tiết backend (API endpoints, models, middleware, security) |
| `frontend/readme.md` | Chi tiết frontend (components, hooks, routes, api modules) |
| `docs/architecture.md` | Kiến trúc hệ thống |
| `docs/deployment.md` | Hướng dẫn triển khai |
| `docs/development.md` | Hướng dẫn phát triển |
| `docs/rag.md` | Chatbot RAG |
| `docs/backend/api.md` | API endpoints chi tiết |
| `docs/backend/middleware.md` | Middleware |
| `docs/backend/models.md` | Database models |
| `docs/backend/services.md` | Services |
| `docs/backend/utils.md` | Utilities |
| `docs/backend/config.md` | Cấu hình |
| `docs/backend/controllers.md` | Controllers |
| `docs/frontend/components.md` | Components |
| `docs/frontend/layouts.md` | Layouts |
| `docs/frontend/api-client.md` | Axios client |
| `docs/frontend/helpers.md` | Helper functions |
| `docs/frontend/hooks.md` | Custom hooks |
| `docs/frontend/pages.md` | Pages |
