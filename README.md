# 🎮 WEBGAME

![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Upload-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

---

## 📖 Giới thiệu

**WEBGAME** là một nền tảng web game đa người chơi được xây dựng với mục tiêu cung cấp trải nghiệm chơi game giải trí trực tuyến ngay trên trình duyệt. Người dùng có thể đăng ký tài khoản, chơi nhiều thể loại game khác nhau, kết bạn, bình luận, lưu tiến trình và theo dõi bảng xếp hạng.

Dự án được phát triển trong khuôn khổ môn học **Phát Triển Ứng Dụng Web** (PTUDW).

---

## ✨ Tính năng nổi bật

### 👤 Người dùng
- **Đăng nhập / Đăng ký** — hỗ trợ tài khoản thông thường và **Google OAuth**
- **Trang cá nhân** — xem thông tin, lịch sử chơi, thành tích
- **Đổi avatar** — upload ảnh đại diện qua **Cloudinary**
- **Kết bạn** — gửi/chấp nhận yêu cầu kết bạn, quản lý danh sách bạn bè

### 🎮 Game
Hỗ trợ **6 game** đa dạng thể loại:
| # | Tên game | Thể loại |
|---|---|---|
| 1 | **Caro 5** | Chiến thuật / Đối kháng |
| 2 | **Tic-Tac-Toe** | Chiến thuật / Đối kháng |
| 3 | **Ghép hàng 3** (Candy Crush) | Giải đố / Casual |
| 4 | **Tô màu** | Sáng tạo / Relaxing |
| 5 | **Rắn săn mồi** | Arcade / Reflex |
| 6 | **Cờ trí nhớ** | Ghi nhớ / Puzzle |

### 🕹️ Trong game
- **Lưu tiến trình game** — save/load trạng thái
- **Comment trong khi chơi** — bình luận real-time
- **Kết quả & điểm số** — hiển thị sau mỗi ván

### 🏆 Cộng đồng
- **Bảng xếp hạng** — top người chơi theo điểm số
- **Bình luận** — hệ thống comment tại trang game

### 🛡️ Quản trị (Admin)
- **Thêm / Ẩn game** — quản lý danh mục game trên nền tảng
- **Xem bảng xếp hạng** — theo dõi thống kê toàn hệ thống

---

## 🛠️ Công nghệ sử dụng

| Layer | Công nghệ |
|---|---|
| **Backend** | Node.js v22, Express v5, Knex.js |
| **Database** | PostgreSQL — Supabase (cloud) |
| **Frontend** | React 19, Vite 7, TailwindCSS v4 |
| **UI Components** | shadcn/ui, Radix UI, MUI |
| **Authentication** | JWT, express-session, Google OAuth 2.0 |
| **Image Storage** | Cloudinary |
| **API Docs** | Swagger / OpenAPI |

---

## 📸 Ảnh chụp màn hình

### Tổng quan sản phẩm
![Tổng quan](images/Pasted%20image%2020260508152049.png)

---

### 🔐 Đăng nhập
![Login](images/Pasted%20image%2020260508152104.png)
![Login variant](images/Pasted%20image%2020260508152126.png)

---

### 🏠 Main Dashboard
![Dashboard](images/Pasted%20image%2020260508152203.png)
![Dashboard chi tiết](images/Pasted%20image%2020260508152222.png)

---

### 💬 Bình luận
![Comment](images/Pasted%20image%2020260508152239.png)

---

### 🎮 Giao diện Game
![Giao diện game](images/Pasted%20image%2020260508152419.png)

#### Caro-5
![Caro-5](images/Pasted%20image%2020260508152450.png)

#### Tic-Tac-Toe
![Tic-Tac-Toe 1](images/Pasted%20image%2020260509130322.png)
![Tic-Tac-Toe 2](images/Pasted%20image%2020260509130341.png)

---

### 🏆 Kết quả game
![Kết quả](images/Pasted%20image%2020260508152508.png)

---

### 💾 Tính năng lưu game
![Save game](images/Pasted%20image%2020260509130423.png)

---

### 💬 Comment khi chơi game
![Comment in-game](images/Pasted%20image%2020260508152604.png)

---

### 👥 Kết bạn
![Kết bạn](images/Pasted%20image%2020260508152825.png)

---

### 👤 User Dashboard
![User dashboard](images/Pasted%20image%2020260508152751.png)

#### Đổi ảnh đại diện (Cloudinary)
![Upload avatar](images/Pasted%20image%2020260508154757.png)

---

### 🥇 Bảng xếp hạng người chơi
![Leaderboard](images/Pasted%20image%2020260508152850.png)

---

## ⚙️ Cài đặt

> 📋 Xem hướng dẫn đầy đủ tại **[HOW_TO_RUN.md](HOW_TO_RUN.md)**

### Yêu cầu
- **Node.js** v18+ (khuyến nghị v22)
- **npm** v9+

### Cài đặt nhanh

```bash
# 1. Clone repository
git clone <repository-url>
cd PTUDW

# 2. Cài đặt Backend
cd backend
npm install

# 3. Chạy migration (tạo bảng database)
npm run migrate

# 4. Chạy Backend server
npm run dev
```

```bash
# 5. Mở terminal mới — Cài đặt Frontend
cd frontend
npm install
npm run dev
```

### Biến môi trường

**`backend/.env`**
```env
DB_PASSWORD=<mật_khẩu_supabase>
PORT=3000
JWT_SECRET="<chuỗi_bí_mật>"
SESSION_SECRET=<chuỗi_bí_mật>
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<google_client_id>
GOOGLE_SECRET_ID=<google_secret>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_SECRET_KEY=<secret>
CLOUDINARY_NAME=<cloud_name>
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:3000
```

---

## 🚀 Cách sử dụng

Sau khi cài đặt và chạy thành công:

| Service | URL |
|---|---|
| **Frontend** (Giao diện người dùng) | http://localhost:5173 |
| **Backend API** | http://localhost:3000 |
| **Swagger API Docs** | http://localhost:3000/api-docs |

### Luồng sử dụng cơ bản

1. **Đăng ký / Đăng nhập** tại trang chủ (hỗ trợ Google OAuth)
2. **Chọn game** từ danh sách tại Dashboard
3. **Chơi game** — có thể lưu tiến trình, bình luận trong khi chơi
4. **Xem kết quả** và điểm số sau mỗi ván
5. **Kết bạn** với những người chơi khác
6. **Theo dõi bảng xếp hạng** để biết vị trí của bạn
7. **Chỉnh sửa hồ sơ** — đổi avatar tại trang cá nhân

---

## 📁 Cấu trúc thư mục

```
PTUDW/
├── backend/              # Node.js Express API server
│   ├── controllers/      # Xử lý logic request
│   ├── middlewares/      # Auth, error handling,...
│   ├── migrations/       # Knex DB migrations
│   ├── models/           # Database models
│   ├── routers/          # Định nghĩa routes
│   ├── seeds/            # Dữ liệu mẫu
│   ├── services/         # Business logic
│   ├── .env              # Biến môi trường
│   ├── knexfile.js       # Cấu hình database
│   └── server.js         # Entry point
├── frontend/             # React + Vite
│   ├── src/              # Source code
│   ├── .env              # Biến môi trường
│   └── vite.config.js
└── images/               # Ảnh chụp màn hình sản phẩm
```

---

## 📝 Ghi chú

- Database **Supabase** đã được cấu hình sẵn — không cần cài PostgreSQL local
- File `.env` **không** được commit lên Git
- Backend sử dụng **ES Modules** (`"type": "module"`) — dùng cú pháp `import/export`
- Chi tiết troubleshooting xem tại [HOW_TO_RUN.md](HOW_TO_RUN.md)
