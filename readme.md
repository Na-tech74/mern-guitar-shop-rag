# Nam Acoustic Guitar Shop

Hệ thống thương mại điện tử bán đàn guitar fullstack với tích hợp chatbot AI tư vấn sản phẩm sử dụng RAG (Retrieval-Augmented Generation).

## Kiến trúc hệ thống

```
User (React UI)
        │
        ▼
   Frontend (React 19 + Vite 8 + Tailwind CSS)
        │
        ├── API thường (axios)
        │        │
        │        ▼
        │   Backend (Express  + Mongoose )
        │        │
        │        ├── Auth (JWT dual-token)
        │        ├── Product / Category / Order
        │        ├── Blog / Course / User
        │        ▼
        │     MongoDB
        │
        └── Chat API (RAG)
                 │
                 ▼
           Chat Service
                 │
          ┌──────┴──────┐
          ▼             ▼
     Vector DB       LLM Model
    (FAISS/Chroma)  (Mistral/OpenAI)
          │             │
          └────► RAG ◄──┘
                   │
                   ▼
               Response
```

## Công nghệ sử dụng

### Frontend

| Công nghệ | Mục đích |
|-----------|----------|
| React 19 | UI library |
| Vite 8 | Build tool |
| React Router DOM 7 | Định tuyến |
| Axios | HTTP client |
| Tailwind CSS 3 | Styling |
| FontAwesome 7 | Icon |

### Backend

| Công nghệ | Mục đích |
|-----------|----------|
| Express 5 | Web framework |
| Mongoose 9 | MongoDB ODM |
| JWT (access + refresh token) | Xác thực |
| bcryptjs | Mã hóa mật khẩu |
| Cloudinary | Lưu trữ hình ảnh |
| Multer | Upload file |
| Nodemailer | Gửi email |
| express-rate-limit | Giới hạn request |

### AI / Chatbot

| Công nghệ | Mục đích |
|-----------|----------|
| RAG (Retrieval-Augmented Generation) | Tư vấn sản phẩm thông minh |
| FAISS / Chroma | Vector database |
| Mistral / OpenAI | LLM model |
| Embedding model | Chuyển văn bản thành vector |

## Cấu trúc thư mục

```
/
├── backend/                    # REST API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── server.js           # Entry point
│   │   ├── config/             # Cấu hình DB, Cloudinary
│   │   ├── middleware/         # Auth, error, upload, async handler
│   │   ├── models/             # Mongoose models (User, Product, Order, ...)
│   │   ├── routers/            # Route definitions
│   │   ├── controller/         # Business logic
│   │   ├── services/           # Token, email, upload
│   │   └── utils/              # Helpers, validation, format
│   └── readme.md
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── main.jsx            # Entry point
│   │   ├── App.jsx             # Root + Router
│   │   ├── api/                # Axios client + interceptors
│   │   ├── components/         # Shared components
│   │   ├── layouts/            # MainLayout, AdminLayout
│   │   ├── helpers/            # Format utilities
│   │   └── pages/              # Page components + hooks + API modules
│   │       ├── HomePage/
│   │       ├── ProductsPage/
│   │       ├── AuthPage/
│   │       ├── CartPage/
│   │       ├── CoursesPage/
│   │       ├── BlogPage/
│   │       ├── SearchPage/
│   │       ├── WishlistPage/
│   │       ├── AccountPage/
│   │       ├── OrdersPage/
│   │       ├── AboutPage/
│   │       ├── ContactPage/
│   │       ├── NotFoundPage/
│   │       └── AdminPage/
│   └── readme.md
│
└── readme.md                   # (file này)
```

## Tính năng

### 🛒 Người dùng (Shop)

- Trang chủ với hero carousel, danh mục, sản phẩm nổi bật
- Xem danh sách sản phẩm (phân trang, lọc danh mục, sắp xếp, tìm kiếm)
- Chi tiết sản phẩm với gallery ảnh, chọn số lượng
- Giỏ hàng (localStorage, mã giảm giá GUITAR10)
- Thanh toán (COD / banking)
- Danh sách yêu thích (localStorage)
- Khóa học guitar với video & bài học
- Blog kiến thức guitar
- Xác thực: đăng ký, đăng nhập, quên mật khẩu (OTP email)
- Tài khoản cá nhân & lịch sử đơn hàng

### 🔧 Quản trị (Admin)

- Dashboard với thống kê & biểu đồ doanh thu
- CRUD sản phẩm (upload nhiều ảnh)
- CRUD danh mục (bật/tắt trạng thái)
- Quản lý đơn hàng (cập nhật trạng thái workflow)
- Quản lý người dùng (phân quyền)
- CRUD bài viết blog
- CRUD khóa học (quản lý bài học động)
- Cài đặt tài khoản

### 🤖 Chatbot AI (RAG)

- Tư vấn sản phẩm dựa trên dữ liệu thực tế
- Hỏi đáp kiến thức guitar (acoustic vs electric, beginner)
- Embedding + vector search trên FAISS/Chroma
- Sinh câu trả lời bằng LLM (Mistral/OpenAI)

## Luồng dữ liệu

### Xác thực
```
Register/Login → Backend kiểm tra → Generate JWT → Frontend lưu token → Gửi request kèm Authorization
```

### Giỏ hàng & Đặt hàng
```
User chọn sản phẩm → Add to Cart (localStorage) → Checkout → POST /api/orders → Backend lưu Order → MongoDB
```

### Quản trị
```
Admin login → CRUD Product → POST/PUT/DELETE → MongoDB update
```

### Chatbot RAG
```
User hỏi → Frontend gửi message → Backend Chat Service
  → 1. Convert câu hỏi → embedding
  → 2. Search Vector DB (FAISS)
  → 3. Lấy top-k documents
  → 4. Ghép context + question
  → 5. Gửi vào LLM (Mistral)
  → 6. Generate answer
  → 7. Trả về frontend
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
# Tạo file .env: VITE_API_URL=http://localhost:5000/api
npm run dev       # http://localhost:5173
```

### Biến môi trường

Xem chi tiết tại `backend/readme.md` và `frontend/readme.md`.

## Tài liệu liên quan

| File | Mô tả |
|------|-------|
| `backend/readme.md` | Chi tiết backend |
| `frontend/readme.md` | Chi tiết frontend |
| `docs/architecture.md` | Kiến trúc hệ thống |
| `docs/deployment.md` | Hướng dẫn triển khai |
| `docs/development.md` | Hướng dẫn phát triển |
| `docs/rag.md` | Chatbot RAG |
| `docs/backend/api.md` | API endpoints |
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
