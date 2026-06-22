# Auth Flow

## Kiến trúc tổng quan

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser["Trình duyệt<br/>React App"]
        Cookie["httpOnly Cookie<br/>refreshToken"]
        Storage["LocalStorage / Memory<br/>accessToken"]
    end

    subgraph API["API Layer - Express Server"]
        GL["Global Middleware<br/>helmet, cors, compression<br/>cookieParser, rateLimit"]

        subgraph Routes["Routes"]
            AUTH["/api/auth"]
        end

        subgraph Middleware["Auth Middleware"]
            PROTECT["protect<br/>verify accessToken"]
            ALIMITER["authLimiter<br/>5 req/phút"]
            RLIMITER["refreshLimiter<br/>10 req/phút"]
        end

        subgraph Controllers["Controllers"]
            REGISTER["register"]
            LOGIN["login"]
            LOGOUT["logout"]
            FORGOT["forgotPassword"]
            RESET["resetPassword"]
            REFRESH["refreshAccessToken"]
        end

        subgraph Services["Services"]
            GEN_TOKEN["generateToken<br/>JWT sign"]
            SEND_MAIL["sendEmail<br/>Nodemailer + Gmail SMTP"]
        end

        subgraph Utils["Utils"]
            COOKIER["cookier.js<br/>set/clear cookie"]
            RESPONSE["appResponse.js<br/>appError / appSuccess"]
            VALID["valid.js<br/>email, password validation"]
        end
    end

    subgraph Data["Data Layer"]
        MONGODB[(MongoDB<br/>Users Collection)]
        USER_MODEL["User Model<br/>name, email, password<br/>refreshToken, resetOtp"]
    end

    subgraph External["External"]
        GMAIL["Gmail SMTP<br/>Nodemailer"]
        NOTIF["Notification<br/>new_user event"]
    end

    Browser -->|"POST /api/auth/*"| GL
    GL --> AUTH
    AUTH --> ALIMITER
    ALIMITER -->|register/login/forgot/reset| REGISTER
    ALIMITER --> LOGIN
    ALIMITER --> FORGOT
    ALIMITER --> RESET
    AUTH --> RLIMITER
    RLIMITER --> REFRESH
    AUTH --> PROTECT
    PROTECT --> LOGOUT

    REGISTER --> GEN_TOKEN
    REGISTER --> COOKIER
    REGISTER --> RESPONSE
    REGISTER --> VALID
    REGISTER --> USER_MODEL
    REGISTER --> NOTIF

    LOGIN --> GEN_TOKEN
    LOGIN --> COOKIER
    LOGIN --> RESPONSE
    LOGIN --> VALID
    LOGIN --> USER_MODEL

    LOGOUT --> COOKIER
    LOGOUT --> RESPONSE
    LOGOUT --> USER_MODEL

    FORGOT --> VALID
    FORGOT --> USER_MODEL
    FORGOT --> SEND_MAIL
    FORGOT --> RESPONSE
    SEND_MAIL --> GMAIL

    RESET --> VALID
    RESET --> USER_MODEL
    RESET --> COOKIER
    RESET --> RESPONSE

    REFRESH --> COOKIER
    REFRESH --> RESPONSE
    REFRESH --> USER_MODEL
    REFRESH --> GEN_TOKEN

    USER_MODEL --> MONGODB
    Browser <-->|"set/clear"| Cookie
    Browser -.->|"lưu trong memory"| Storage
    Storage -.->|"Authorization: Bearer"| PROTECT
```

## Use Case Diagram

```mermaid
graph TB
    User("Người dùng")
    Admin("Admin")

    subgraph AuthSystem["Hệ thống xác thực"]
        REGISTER_UC["Đăng ký tài khoản<br/><i>POST /api/auth/register</i>"]
        LOGIN_UC["Đăng nhập<br/><i>POST /api/auth/login</i>"]
        LOGOUT_UC["Đăng xuất<br/><i>POST /api/auth/logout</i>"]
        REFRESH_UC["Làm mới token<br/><i>POST /api/auth/refresh</i>"]
        FORGOT_UC["Quên mật khẩu<br/><i>POST /api/auth/password/forgot</i>"]
        RESET_UC["Đặt lại mật khẩu<br/><i>POST /api/auth/password/reset</i>"]
    end

    subgraph ExtendUC["Use cases mở rộng"]
        EXTEND_SEND_EMAIL["Gửi email OTP"]
        EXTEND_VALIDATE["Validate dữ liệu đầu vào"]
        EXTEND_RATE_LIMIT["Rate limiting"]
        EXTEND_NOTIFY["Gửi thông báo admin"]
    end

    User --> REGISTER_UC
    User --> LOGIN_UC
    User --> LOGOUT_UC
    User --> REFRESH_UC
    User --> FORGOT_UC
    User --> RESET_UC

    REGISTER_UC -.->|<<extend>>| EXTEND_SEND_EMAIL
    REGISTER_UC -.->|<<extend>>| EXTEND_VALIDATE
    REGISTER_UC -.->|<<extend>>| EXTEND_RATE_LIMIT
    REGISTER_UC -.->|<<extend>>| EXTEND_NOTIFY

    LOGIN_UC -.->|<<extend>>| EXTEND_VALIDATE
    LOGIN_UC -.->|<<extend>>| EXTEND_RATE_LIMIT

    LOGOUT_UC -.->|<<include>>| LOGIN_UC

    REFRESH_UC -.->|<<extend>>| EXTEND_RATE_LIMIT

    FORGOT_UC -.->|<<extend>>| EXTEND_VALIDATE
    FORGOT_UC -.->|<<extend>>| EXTEND_RATE_LIMIT
    FORGOT_UC -.->|<<extend>>| EXTEND_SEND_EMAIL

    RESET_UC -.->|<<extend>>| EXTEND_VALIDATE
    RESET_UC -.->|<<extend>>| EXTEND_RATE_LIMIT
```

### Luồng request lifecycle

```
Client → Global Middleware → Router → Rate Limiter → Controller → Service/Model → MongoDB → Response → Client
                                     ↑
                               Auth Middleware (protect)
```

## Sequence Diagrams

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant MongoDB

    Note over Client,MongoDB: === ĐĂNG NHẬP ===
    Client->>Server: POST /api/auth/login { email, password }
    Server->>Server: Validate input (email, password)
    Server->>MongoDB: user.findOne({ email }).select(+password +refreshToken)
    alt User không tồn tại
        Server-->>Client: 401 Email hoặc mật khẩu không đúng!
    else User tồn tại
        Server->>Server: bcrypt.compare(password, user.password)
        alt Sai mật khẩu
            Server-->>Client: 401 Email hoặc mật khẩu không đúng!
        else Đúng mật khẩu
            Server->>Server: generateAccessToken(user) -> 15m
            Server->>Server: generateRefreshToken(user) -> 7d
            Server->>MongoDB: Cập nhật refreshToken mới
            Server->>Client: Set cookie httpOnly refreshToken
            Server-->>Client: 200 { user, accessToken }
        end
    end
```

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant MongoDB

    Note over Client,MongoDB: === ĐĂNG XUẤT ===
    Client->>Server: POST /api/auth/logout (Authorization: Bearer accessToken)
    Server->>Server: protect middleware -> verify accessToken -> req.user
    Server->>MongoDB: user.findByIdAndUpdate(userId, { refreshToken: "" })
    Server->>Client: Xóa cookie refreshToken
    Server-->>Client: 200 Đăng xuất thành công!
```

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant MongoDB
    participant Email

    Note over Client,Email: === QUÊN MẬT KHẨU ===
    Client->>Server: POST /api/auth/password/forgot { email }
    Server->>Server: Validate email
    Server->>MongoDB: user.findOne({ email }).select(+resetOtp +resetOtpExpire)
    alt User không tồn tại
        Server-->>Client: 404 Email không tồn tại!
    else User tồn tại
        Server->>Server: crypto.randomInt(100000, 999999) -> OTP 6 số
        Server->>Server: bcrypt.hash(OTP) -> lưu resetOtp
        Server->>Server: resetOtpExpire = Date.now() + 10 phút
        Server->>MongoDB: user.save()
        Server->>Email: sendEmail({ email, subject: "OTP Đặt Lại Mật Khẩu", html })
        Server-->>Client: 200 OTP đã được gửi qua email
    end
```

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant MongoDB

    Note over Client,MongoDB: === ĐẶT LẠI MẬT KHẨU ===
    Client->>Server: POST /api/auth/password/reset { email, otp, password }
    Server->>Server: Validate input (email, otp, password)
    Server->>MongoDB: user.findOne({ email }).select(+password +refreshToken +resetOtp +resetOtpExpire)
    alt User không tồn tại
        Server-->>Client: 404 Người dùng không tồn tại!
    else User tồn tại
        alt OTP hết hạn (resetOtpExpire < Date.now())
            Server-->>Client: 400 OTP không hợp lệ hoặc đã hết hạn!
        else OTP còn hạn
            Server->>Server: bcrypt.compare(otp, user.resetOtp)
            alt OTP không khớp
                Server-->>Client: 400 OTP không hợp lệ hoặc đã hết hạn!
            else OTP khớp
                Server->>Server: Hash password mới
                Server->>Server: Xóa resetOtp, resetOtpExpire, refreshToken
                Server->>Client: Xóa cookie refreshToken
                Server-->>Client: 200 Thay đổi mật khẩu thành công!
            end
        end
    end
```

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant MongoDB

    Note over Client,MongoDB: === REFRESH TOKEN ===
    Client->>Server: POST /api/auth/refresh (Cookie: refreshToken)
    Server->>Server: Lấy refreshToken từ req.cookies
    alt Không có refreshToken
        Server-->>Client: 401 Không tìm thấy refresh token!
    else Có refreshToken
        Server->>Server: jwt.verify(refreshToken, JWT_REFRESH_SECRET)
        alt Token không hợp lệ/hết hạn
            Server-->>Client: 401 Token không hợp lệ hoặc đã hết hạn!
        else Token hợp lệ
            Server->>MongoDB: user.findById(decoded.id).select(+refreshToken)
            alt User không tồn tại
                Server-->>Client: 404 Người dùng không tồn tại!
            else User tồn tại
                alt refreshToken không khớp database
                    Server-->>Client: 401 Refresh token không hợp lệ!
                else refreshToken khớp
                    Server->>Server: generateAccessToken(user) mới
                    Server->>Server: generateRefreshToken(user) mới
                    Server->>MongoDB: Cập nhật refreshToken mới
                    Server->>Client: Set cookie httpOnly refreshToken mới
                    Server-->>Client: 200 { accessToken }
                end
            end
        end
    end
```

## Danh sách API

| Method | Endpoint | Auth | Rate Limit | Mô tả |
|--------|----------|------|------------|-------|
| POST | `/api/auth/register` | Public | 5 req/phút | Đăng ký tài khoản |
| POST | `/api/auth/login` | Public | 5 req/phút | Đăng nhập |
| POST | `/api/auth/logout` | Protected | - | Đăng xuất |
| POST | `/api/auth/refresh` | Public | 10 req/phút | Làm mới access token |
| POST | `/api/auth/password/forgot` | Public | 5 req/phút | Gửi OTP quên mật khẩu |
| POST | `/api/auth/password/reset` | Public | 5 req/phút | Đặt lại mật khẩu |

## Cấu trúc file

```
src/
├── controller/auth.controller.js    # Xử lý logic auth
├── routers/auth.routes.js           # Định nghĩa routes
├── middleware/auth.middleware.js     # protect, adminOnly, authLimiter, refreshLimiter
├── services/generateToken.js        # Tạo JWT access & refresh token
├── services/sendEmail.js            # Gửi email OTP
├── utils/cookier.js                 # Quản lý cookie refresh token
├── utils/appResponse.js             # Format response chuẩn
├── utils/valid.js                   # Validate email, password
├── models/users.model.js            # User schema
└── config/middleware.config.js       # Global middleware
```

## Chi tiết kỹ thuật

### JWT Tokens

| Token | Thời hạn | Secret | Mục đích |
|-------|----------|--------|----------|
| Access Token | 15 phút | `JWT_ACCESS_SECRET` | Xác thực request (Authorization header) |
| Refresh Token | 7 ngày | `JWT_REFRESH_SECRET` | Làm mới access token (httpOnly cookie) |

### Cookie Config

- `httpOnly: true` - Chống XSS (JS không đọc được)
- `secure: true` (production) - Chỉ gửi qua HTTPS
- `sameSite: "strict"` (production) - Chống CSRF
- `maxAge: 7 ngày` - Khớp với thời hạn refresh token

### Validation Rules

- **Email**: Định dạng `xxx@yyy.zzz`
- **Password**: ≥8 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 số
- **OTP**: 6 số, hiệu lực 10 phút

### Rate Limiting

- **authLimiter**: 5 requests/phút cho register, login, forgot, reset
- **refreshLimiter**: 10 requests/phút cho refresh token
- **Global limiter**: 100 requests/15 phút (bỏ qua nếu là admin)
