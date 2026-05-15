# Phase 1: Core Backend — NestJS & Prisma

Membangun REST API lengkap untuk platform e-commerce Gadget Solution menggunakan NestJS 10+ dengan Prisma ORM, termasuk autentikasi JWT, modul produk (CRUD), modul pesanan, dan data seeding 20+ produk gaming.

## User Review Required

> [!IMPORTANT]
> **Database harus aktif.** Sebelum eksekusi dimulai, container PostgreSQL dari `docker-compose.yml` harus sudah running di port `5433`. Saya akan menjalankan `docker compose up -d` sebagai langkah pertama.

> [!WARNING]
> **Prisma `@@fulltext` index** hanya tersedia untuk MySQL/MariaDB. Karena kita menggunakan PostgreSQL, saya akan mengganti `@@fulltext([name, description])` dengan indeks `GIN` via `tsvector` atau menghapusnya dan menggunakan `ILIKE` untuk pencarian teks. Pendekatan yang saya pilih: **menghapus `@@fulltext`** dan menggunakan pencarian `ILIKE` sederhana di service layer, karena pencarian semantik utama sudah ditangani oleh pgvector di AI Service.

## Proposed Changes

### Step 1: Scaffolding NestJS Project

#### [NEW] NestJS Project di `/backend`

Menjalankan NestJS CLI untuk men-scaffold proyek baru di dalam folder `backend/`:

```bash
cd backend
npx -y @nestjs/cli@latest new . --package-manager npm --skip-git
```

Lalu install dependensi tambahan:
```bash
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt prisma @prisma/client bcrypt class-validator class-transformer
npm install -D @types/bcrypt @types/passport-jwt
```

---

### Step 2: Prisma Schema & Migration

#### [NEW] prisma/schema.prisma

Konfigurasi Prisma ORM terhubung ke PostgreSQL di port `5433`. Schema mengikuti spesifikasi PROJECT_PLAN.md (baris 533–617) dengan penyesuaian:
- Menghapus `@@fulltext` (tidak didukung PostgreSQL)
- Mempertahankan semua model: `User`, `Product`, `Order`, `OrderItem`
- Enum: `UserRole` (ADMIN, CUSTOMER), `OrderStatus` (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)

Kemudian menjalankan:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### [NEW] src/prisma/prisma.module.ts & prisma.service.ts

Membuat Prisma module global agar dapat diinjeksi ke seluruh modul NestJS.

---

### Step 3: Auth Module

#### [NEW] src/auth/

Struktur file sesuai PROJECT_PLAN.md (baris 622–638):

| File | Fungsi |
|------|--------|
| `auth.module.ts` | Mendaftarkan service, controller, JWT strategy |
| `auth.service.ts` | Signup (hash bcrypt), login (validasi + JWT generate) |
| `auth.controller.ts` | `POST /auth/signup`, `POST /auth/login`, `GET /auth/profile` |
| `jwt.strategy.ts` | Passport JWT strategy untuk validasi token |
| `jwt-auth.guard.ts` | Guard dekorator untuk endpoint terproteksi |
| `dto/signup.dto.ts` | DTO validasi registrasi (email, password, firstName, lastName) |
| `dto/login.dto.ts` | DTO validasi login (email, password) |

---

### Step 4: Products Module

#### [NEW] src/products/

Struktur file sesuai PROJECT_PLAN.md (baris 640–649):

| File | Fungsi |
|------|--------|
| `products.module.ts` | Mendaftarkan service & controller |
| `products.service.ts` | CRUD: findAll (filter, pagination), findOne, create, update, delete |
| `products.controller.ts` | REST endpoints dengan role guard (Admin untuk CUD) |
| `dto/create-product.dto.ts` | Validasi pembuatan produk |
| `dto/update-product.dto.ts` | Validasi partial update (PartialType) |

**Endpoints:**
- `GET /products` — List semua produk (filter: category, search, priceMin, priceMax, pagination)
- `GET /products/:id` — Detail produk
- `POST /products` — Buat produk baru (Admin only)
- `PATCH /products/:id` — Update produk (Admin only)
- `DELETE /products/:id` — Hapus produk (Admin only)

---

### Step 5: Orders Module

#### [NEW] src/orders/

Struktur file sesuai PROJECT_PLAN.md (baris 651–660):

| File | Fungsi |
|------|--------|
| `orders.module.ts` | Mendaftarkan service & controller |
| `orders.service.ts` | Create order (validasi stok, potong stok, hitung total), findAll by user, findOne, update status |
| `orders.controller.ts` | REST endpoints terproteksi JWT |
| `dto/create-order.dto.ts` | DTO untuk pembuatan order (items array) |

**Endpoints:**
- `POST /orders` — Buat pesanan baru (Customer, validasi stok)
- `GET /orders` — List pesanan milik user yang login
- `GET /orders/:id` — Detail pesanan
- `PATCH /orders/:id/status` — Update status (Admin only)

---

### Step 6: CORS & Global Config

#### [MODIFY] src/main.ts

Menerapkan konfigurasi sesuai PROJECT_PLAN.md (baris 1087–1102):
- Enable CORS untuk frontend (`http://localhost:3000`)
- Global validation pipe (`class-validator`)
- Global exception filter
- Port dari environment variable (default `3001`)

---

### Step 7: Data Seeding

#### [NEW] prisma/seed.ts

Membuat seeder 20+ produk gadget gaming realistis (sesuai PROJECT_PLAN.md baris 662–703):
- Gaming Smartphone (ASUS ROG, Samsung Galaxy S Ultra, dll)
- Gaming Laptop (MSI Raider, ASUS ROG Strix, Razer Blade, dll)
- Gaming Peripherals (Mouse, Keyboard, Monitor, dll)
- Audio & Accessories

Ditambah 1 akun Admin default dan 1 akun Customer demo.

---

### Step 8: Dokumentasi

#### [MODIFY] docs/DOCUMENTATION.md

Memperbarui bagian:
- REST API endpoint reference (Auth, Products, Orders)
- Database schema yang telah dimigrasi
- Changelog Phase 1

---

## Verification Plan

### Automated Tests
1. `docker compose up -d` — Pastikan container PostgreSQL aktif
2. `npx prisma migrate dev` — Pastikan migrasi berhasil
3. `npx prisma db seed` — Pastikan data seeder masuk ke DB
4. `npm run start:dev` — Pastikan NestJS server berjalan di port 3001
5. Tes endpoint via browser subagent atau curl:
   - `POST /auth/signup` → 201 Created
   - `POST /auth/login` → 200 + JWT token
   - `GET /products` → 200 + array produk
   - `POST /orders` → 201 + order record
