# Frontend - Nam Acoustic Guitar Shop

## Giới thiệu

Frontend website bán đàn guitar **Nam Acoustic** xây dựng bằng **React 19 + Vite 8 + Tailwind CSS 3**. Bao gồm giao diện người dùng (shop, blog, khóa học, giỏ hàng, wishlist, tài khoản) và trang quản trị (admin dashboard) với đầy đủ tính năng CRUD.

## Công nghệ sử dụng

| Công nghệ | Mục đích |
|-----------|----------|
| **React 19** | UI library |
| **Vite 8** | Build tool (dev server + proxy API) |
| **React Router DOM 7** | Định tuyến (lazy loading routes) |
| **Axios** | HTTP client + interceptor (refresh token queue) |
| **Tailwind CSS 3** | Styling utility-first |
| **FontAwesome 7** | Icon (free solid + brands) |
| **ESLint 10** | Kiểm tra code |

## Cấu trúc thư mục

```
frontend/
├── index.html                       # HTML entry + SEO meta tags
├── vite.config.js                   # Vite config + proxy /api → backend
├── tailwind.config.js               # Tailwind config (custom shadows)
├── postcss.config.js                # PostCSS config
├── eslint.config.js                 # ESLint flat config
├── .env                             # Biến môi trường
├── src/
│   ├── main.jsx                     # Entry point (React StrictMode)
│   ├── App.jsx                      # Root component + Router (React.lazy)
│   ├── api/
│   │   ├── client.js                # Axios instance + interceptors (token, refresh queue)
│   │   ├── index.js                 # Export tất cả API modules
│   │   ├── auth.js                  # Auth API (login, register, logout, forgot/reset password)
│   │   ├── products.js              # Sản phẩm API
│   │   ├── categories.js            # Danh mục API
│   │   ├── blog.js                  # Blog API
│   │   ├── orders.js                # Đơn hàng API
│   │   ├── courses.js               # Khóa học API
│   │   ├── users.js                 # Người dùng API
│   │   ├── homeContent.js           # Nội dung trang chủ API
│   │   └── aboutContent.js          # Nội dung trang giới thiệu API
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.globals.css    # Tailwind directives
│   │   │   └── header.css           # Header animations
│   │   └── images/                  # Ảnh tĩnh
│   ├── components/
│   │   ├── Header.jsx               # Header (nav, search, auth, badges cart/wishlist)
│   │   ├── Footer.jsx               # Footer
│   │   ├── ProtectedRoute.jsx       # Bảo vệ route (auth + role)
│   │   ├── Button.jsx               # Button tái sử dụng (variants, loading)
│   │   ├── Input.jsx                # Input tái sử dụng
│   │   ├── Textarea.jsx             # Textarea tái sử dụng
│   │   ├── Carousel.jsx             # Hero slider
│   │   ├── Logo.jsx                 # Logo
│   │   ├── ProductCard.jsx          # Card sản phẩm (grid item)
│   │   ├── CategorySidebar.jsx      # Sidebar lọc danh mục
│   │   ├── SortDropdown.jsx         # Dropdown sắp xếp
│   │   ├── Pagination.jsx           # Phân trang
│   │   ├── Skeleton.jsx             # Loading skeleton
│   │   ├── ConfirmDialog.jsx        # Dialog xác nhận
│   │   └── UserAvatar.jsx           # Avatar người dùng
│   ├── hooks/
│   │   ├── useDebounce.js           # Debounce giá trị (search)
│   │   ├── useInView.js             # Intersection Observer
│   │   ├── useSessionRecovery.js    # Khôi phục session khi refresh trang
│   │   └── useUserInfo.js           # Lấy thông tin user từ sessionStorage
│   ├── helpers/
│   │   └── format.js                # formatCurrency, formatDate, getStatusColor, getOptimizedImage...
│   ├── layouts/
│   │   ├── MainLayout.jsx           # Layout chính (Header + Footer + Outlet)
│   │   └── AdminLayout.jsx          # Layout admin (SideBar + Header + Outlet)
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
│       └── AdminPage/
│           ├── Dashboard.jsx        # Thống kê dashboard
│           ├── Products.jsx         # Quản lý sản phẩm
│           ├── Orders.jsx           # Quản lý đơn hàng
│           ├── Users.jsx            # Quản lý người dùng
│           ├── Categories.jsx       # Quản lý danh mục
│           ├── Blog.jsx             # Quản lý bài viết
│           ├── Courses.jsx          # Quản lý khóa học
│           ├── Settings.jsx         # Cài đặt cá nhân
│           ├── HomeContent.jsx      # Chỉnh sửa nội dung trang chủ
│           ├── AboutContent.jsx     # Chỉnh sửa nội dung trang giới thiệu
│           ├── components/
│           │   ├── SideBar.jsx      # Sidebar admin
│           │   └── Header.jsx       # Header admin
│           └── hooks/
│               ├── useDashboard.js
│               ├── useProducts.js
│               ├── useOrders.js
│               ├── useUsers.js
│               ├── useCategories.js
│               ├── useBlog.js
│               ├── useCourses.js
│               ├── useSettings.js
│               ├── useHomeContent.js
│               └── useAboutContent.js
```

## Routes

### Public (MainLayout)

| Path | Page |
|------|------|
| `/` | Trang chủ |
| `/products` | Danh sách sản phẩm |
| `/products/:id` | Chi tiết sản phẩm |
| `/about` | Giới thiệu |
| `/blog` | Bài viết |
| `/blog/:id` | Chi tiết bài viết |
| `/contact` | Liên hệ |
| `/cart` | Giỏ hàng |
| `/checkout` | Thanh toán |
| `/order-success` | Đặt hàng thành công |
| `/tim-kiem?q=` | Tìm kiếm sản phẩm |
| `/courses` | Khóa học |
| `/courses/:slug` | Chi tiết khóa học |
| `/wishlist` | Yêu thích |
| `/account` | Tài khoản |
| `/orders` | Đơn hàng của tôi |

### Auth (no layout)

| Path | Page |
|------|------|
| `/login` | Đăng nhập |
| `/register` | Đăng ký |
| `/forgot-password` | Quên mật khẩu |

### Admin (ProtectedRoute + AdminLayout)

| Path | Page |
|------|------|
| `/admin` | Dashboard |
| `/admin/products` | Quản lý sản phẩm |
| `/admin/orders` | Quản lý đơn hàng |
| `/admin/users` | Quản lý người dùng |
| `/admin/categories` | Quản lý danh mục |
| `/admin/courses` | Quản lý khóa học |
| `/admin/blog` | Quản lý bài viết |
| `/admin/home-content` | Chỉnh sửa nội dung trang chủ |
| `/admin/about-content` | Chỉnh sửa nội dung trang giới thiệu |
| `/admin/settings` | Cài đặt cá nhân |

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
- **Dashboard**: Thống kê (sản phẩm, người dùng, đơn hàng), biểu đồ doanh thu (7 ngày), đơn hàng gần đây
- **Sản phẩm**: CRUD, upload nhiều ảnh, tìm kiếm
- **Danh mục**: CRUD, upload ảnh, bật/tắt trạng thái
- **Đơn hàng**: Lọc trạng thái, cập nhật workflow (pending → confirmed → shipping → delivered/cancelled)
- **Người dùng**: CRUD, phân quyền (user/admin)
- **Bài viết**: CRUD, upload banner
- **Khóa học**: CRUD, quản lý bài học động (thêm/xoá/sắp xếp), xuất bản/draft
- **Nội dung trang chủ**: Chỉnh sửa carousel, features, categories section, sản phẩm nổi bật, clip, bộ sưu tập, CTA
- **Nội dung trang giới thiệu**: Chỉnh sửa story, stats, team, commitments
- **Cài đặt**: Thông tin cá nhân, đổi mật khẩu

## Quản lý State

- **localStorage**: Giỏ hàng, wishlist
- **sessionStorage**: JWT access token, thông tin user
- **Custom events**: `cart-updated`, `wishlist-updated` để đồng bộ Header badges real-time
- **Custom hooks**: Mỗi page/hook tự quản lý state riêng (không dùng Redux/Context API/Zustand)

## Xác thực

- **JWT access token** (15 phút) lưu trong `sessionStorage`
- **Refresh token** lưu trong httpOnly cookie (backend quản lý)
- **Axios interceptor**: Tự động refresh token khi gặp 401, xử lý concurrent requests qua queue
- **ProtectedRoute**: Kiểm tra token + role trước khi render component
- **useSessionRecovery**: Khôi phục session (gọi refresh token) khi load lại trang

## API Client (`src/api/`)

- `client.js`: Axios instance với `baseURL` từ env `VITE_API_URL`, `withCredentials: true`
- Request interceptor: gắn `Authorization: Bearer` header, tự động xử lý `Content-Type` cho FormData
- Response interceptor: queue xử lý concurrent 401, refresh token tự động, redirect `/login` nếu hết hạn
- Các module API riêng: `auth.js`, `products.js`, `categories.js`, `orders.js`, `users.js`, `blog.js`, `courses.js`, `homeContent.js`, `aboutContent.js`
- Export tập trung qua `index.js`

## Hiệu năng

- **React.lazy + Suspense**: Tất cả pages đều lazy load, giảm bundle size initial
- **Custom shadows**: Tailwind config mở rộng (`flat`, `soft`, `pop`, `lift`)
- **Cloudinary image optimization**: URL-based resize + auto format qua helper `getOptimizedImage`

## SEO

- Meta tags đầy đủ: OG (title, description, image), Twitter Card, theme-color
- Preconnect: Cloudinary, Unsplash
- Vietnamese locale (`vi_VN`)
- Semantic HTML với `lang="vi"`

## Cài đặt & Chạy

```bash
# Clone và di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Tạo file .env với nội dung:
# VITE_API_URL=/api

# Chạy development (cần backend chạy cùng lúc)
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

## Vite Proxy

Vite dev server được cấu hình proxy `/api` → `http://localhost:5000` (backend) trong `vite.config.js`:

```js
server: {
  port: 5173,
  proxy: {
    "/api": {
      target: "http://localhost:5000",
      changeOrigin: true
    }
  }
}
```

Nhờ proxy này, frontend có thể gọi `/api/products` thay vì `http://localhost:5000/api/products` trong development, tránh CORS.

## Biến môi trường

| Biến | Mô tả | Mặc định |
|------|-------|----------|
| `VITE_API_URL` | Base URL backend API | `/api` (proxy) |

## Tài liệu chi tiết

Xem thêm trong thư mục `docs/frontend/`:

| File | Mô tả |
|------|-------|
| `components.md` | 14 components (Button, Input, Textarea, Header, Footer, Carousel, Logo, ProductCard, CategorySidebar, SortDropdown, Pagination, Skeleton, ConfirmDialog, ProtectedRoute) |
| `layouts.md` | MainLayout, AdminLayout (SideBar + Header) |
| `api-client.md` | Axios instance, interceptors, token refresh queue, 9 API modules |
| `helpers.md` | formatDate, formatCurrency, getStatusColor, getOptimizedImage |
| `hooks.md` | 14 custom hooks (useDebounce, useInView, useSessionRecovery, useUserInfo + 10 admin hooks) |
| `pages.md` | Tất cả pages (Home, Products, Auth, Cart, Admin gồm home-content, about-content) |

## Yêu cầu hệ thống

- **Node.js**: >= 18
- **Cổng**: 5173 (Vite dev server - mặc định)
- **Backend**: Cần chạy backend ở cổng 5000 để proxy hoạt động
