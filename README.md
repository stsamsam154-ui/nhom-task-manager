# Nhom Task Manager

Ứng dụng quản lý công việc nhóm theo mô hình Kanban Board. Project có các phần chính: đăng ký/đăng nhập, quản lý task, kéo thả trạng thái, deadline, task quan trọng, bình luận, nhãn màu và giao diện sáng/tối.

## Tính năng chính

- Đăng ký và đăng nhập bằng JWT.
- Quản lý task theo 4 cột: Cần làm, Đang làm, Đánh giá, Hoàn thành.
- Kéo thả task giữa các cột bằng `@dnd-kit`.
- Tạo, cập nhật trạng thái, đánh dấu quan trọng và xóa task.
- Đặt deadline cho task và hiển thị thông báo task quá hạn/sắp đến hạn.
- Lọc task theo tất cả, hôm nay, quan trọng, sắp hết hạn và quá hạn.
- Bình luận trong từng task.
- Đổi avatar người dùng.
- Gắn nhãn màu cho task: Học tập, Nhóm, Gấp, Cá nhân.
- Khu vực Ngày của tôi và Tổng quan nhanh để theo dõi tiến độ.
- Giao diện light/dark mode, đã tối ưu lại màu sắc và spacing để dễ nhìn hơn.

## Công nghệ sử dụng

### Frontend

- React
- Vite
- React Router
- Axios
- `@dnd-kit/core`

### Backend

- NestJS
- TypeORM
- PostgreSQL
- Passport JWT
- Bcrypt

## Cấu trúc thư mục

```text
nhom-task-manager/
|-- backend/      # API NestJS, database entities, auth, task, comment, user
|-- frontend/     # Giao diện React/Vite
`-- README.md
```

## Yêu cầu trước khi chạy

- Node.js
- npm
- PostgreSQL

Tạo database PostgreSQL tên `task_manager` trước khi chạy backend.

## Cấu hình môi trường

Project có sẵn file mẫu:

- `backend/.env.example`
- `frontend/.env.example`

Khi chạy lần đầu, có thể copy file mẫu thành `.env` rồi chỉnh lại thông tin phù hợp với máy.

### Backend

Tạo file `backend/.env` với nội dung mẫu:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=task_manager

JWT_SECRET=my_secret_key_123
FRONTEND_URL=http://localhost:5173
```

Trong môi trường development, TypeORM đang bật `synchronize` để tự động đồng bộ bảng theo entity. Khi deploy production, nên đặt `NODE_ENV=production` và dùng migration thay vì synchronize.

### Frontend

Tạo file `frontend/.env` nếu muốn đổi địa chỉ API:

```env
VITE_API_URL=http://localhost:3000
```

## Cách chạy project

### 1. Chạy backend

```bash
cd backend
npm install
npm run start:dev
```

Backend mặc định chạy tại:

```text
http://localhost:3000
```

### 2. Chạy frontend

Mở terminal khác:

```bash
cd frontend
npm install
npm run dev
```

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

## Script hay dùng

### Frontend

```bash
npm run dev
npm run build
npm run lint
```

### Backend

```bash
npm run start:dev
npm run build
npm run test
```

## Kiểm tra trước khi nộp

Các lệnh đã dùng để kiểm tra project:

```bash
cd frontend
npm run lint
npm run build

cd ../backend
npm run build
npm run test
```

## API chính

- `POST /auth/register` - đăng ký tài khoản
- `POST /auth/login` - đăng nhập
- `GET /tasks` - lấy danh sách task
- `POST /tasks` - tạo task
- `PUT /tasks/:id` - cập nhật task
- `PUT /tasks/:id/status` - cập nhật trạng thái task
- `PUT /tasks/:id/important` - bật/tắt task quan trọng
- `DELETE /tasks/:id` - xóa task
- `GET /comments/task/:taskId` - lấy comment theo task
- `POST /comments` - tạo comment
- `DELETE /comments/:id` - xóa comment
- `PUT /users/:id/avatar` - cập nhật avatar

## Ghi chú đồ án

Project thể hiện được các yêu cầu nên có của một hệ thống quản lý công việc nhóm:

- Có phần xác thực người dùng.
- Có CRUD dữ liệu chính.
- Có quan hệ dữ liệu giữa user, task và comment.
- Có giao diện trực quan để theo dõi tiến độ.
- Có deadline và lọc task để tăng tính thực tế.
- Có tối ưu trải nghiệm kéo thả và giao diện.

## Thành viên

- Phạm Vũ Minh Hiếu
