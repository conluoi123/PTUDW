# 🚀 Hướng dẫn chạy dự án PTUDW

Dự án gồm 2 phần:
- **Backend** — Node.js + Express + Knex + PostgreSQL (Supabase)
- **Frontend** — React + Vite + TailwindCSS

---

## 📋 Yêu cầu cài đặt trước (Prerequisites)

| Phần mềm | Phiên bản tối thiểu | Link tải |
|---|---|---|
| Node.js | v18+ (đang dùng v22) | https://nodejs.org |
| npm | v9+ (đi kèm Node.js) | — |

> Kiểm tra bằng lệnh: `node -v` và `npm -v`

---

## 📁 Cấu trúc thư mục

```
PTUDW/
├── backend/          # Node.js Express API server
│   ├── controllers/
│   ├── middlewares/
│   ├── migrations/   # Knex DB migrations
│   ├── models/
│   ├── routers/
│   ├── seeds/        # Dữ liệu mẫu (seed data)
│   ├── services/
│   ├── .env          # Biến môi trường backend
│   ├── knexfile.js   # Cấu hình kết nối database
│   └── server.js     # Entry point
└── frontend/         # React + Vite
    ├── src/
    ├── .env          # Biến môi trường frontend
    └── vite.config.js
```

---

## ⚙️ Bước 1 — Cấu hình biến môi trường

### Backend (`backend/.env`)

File `.env` đã có sẵn. Kiểm tra và chỉnh sửa nếu cần:

```env
DB_PASSWORD=<mật_khẩu_supabase>        # Mật khẩu database Supabase
PORT=3000                               # Cổng backend (mặc định 3000)
JWT_SECRET="<chuỗi_bí_mật>"            # Secret cho JWT token
SESSION_SECRET=<chuỗi_bí_mật>          # Secret cho session
FRONTEND_URL=http://localhost:5173      # URL frontend (cho CORS)
BACKEND_URL=http://localhost:3000       # URL backend
X_API_KEY=""                           # API key (để trống nếu không dùng)

# Google OAuth (nếu dùng đăng nhập Google)
GOOGLE_LOGIN_URL=https://accounts.google.com/o/oauth2/v2/auth
GOOGLE_REDIRECT_URL=/api/user/login/google/callback
GOOGLE_CLIENT_ID=<google_client_id>
GOOGLE_SECRET_ID=<google_secret>

# Cloudinary (nếu dùng upload ảnh)
CLOUDINARY_API_KEY=<key>
CLOUDINARY_SECRET_KEY=<secret>
CLOUDINARY_NAME=<cloud_name>
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000      # Phải trỏ đúng URL backend
```

> ⚠️ Nếu đổi `PORT` backend thì phải cập nhật `VITE_API_URL` trong frontend tương ứng.

---

## 🗄️ Bước 2 — Cài đặt Backend

Mở terminal, chạy lần lượt:

```bash
cd backend
npm install
```

---

## 🗄️ Bước 3 — Chạy Migration (Tạo bảng database)

> Database là **PostgreSQL trên Supabase** (đã được cấu hình sẵn trong `knexfile.js`).
> Đảm bảo `DB_PASSWORD` trong `.env` đúng trước khi chạy.

```bash
# Vào thư mục backend (nếu chưa vào)
cd backend

# Tạo toàn bộ bảng từ migration
npm run migrate
```

Lệnh này sẽ tạo các bảng sau trong database:
- `users` — Người dùng
- `games` — Danh sách game
- `friends` — Quan hệ bạn bè
- `friendships` — Yêu cầu kết bạn
- `messages` — Tin nhắn
- `game_states` — Trạng thái game đã lưu
- `game_sessions` — Lịch sử chơi game
- `ratings` — Đánh giá game
- `achievements` — Thành tích
- `user_achievements` — Thành tích người dùng

### (Tuỳ chọn) Rollback migration

```bash
npm run migrate:rollback
```

---

## 🌱 Bước 4 — Seed dữ liệu mẫu (Tùy chọn)

```bash
# Vào thư mục backend
cd backend

npm run seed
```

Sẽ chèn dữ liệu mẫu từ các file trong thư mục `seeds/`.

---

## ▶️ Bước 5 — Chạy Backend Server

```bash
# Vào thư mục backend
cd backend

# Chế độ development (tự restart khi sửa code - dùng nodemon)
npm run dev

# Hoặc chế độ production (chạy thẳng node)
npm start
```

Server sẽ chạy tại: **http://localhost:3000**

Swagger API docs: **http://localhost:3000/api-docs**

---

## 🖥️ Bước 6 — Cài đặt và chạy Frontend

Mở **terminal mới** (giữ terminal backend vẫn chạy):

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

---

## ✅ Tổng hợp — Thứ tự chạy đầy đủ

```bash
# === TERMINAL 1: Backend ===
cd backend
npm install
npm run migrate          # Chỉ cần chạy 1 lần lúc đầu (hoặc khi có migration mới)
npm run seed             # (Tùy chọn) Chèn dữ liệu mẫu
npm run dev              # Chạy server

# === TERMINAL 2: Frontend ===
cd frontend
npm install
npm run dev
```

---

## 🌐 Địa chỉ truy cập

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Swagger API Docs | http://localhost:3000/api-docs |

---

## 🛠️ Các lệnh hữu ích khác

| Lệnh | Mô tả |
|---|---|
| `npm run migrate` | Chạy migration mới nhất |
| `npm run migrate:rollback` | Hoàn tác migration gần nhất |
| `npm run seed` | Chèn dữ liệu mẫu |
| `npm run generate-docs` | Tạo lại file `openapi.yaml` |
| `npm run dev` | Chạy backend với nodemon (auto-reload) |
| `npm start` | Chạy backend với node thường |

---

## ❗ Các lỗi thường gặp

### 1. `ERR_MODULE_NOT_FOUND` — Thiếu package

```bash
# Chạy lại npm install trong thư mục bị lỗi
cd backend   # hoặc cd frontend
npm install
```

### 2. Không kết nối được database

- Kiểm tra `DB_PASSWORD` trong `backend/.env` có đúng không
- Kiểm tra kết nối internet (database trên Supabase cloud)
- Vào Supabase dashboard kiểm tra project còn active không

### 3. CORS error ở frontend

- Đảm bảo `FRONTEND_URL` trong `backend/.env` đúng là `http://localhost:5173`
- Đảm bảo `VITE_API_URL` trong `frontend/.env` đúng là `http://localhost:3000`

### 4. PowerShell chặn `npm`

Dùng **Command Prompt (cmd)** thay vì PowerShell, hoặc chạy:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 5. Port đã bị dùng

```bash
# Tìm và kill process đang dùng port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_number> /F
```

---

## 📝 Ghi chú

- Database **Supabase** đã được cấu hình sẵn — không cần cài PostgreSQL local
- File `.env` **không** được commit lên Git (đã có trong `.gitignore`)
- Backend sử dụng **ES Modules** (`"type": "module"` trong package.json) nên phải dùng cú pháp `import/export`
