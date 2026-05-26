# Frontend - Nam Acoustic Guitar Shop

## Giới thiệu

Frontend website bán đàn guitar **Nam Acoustic** được xây dựng bằng **React 19 + Vite 8 + Tailwind CSS**. Bao gồm giao diện người dùng (shop, blog, khóa học, giỏ hàng, wishlist, tài khoản) và trang quản trị (admin dashboard) đầy đủ.

## Công nghệ sử dụng

| Công nghệ | Mục đích |
|-----------|----------|
| **React 19** | UI library |
| **Vite 8** | Build tool |
| **React Router DOM 7** | Định tuyến |
| **Axios** | HTTP client |
| **Tailwind CSS 3** | Styling utility-first |
| **FontAwesome 7** | Icon |
| **ESLint** | Kiểm tra code |

## Cấu trúc thư mục

```
frontend/
├── src/
│   ├── main.jsx                     # Entry point
│   ├── App.jsx                      # Root component + Router
│   ├── api/
│   │   └── axiosClient.js           # Axios instance + interceptor
│   ├── assets/css/
│   │   ├── style.globals.css        # Tailwind directives
│   │   └── header.css               # Header animations
│   ├── components/
│   │   ├── Header.jsx               # Header chính (nav, search, auth, badges)
│   │   ├── Footer.jsx               # Footer
│   │   ├── ProtectedRoute.jsx       # Bảo vệ route (auth + role)
│   │   ├── Button.jsx               # Button tái sử dụng
│   │   ├── Input.jsx                # Input tái sử dụng
│   │   ├── Carousel.jsx             # Hero slider
│   │   └── Logo.jsx                 # Logo
│   ├── helpers/
│   │   └── format.js                # Format tiền, ngày, trạng thái, ảnh
│   ├── layouts/
│   │   ├── MainLayout.jsx           # Layout chính (Header + Footer)
│   │   └── AdminLayout.jsx          # Layout admin (Sidebar + Header)
│   └── pages/
│       ├── HomePage/                # Trang chủ
│       ├── ProductsPage/            # Sản phẩm + chi tiết
│       ├── AuthPage/                # Đăng nhập, đăng ký, quên mật khẩu
│       ├── CartPage/                # Giỏ hàng, thanh toán, đặt hàng thành công
│       ├── CoursesPage/             # Khóa học + chi tiết
│       ├── BlogPage/                # Blog + chi tiết
│       ├── SearchPage/              # Tìm kiếm sản phẩm
│       ├── WishlistPage/            # Danh sách yêu thích
│       ├── AccountPage/             # Tài khoản người dùng
│       ├── OrdersPage/              # Lịch sử đơn hàng
│       ├── AboutPage/               # Giới thiệu
│       ├── ContactPage/             # Liên hệ
│       ├── NotFoundPage/            # 404
│       └── AdminPage/               # Quản trị (Dashboard, Products, Orders, Users, Categories, Blog, Courses, Settings)
```

## Routes

```
/                     → Trang chủ
/products             → Danh sách sản phẩm
/products/:id         → Chi tiết sản phẩm
/about                → Giới thiệu
/blog                 → Bài viết
/blog/:id             → Chi tiết bài viết
/contact              → Liên hệ
/cart                 → Giỏ hàng
/checkout             → Thanh toán
/order-success        → Đặt hàng thành công
/tim-kiem?q=          → Tìm kiếm sản phẩm
/courses              → Khóa học
/courses/:slug        → Chi tiết khóa học
/wishlist             → Yêu thích
/account              → Tài khoản
/orders               → Đơn hàng của tôi

/login                → Đăng nhập
/register             → Đăng ký
/forgot-password      → Quên mật khẩu

/admin                → Dashboard
/admin/products       → Quản lý sản phẩm
/admin/orders         → Quản lý đơn hàng
/admin/users          → Quản lý người dùng
/admin/categories     → Quản lý danh mục
/admin/settings       → Cài đặt
/admin/courses        → Quản lý khóa học
/admin/blog           → Quản lý bài viết
```

## Tính năng chính

### Người dùng (Shop)
- **Trang chủ**: Hero carousel, danh mục, sản phẩm nổi bật, video quảng cáo
- **Sản phẩm**: Danh sách có phân trang, lọc danh mục, sắp xếp, tìm kiếm
- **Chi tiết sản phẩm**: Gallery ảnh, chọn số lượng, thêm vào giỏ/yêu thích
- **Giỏ hàng**: localStorage, cập nhật số lượng, mã giảm giá (GUITAR10)
- **Thanh toán**: Form địa chỉ, chọn phương thức (COD/banking)
- **Yêu thích**: localStorage, thêm/xoá/thêm tất cả vào giỏ
- **Khóa học**: Danh sách, chi tiết với video player & danh sách bài học
- **Blog**: Danh sách & chi tiết bài viết
- **Tài khoản**: Thông tin cá nhân, lịch sử đơn hàng
- **Xác thực**: Đăng nhập, đăng ký, quên mật khẩu (OTP qua email)
- **Tìm kiếm**: Tìm kiếm sản phẩm theo từ khóa

### Quản trị (Admin)
- **Dashboard**: Thống kê (sản phẩm, người dùng, đơn hàng), biểu đồ doanh thu, đơn hàng gần đây
- **Sản phẩm**: CRUD, upload nhiều ảnh, tìm kiếm
- **Danh mục**: CRUD, upload ảnh, bật/tắt trạng thái
- **Đơn hàng**: CRUD, lọc trạng thái, cập nhật workflow (pending → delivered)
- **Người dùng**: CRUD, phân quyền (user/admin)
- **Bài viết**: CRUD, upload banner
- **Khóa học**: CRUD, quản lý bài học động (thêm/xoá/sắp xếp), xuất bản/draft
- **Cài đặt**: Thông tin cá nhân, đổi mật khẩu, thông báo (UI)

## Quản lý State

- **localStorage**: Giỏ hàng, wishlist
- **sessionStorage**: Token JWT, thông tin user
- **Custom events**: `cart-updated`, `wishlist-updated` để đồng bộ Header badges
- **Custom hooks**: Mỗi page/hook tự quản lý state riêng
- **Không dùng Redux/Context API/Zustand**

## Xác thực

- **JWT access token** (15 phút) lưu trong `sessionStorage`
- **Refresh token** lưu trong httpOnly cookie
- **Axios interceptor**: Tự động refresh token khi gặp 401
- **ProtectedRoute**: Kiểm tra token + role trước khi render
- **Queue xử lý concurrent requests** khi đang refresh token

## API Client

- Axios instance với `baseURL` từ biến môi trường `VITE_API_URL`
- Request interceptor: gắn `Authorization: Bearer` header
- Response interceptor: xử lý 401 (refresh token) và lỗi tập trung
- Hỗ trợ cả JSON và FormData (upload file)

## Cài đặt & Chạy

```bash
# Clone và di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Tạo file .env:
# VITE_API_URL=http://localhost:5000/api

# Chạy development
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

## Biến môi trường

| Biến | Mô tả | Mặc định |
|------|-------|----------|
| `VITE_API_URL` | Base URL backend API | `http://localhost:5000/api` |

## Tài liệu chi tiết

Xem thêm trong thư mục `docs/frontend/`:

| File | Mô tả |
|------|-------|
| `components.md` | Button, Input, Header, Footer, Carousel, Logo, ProtectedRoute |
| `layouts.md` | MainLayout (ResizeObserver), AdminLayout (sidebar toggle) |
| `api-client.md` | Axios instance, request/response interceptors, token refresh queue |
| `helpers.md` | formatDate, formatCurrency, getStatusColor, getOptimizedImage |
| `hooks.md` | 13 custom hooks (useProducts, useLogin, useDashboard, ...) |
| `pages.md` | Tất cả pages (Home, Products, Auth, Cart, Admin, ...) |

## Yêu cầu hệ thống

- **Node.js**: >= 18
- **Cổng**: 5173 (Vite dev server - mặc định)
