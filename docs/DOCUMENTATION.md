# 📖 Gadget Solution Documentation

Dokumentasi resmi untuk pengembangan platform Gadget Solution E-Commerce. Halaman ini akan terus diperbarui seiring berjalannya perkembangan fitur, API, dan perubahan teknis pada proyek ini.

---

## 🚀 Ringkasan Proyek

*   **Nama Proyek:** Gadget Solution E-Commerce Platform
*   **Arsitektur:** Microservices (Monorepo)
*   **Stack Utama:** Next.js (Frontend), NestJS + Prisma (Backend), FastAPI (AI Service), PostgreSQL + pgvector (Database)

---

## 🗂️ Daftar Isi Dokumentasi

1.  [💡 Panduan Menjalankan Proyek (Local Setup)](#-panduan-menjalankan-proyek-local-setup)
2.  [⚙️ Layanan Microservices & Konfigurasi](#️-layanan-microservices--konfigurasi)
3.  [🔌 Arsitektur REST API (NestJS)](#-arsitektur-rest-api-nestjs)
4.  [🤖 Dokumentasi AI Microservice (FastAPI & RAG)](#-dokumentasi-ai-microservice-fastapi--rag)
5.  [🎨 Antarmuka & Komponen Desain (Next.js)](#-antarmuka--komponen-desain-nextjs)
6.  [💾 Skema Database & Migrasi](#-skema-database--migrasi)
7.  [⚠️ Catatan Perubahan (Changelog)](#️-catatan-perubahan-changelog)

---

## 💡 Panduan Menjalankan Proyek (Local Setup)

### 1. Inisialisasi Monorepo
Jalankan perintah pembantu setup di direktori root untuk menyalin semua berkas `.env.example` menjadi berkas `.env` fungsional:
```bash
bash scripts/setup.sh
```

### 2. Menjalankan Database Docker
Jalankan infrastruktur PostgreSQL beserta ekstensi `pgvector` yang terisolasi:
```bash
docker-compose up -d
```
Layanan database PostgreSQL akan berjalan secara lokal pada port host `5434`.

## ⚙️ Layanan Microservices & Konfigurasi

Berikut adalah tabel konfigurasi mikroservis yang telah dipetakan pada monorepo:

| Layanan | Teknologi Utama | Port Default | Port DB Host | Lokasi Folder |
|---------|-----------------|--------------|--------------|---------------|
| **Frontend** | Next.js 14 | `3000` | - | `/frontend` |
| **Backend API** | NestJS 10 | `3001` | `5434` | `/backend` |
| **AI Microservice** | FastAPI (Python) | `8000` | `5434` | `/ai-service` |
| **Database** | PostgreSQL + pgvector | `5432` (internal) | `5434` (eksternal) | `docker-compose` |

Setiap direktori telah dilengkapi konfigurasi templat `.env.example` yang siap pakai dan saling terhubung.

## 🔌 Arsitektur REST API (NestJS)

Backend NestJS berjalan di `http://localhost:3001/api`. Semua endpoint menggunakan prefix `/api`.

### Autentikasi (`/api/auth`)

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `POST` | `/api/auth/signup` | Public | Registrasi user baru (email, password, firstName, lastName) |
| `POST` | `/api/auth/login` | Public | Login, mengembalikan JWT token + data user |
| `GET` | `/api/auth/profile` | 🔒 JWT | Mendapatkan profil user yang sedang login |

**Contoh Login Request:**
```json
POST /api/auth/login
{
  "email": "admin@gadgetsolution.com",
  "password": "admin123"
}
```

**Contoh Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "cmp50k3k80000vw1g...",
    "email": "admin@gadgetsolution.com",
    "firstName": "Admin",
    "lastName": "GadgetSol",
    "role": "ADMIN"
  }
}
```

### Produk (`/api/products`)

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `GET` | `/api/products` | Public | List produk (filter: `category`, `search`, `priceMin`, `priceMax`, `page`, `limit`) |
| `GET` | `/api/products/categories` | Public | List semua kategori yang tersedia |
| `GET` | `/api/products/:id` | Public | Detail produk berdasarkan ID |
| `POST` | `/api/products` | 🔒 Admin | Membuat produk baru |
| `PATCH` | `/api/products/:id` | 🔒 Admin | Update data produk |
| `DELETE` | `/api/products/:id` | 🔒 Admin | Hapus produk |

**Query Parameters `GET /api/products`:**
- `category` — Filter berdasarkan kategori (contoh: `Gaming Laptop`)
- `search` — Pencarian teks pada nama & deskripsi (ILIKE)
- `priceMin` / `priceMax` — Rentang harga
- `page` — Halaman (default: 1)
- `limit` — Jumlah per halaman (default: 12)

### Pesanan (`/api/orders`)

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `POST` | `/api/orders` | 🔒 Customer | Buat pesanan baru (validasi stok + potong stok transaksional) |
| `GET` | `/api/orders` | 🔒 Customer | List pesanan milik user yang login |
| `GET` | `/api/orders/:id` | 🔒 JWT | Detail pesanan |
| `GET` | `/api/orders/admin/all` | 🔒 Admin | List semua pesanan (filter `status`, `page`, `limit`) |
| `PATCH` | `/api/orders/:id/status` | 🔒 Admin | Update status pesanan |

**Contoh Create Order:**
```json
POST /api/orders
Authorization: Bearer <jwt_token>
{
  "items": [
    { "productId": "cmp50k3k...", "quantity": 1 },
    { "productId": "cmp50k3m...", "quantity": 2 }
  ]
}
```

## 🤖 Dokumentasi AI Microservice (FastAPI & RAG)

AI Microservice dibangun menggunakan **Python 3.13** dan **FastAPI**, mengimplementasikan pola **Retrieval-Augmented Generation (RAG)** dengan arsitektur *triple-source retrieval* — mengambil konteks dari **katalog produk**, **dokumen pengetahuan toko**, dan **pencarian internet real-time** secara bersamaan, terintegrasi dengan database PostgreSQL melalui ekstensi `pgvector`.

### Arsitektur RAG & Alur Kerja

#### Sumber Data (Triple-Source Retrieval)

| # | Sumber | Mekanisme | Isi | Kapan Aktif |
|---|--------|-----------|-----|-------------|
| 1 | **Katalog Produk** | pgvector (`product_embeddings`) | Nama, deskripsi, kategori, spesifikasi teknis dari REST API NestJS (20 produk) | Selalu |
| 2 | **Dokumen Pengetahuan** | pgvector (`document_chunks`) | Kebijakan toko, FAQ, panduan konsultasi, glosarium teknis, peringatan produk (9 dokumen → ~40+ chunk) | Selalu |
| 3 | **Pencarian Internet** | DuckDuckGo + Trafilatura (`internet_search_agent.py`) | Spesifikasi lengkap, review, benchmark, perbandingan real-time dari situs gadget terpercaya | Hanya untuk query terkait produk |

#### Dokumen RAG yang Digunakan

Semua dokumen berada di `ai-service/docs/`:

| File | Jenis | Deskripsi |
|------|-------|-----------|
| `rag_store_policy.md` | Kebijakan Toko | Pengiriman, retur, garansi, pembayaran |
| `rag_faq_dynamic.md` | FAQ Dinamis | Pertanyaan umum pelanggan beserta jawaban |
| `rag_product_catalog.md` | Katalog Produk | Spesifikasi teknis resmi produk |
| `rag_product_comparison.md` | Perbandingan | Tabel perbandingan antar produk |
| `rag_product_warnings.md` | Peringatan Produk | Limitasi dan ekspektasi realistis setiap produk |
| `rag_recommendation_guide.md` | Panduan Rekomendasi | Pemetaan kebutuhan pelanggan ke produk yang sesuai |
| `rag_consultation_guide.md` | Panduan Konsultasi | Alur diagnosis kebutuhan pelanggan sebelum merekomendasikan |
| `rag_technical_glossary.md` | Glosarium Teknis | Penjelasan istilah teknis (GPU, VRAM, OLED, dll.) |
| `rag_metadata_schema.md` | Skema Metadata | Referensi field metadata untuk filtering pgvector |

#### Pencarian Internet (`internet_search_agent.py`)

Modul ini menggunakan **DuckDuckGo** (gratis, tanpa API key) dan **Trafilatura** untuk ekstraksi konten halaman web. Fitur utama:
- **Smart Query Building:** Mengkombinasikan pertanyaan user dengan nama produk yang terdeteksi dari database untuk menghasilkan query pencarian yang akurat
- **Trusted Domain Ranking:** Memprioritaskan hasil dari situs gadget terpercaya (GSMArena, Notebookcheck, JagatReview, Pricebook, dll.)
- **Selective Activation:** Hanya aktif untuk query terkait produk/spesifikasi — tidak aktif untuk pertanyaan kebijakan toko atau sapaan umum
- **Concurrent Page Fetching:** Mengambil 2 halaman teratas secara paralel untuk kecepatan

#### System Prompt

System prompt dimuat secara otomatis dari file `ai-service/docs/SYSTEM_PROMPT_GADGET_ADVISOR.md`. File ini **tidak di-embed ke pgvector** — melainkan dikirim langsung sebagai parameter `system` ke LLM API setiap kali ada permintaan chat. Prompt ini mengatur identitas AI (Gadget Advisor), batasan tugas, alur konsultasi wajib, format respons, dan proteksi keamanan terhadap *prompt injection*.

#### Alur Kerja RAG (Per Request)

1. User mengirimkan query melalui `POST /api/chat`
2. Query di-embed menggunakan `OpenAIEmbeddings` (`text-embedding-3-small`)
3. **Triple retrieval** dilakukan:
   - Tabel `product_embeddings` → 3 produk terdekat (cosine distance)
   - Tabel `document_chunks` → 5 chunk pengetahuan terdekat (cosine distance)
   - DuckDuckGo → pencarian internet untuk spesifikasi dan review (hanya jika query terkait produk)
4. Hasil retrieval digabungkan ke dalam blok `[CONTEXT]...[/CONTEXT]` dengan 3 bagian: Pengetahuan Toko, Katalog Produk, Informasi Internet
5. Query pengguna ditempatkan dalam blok `[USER QUERY]`
6. System prompt + context + query dikirim ke `ChatOpenAI` (`gpt-4o-mini`)
7. Respons dikembalikan beserta daftar `sources` (produk yang direferensikan)

#### Pipeline Generasi Embedding (`scripts/generate_embeddings.py`)

Script ini menjalankan **dua fase** secara berurutan:
- **Fase 1 — Product Embeddings:** Mengambil produk dari REST API NestJS, merangkai representasi dokumen, dan menyimpan vektor ke tabel `product_embeddings`
- **Fase 2 — Document Chunk Embeddings:** Membaca 9 file `rag_*.md`, mem-*parse* frontmatter YAML, memecah per heading `##`, dan menyimpan vektor per chunk ke tabel `document_chunks`

```bash
# Menjalankan pipeline embedding (dari folder ai-service dengan venv aktif)
python scripts/generate_embeddings.py
```

### Model Database AI Service (SQLAlchemy)

| Model | Tabel | Kolom Utama |
|-------|-------|-------------|
| **ProductEmbedding** | `product_embeddings` | `id`, `product_id`, `product_name`, `product_description`, `embedding` (Vector 1536), `tech_specs_summary` |
| **DocumentChunk** | `document_chunks` | `id`, `doc_source`, `doc_type`, `chunk_id`, `chunk_title`, `chunk_content`, `tags`, `embedding` (Vector 1536) |

### Endpoint Konsultan AI (`/api/chat`)

Backend FastAPI berjalan di port `8000`.

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `POST` | `/api/chat` | Public | Bertanya kepada Konsultan AI berbasis RAG |
| `GET` | `/` | Public | *Health check* dan status model embedding |
| `GET` | `/docs` | Public | Swagger UI interaktif untuk pengujian endpoint |

**Contoh Chat Request:**
```json
POST http://localhost:8000/api/chat
Content-Type: application/json

{
  "message": "Saya butuh rekomendasi laptop gaming untuk main Cyberpunk 2077"
}
```

**Contoh Chat Response:**
```json
{
  "message": "Sebelum saya rekomendasikan, boleh saya tahu dulu budget kamu sekitar berapa? ...",
  "sources": [
    {
      "product_id": "cmp50k3nb000fvw1gql9o0hyr",
      "name": "ASUS ROG Zephyrus G14 2025"
    }
  ],
  "timestamp": "2026-05-15T19:12:00.000000"
}
```

### Struktur Direktori AI Service

```
ai-service/
├── main.py                          # Entry point FastAPI
├── config.py                        # Pydantic Settings (.env loader)
├── requirements.txt                 # Dependensi Python
├── .env / .env.example              # Konfigurasi lingkungan
├── app/
│   ├── __init__.py
│   ├── database.py                  # SQLAlchemy engine + pgvector init
│   ├── models.py                    # ProductEmbedding + DocumentChunk
│   ├── routes/
│   │   ├── __init__.py
│   │   └── chat.py                  # POST /api/chat endpoint
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── chat.py                  # Pydantic request/response models
│   └── services/
│       ├── __init__.py
│       ├── vectorizer.py            # OpenAIEmbeddings wrapper
│       ├── llm_client.py            # ChatOpenAI wrapper
│       ├── internet_search_agent.py # DuckDuckGo + Trafilatura async search
│       └── rag_engine.py            # Triple-source RAG pipeline
├── docs/
│   ├── SYSTEM_PROMPT_GADGET_ADVISOR.md  # System prompt (NOT embedded)
│   └── rag_*.md                     # 9 dokumen RAG knowledge (embedded)
└── scripts/
    └── generate_embeddings.py       # Two-phase embedding pipeline
```


## 🎨 Antarmuka & Komponen Desain (Next.js)

Frontend dibangun menggunakan **Next.js 16** (App Router) + **Tailwind CSS v4** + **TypeScript**, menerapkan sistem desain dari `DESIGN.md` (warm cream editorial) yang dipadukan dengan pola kartu produk ala **Syihab Store** (trust badge, brand header, info cicilan).

### Teknologi & Dependensi

| Paket | Versi | Fungsi |
|-------|-------|--------|
| `next` | 16.2.6 | Framework React SSR/SSG dengan App Router |
| `tailwindcss` | 4.3.0 | CSS utility framework (konfigurasi via `@theme inline`) |
| `axios` | latest | HTTP client untuk komunikasi dengan backend NestJS & AI FastAPI |
| `zustand` | latest | State management ringan untuk keranjang belanja & autentikasi |
| `lucide-react` | latest | Ikon SVG yang konsisten |
| `@tanstack/react-query` | latest | Data fetching & caching (disiapkan, belum digunakan penuh) |

### Sistem Desain yang Diterapkan

Token desain dari `DESIGN.md` diimplementasikan sebagai CSS custom properties dalam `@theme inline` (Tailwind v4):

| Token DESIGN.md | Nilai | Penerapan di Frontend |
|---|---|---|
| Canvas | `#f7f7f4` | Background halaman (warm cream, bukan putih) |
| Cursor Orange | `#f54e00` | Semua tombol CTA, label harga, aksen brand |
| Ink | `#26251e` | Judul display, teks kuat, bar trust badge |
| Body | `#5a5852` | Teks paragraf utama |
| Hairline | `#e6e5e0` | Border 1px pada kartu & divider (tanpa shadow) |
| Surface Card | `#ffffff` | Background kartu produk |
| Timeline Palette | 5 warna pastel | Pill kategori & animasi loading AI chat |
| Section Spacing | 80px | Jarak vertikal antar section |
| Inter 400 | display weight | Gaya magazine editorial (tidak bold) |

### Struktur Direktori Frontend

```
frontend/src/
├── app/
│   ├── globals.css             # Sistem desain: warna, tipografi, spacing
│   ├── layout.tsx              # Root layout (Navbar + Footer + ChatWidget)
│   ├── page.tsx                # Halaman Utama (Hero + Grid Produk)
│   ├── products/
│   │   ├── page.tsx            # Katalog Produk (search, filter, pagination)
│   │   └── [id]/
│   │       └── page.tsx        # Detail Produk (SSR, spek teknis, CTA)
│   ├── auth/
│   │   ├── login/page.tsx      # Login (JWT, demo credentials)
│   │   └── signup/page.tsx     # Registrasi (JWT)
│   └── checkout/
│       └── page.tsx            # Checkout (ringkasan + order API)
├── components/
│   ├── Navbar.tsx              # Header sticky: logo, search bar, cart badge, auth
│   ├── Footer.tsx              # Footer 5-kolom + newsletter + payment badges
│   ├── ProductCard.tsx         # ⭐ Kartu produk ala Syihab Store
│   ├── CategoryPill.tsx        # Pill filter kategori (warna timeline palette)
│   ├── HeroBanner.tsx          # Banner hero: headline + gradient blob + CTA
│   ├── CartDrawer.tsx          # Panel keranjang geser dari kanan
│   └── ChatWidget.tsx          # ⭐ Widget Konsultan AI (FAB + chat panel)
├── hooks/
│   ├── useProducts.ts          # Fetch produk + fallback mock data
│   ├── useAuth.ts              # Login/signup JWT via NestJS API
│   └── useChat.ts              # Chat AI via FastAPI RAG endpoint
├── lib/
│   ├── types.ts                # Interface TypeScript (Product, User, Order, Chat)
│   ├── api.ts                  # Axios instance NestJS + JWT interceptor
│   ├── ai-api.ts               # Axios instance FastAPI AI Service
│   ├── store.ts                # Zustand store (cart + auth, persisted)
│   └── mock-data.ts            # Data produk fallback + gambar premium
└── public/
```

### Komponen Utama

#### `ProductCard.tsx` — Kartu Produk (Gaya Syihab Store)

Kartu produk mengadopsi pola visual dari Syihab Store yang dikombinasikan dengan token `DESIGN.md`:

| Elemen | Deskripsi |
|--------|-----------|
| **Brand Header** | Baris atas kartu: "GADGETSOL" (kiri) + "Garansi Resmi ✓" (kanan) dalam `caption-uppercase` |
| **Nama Produk** | Di atas gambar, uppercase 13px — mirip layout Syihab Store |
| **Gambar Produk** | Aspect-ratio square, `object-contain`, hover scale 105% |
| **Trust Badge Bar** | Strip horizontal gelap: "100% ORIGINAL \| FREE ONGKIR \| GARANSI RESMI" |
| **Harga** | "Mulai dari:" + harga dalam `Cursor Orange` bold |
| **Info Cicilan** | "Atau cicilan: 6x Rp.../bln" |
| **Tombol CTA** | "Tambah ke Keranjang" (`button-primary`, orange) |

#### `ChatWidget.tsx` — Widget Konsultan AI

Widget chat mengambang di pojok kanan bawah:

| Elemen | Deskripsi |
|--------|-----------|
| **FAB Button** | Tombol bulat orange dengan ikon Sparkles, shadow orange |
| **Panel Chat** | 380×520px, `surface-card` bg, rounded-xl, ink header |
| **Bubble User** | Background `primary` (orange), teks putih |
| **Bubble AI** | Background `surface-card`, border hairline |
| **Loading** | 3 dot bounce menggunakan warna timeline palette (peach → blue → lavender) |
| **Koneksi** | `POST http://localhost:8000/api/chat` via `ai-api.ts` |

#### `Navbar.tsx` — Navigasi Atas

- Tinggi: 64px (sesuai `DESIGN.md top-nav`)
- Background: canvas + backdrop-blur saat di-scroll
- Search bar: pill-shaped, `surface-card` bg, `hairline` border
- Cart badge: bulatan merah kecil menampilkan jumlah item
- Responsif: hamburger menu pada layar < 768px

### Halaman

#### Halaman Utama (`/`)
- **Hero Banner:** Headline `display-mega` (72px) "Temukan Gadget Impianmu" + dekoratif gradient blob
- **Dual CTA:** "Jelajahi Produk" (primary) + "Tanya AI Konsultan" (secondary, membuka ChatWidget)
- **Trust Indicators:** 100% Original, Free Ongkir, Garansi Resmi
- **Grid Produk:** 4 kolom desktop, 2 tablet, 1 mobile, dengan category pills di atas
- **CTA Band:** Section "Bingung Pilih Gadget?" mendorong user membuka Konsultan AI

#### Katalog Produk (`/products`)
- Search bar pill-shaped di atas
- Category pills horizontal scrollable (warna timeline palette)
- Filter aktif ditampilkan sebagai removable chips
- Grid 3 kolom desktop, dengan pagination
- Mendukung query params: `?category=...&search=...`

#### Detail Produk (`/products/[id]`)
- **Server-Side Rendered** (dynamic route)
- Layout 2 kolom: gambar besar kiri, info kanan
- Trust badges (Shield, Truck, Package) di bawah gambar
- Card harga dengan info cicilan
- Indikator stok (hijau/merah)
- Tabel spesifikasi teknis (dari field `techSpecs` JSON)
- Tombol "Tanya AI" membuka ChatWidget

#### Login & Signup (`/auth/login`, `/auth/signup`)
- Card form centered di atas canvas
- Terhubung langsung ke JWT backend NestJS (`POST /api/auth/login`, `POST /api/auth/signup`)
- Login menyertakan hint demo credentials: `admin@gadgetsolution.com / admin123`
- Toggle visibility password
- Redirect ke home setelah berhasil

#### Checkout (`/checkout`)
- Layout 2 kolom: daftar item (kiri), ringkasan pesanan sticky (kanan)
- Kontrol kuantitas per item
- Pengecekan autentikasi: jika belum login, diarahkan ke login
- Pembuatan pesanan via `POST /api/orders` dengan JWT token
- Halaman sukses setelah order berhasil

### State Management (Zustand)

| Store | Data | Persistensi |
|-------|------|-------------|
| `useCartStore` | `items[]`, `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()` | `localStorage` key `gadgetsol-cart` |
| `useAuthStore` | `user`, `token`, `isAuthenticated`, `setAuth()`, `logout()` | `localStorage` keys `gadgetsol-token`, `gadgetsol-user` |

### Integrasi API

| Instance | Base URL | Konfigurasi |
|----------|----------|-------------|
| `api` (NestJS) | `http://localhost:3001` | JWT token interceptor dari `localStorage`, auto-remove token pada 401 |
| `aiApi` (FastAPI) | `http://localhost:8000` | Timeout 60 detik (RAG membutuhkan waktu) |

**Fallback Mock Data:** Ketika backend NestJS tidak aktif, semua hooks (`useProducts`, `useCategories`) secara otomatis menggunakan data mock dari `mock-data.ts` (8 produk dengan gambar premium dari Unsplash). Tidak ada error yang ditampilkan ke pengguna.

### Cara Menjalankan Frontend

```bash
cd frontend
npm install          # Install dependensi (jika belum)
npm run dev          # Development server di http://localhost:3000
npm run build        # Production build (validasi TypeScript)
```

> **Catatan:** Frontend dapat berjalan mandiri tanpa backend. Data produk akan otomatis menggunakan mock data.

## 💾 Skema Database & Migrasi

Database menggunakan **PostgreSQL 16 + pgvector** melalui image Docker `pgvector/pgvector:pg16`.

### Model Data (Prisma Schema — Backend NestJS)

| Model | Deskripsi | Kolom Utama |
|-------|-----------|-------------|
| **User** | Akun pengguna dengan RBAC | `id`, `email`, `password`, `firstName`, `lastName`, `role` (ADMIN/CUSTOMER) |
| **Product** | Katalog produk gadget | `id`, `name`, `description`, `price`, `stock`, `category`, `techSpecs` (JSON), `images` (array) |
| **Order** | Header pesanan | `id`, `userId` (FK), `totalPrice`, `status` (PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED) |
| **OrderItem** | Baris item pesanan | `id`, `orderId` (FK), `productId` (FK), `quantity`, `priceAtTime` |

### Model Data (SQLAlchemy — AI Service)

| Model | Tabel | Deskripsi | Kolom Utama |
|-------|-------|-----------|-------------|
| **ProductEmbedding** | `product_embeddings` | Vektor embedding produk dari katalog NestJS | `id`, `product_id`, `product_name`, `product_description`, `embedding` (Vector 1536), `tech_specs_summary` |
| **DocumentChunk** | `document_chunks` | Vektor embedding chunk dari dokumen RAG | `id`, `doc_source`, `doc_type`, `chunk_id`, `chunk_title`, `chunk_content`, `tags`, `embedding` (Vector 1536) |

### Migrasi yang Telah Dijalankan

| Tanggal | Nama Migrasi | Deskripsi |
|---------|--------------|-----------|
| 2026-05-14 | `20260514044826_init` | Inisialisasi seluruh tabel: User, Product, Order, OrderItem + enum + indeks |

### Data Seeder (`prisma/seed.ts`)

- **2 User:** Admin (`admin@gadgetsolution.com` / `admin123`) dan Customer Demo (`customer@demo.com` / `customer123`)
- **20 Produk** gaming realistis di 10 kategori: Gaming Smartphone, Gaming Laptop, Gaming Monitor, Gaming Mouse, Gaming Keyboard, Gaming Headset, Graphics Card, Processor, Memory, Storage

## ⚠️ Catatan Perubahan (Changelog)
*(Akan dicatat setiap ada perubahan signifikan pada proyek)*
*   **[2026-05-14]** **Phase 0 Selesai**: Menyelesaikan struktur direktori monorepo, menautkan database PostgreSQL + `pgvector` via Docker Compose di port `5433`, serta merilis templat konfigurasi `.env.example` untuk semua layanan.
### [2026-05-14] Phase 1 Selesai: Core Backend (NestJS & Prisma)

**Perubahan Utama:**
- Scaffolding NestJS project di `/backend` dengan dependensi lengkap
- Prisma ORM dikonfigurasi dan terhubung ke PostgreSQL (port `5434`)
- Migrasi database `init` berhasil: 4 model, 2 enum, indeks
- **Auth Module:** Registrasi, login, JWT token, profil user, role guard (Admin/Customer)
- **Products Module:** CRUD lengkap dengan filter kategori, pencarian ILIKE, rentang harga, dan paginasi
- **Orders Module:** Checkout transaksional (validasi stok, potong stok atomik, hitung total), histori pesanan, manajemen status admin
- Data seeding: 20 produk gaming + 2 akun demo
- CORS dikonfigurasi untuk frontend (`http://localhost:3000`)
- Global validation pipe (`class-validator`) dan prefix `/api`

**Catatan Teknis:**
- Port Docker diubah dari `5433` ke `5434` karena konflik dengan PostgreSQL lokal
- Docker image diubah dari `ankane/pgvector:v0.5.1` ke `pgvector/pgvector:pg16`
- `@@fulltext` index dihapus dari Prisma schema (tidak didukung PostgreSQL)
- Prisma v6 digunakan (v7 memiliki breaking changes)

### [2026-05-14 — 2026-05-15] Phase 2 Selesai: AI Microservice (FastAPI & RAG)

**Iterasi 1 (2026-05-14) — Setup Dasar:**
- ✅ Penyelesaian konflik dependensi (`LangChain 0.3.x`, `Pydantic 2.10.x` untuk Python 3.13)
- ✅ Setup `database.py` dengan inisialisasi pgvector otomatis
- ✅ Model `ProductEmbedding` untuk menyimpan vektor produk
- ✅ Layanan `vectorizer.py` (OpenAIEmbeddings), `llm_client.py` (ChatOpenAI)
- ✅ RAG engine awal dengan single-source retrieval (hanya produk)
- ✅ Endpoint `POST /api/chat` dan health check `GET /`
- ✅ Script `generate_embeddings.py` — berhasil embed 20 produk

**Iterasi 2 (2026-05-15) — Redesign Arsitektur RAG:**
- ✅ Penambahan model `DocumentChunk` untuk menyimpan embedding dokumen pengetahuan toko
- ✅ Pembuatan 9 dokumen RAG knowledge base (`rag_*.md`): kebijakan toko, FAQ, katalog, perbandingan, peringatan produk, panduan rekomendasi, panduan konsultasi, glosarium teknis, skema metadata
- ✅ Pembuatan `SYSTEM_PROMPT_GADGET_ADVISOR.md` — system prompt profesional dengan proteksi prompt injection, alur konsultasi wajib, dan format respons terstruktur
- ✅ Redesign `rag_engine.py` ke arsitektur **dual-source retrieval**: mengambil konteks dari `product_embeddings` (3 produk) + `document_chunks` (5 chunk) secara bersamaan
- ✅ System prompt dimuat otomatis dari file markdown, bukan di-hardcode
- ✅ Format konteks menggunakan blok `[CONTEXT]...[/CONTEXT]` dan `[USER QUERY]` sesuai spesifikasi system prompt
- ✅ Redesign `generate_embeddings.py` menjadi two-phase pipeline: Fase 1 (produk dari API) + Fase 2 (chunking dokumen RAG per heading `##`)
- ✅ Dokumentasi DOCUMENTATION.md diperbarui lengkap

**Iterasi 3 (2026-05-15) — Integrasi Internet Search:**
- ✅ Rewrite `internet_search_agent.py` ke versi async dengan DuckDuckGo (gratis, tanpa API key) + Trafilatura untuk ekstraksi konten halaman web
- ✅ Fitur Smart Query Building: mengkombinasikan pertanyaan user dengan nama produk terdeteksi dari database
- ✅ Fitur Trusted Domain Ranking: memprioritaskan situs gadget terpercaya (GSMArena, Notebookcheck, JagatReview, Pricebook, dll.)
- ✅ Fitur Selective Activation: pencarian internet hanya aktif untuk query terkait produk, tidak untuk pertanyaan kebijakan toko
- ✅ Upgrade `rag_engine.py` dari dual-source ke **triple-source retrieval**: pgvector produk + pgvector dokumen + DuckDuckGo internet search
- ✅ Dependensi baru: `duckduckgo-search>=7.0.0`, `trafilatura>=2.0.0`
- ✅ Dokumentasi DOCUMENTATION.md diperbarui

### [2026-05-15] Phase 3 Selesai: Frontend Development (Next.js)

**Perubahan Utama:**
- Scaffolding Next.js 16 (App Router) di `/frontend` dengan TypeScript + Tailwind CSS v4
- Implementasi penuh sistem desain `DESIGN.md`: warm cream canvas, Cursor Orange CTA, hairline-only depth, Inter font, 80px section rhythm
- Adaptasi pola kartu produk Syihab Store: brand header, trust badge bar, info cicilan
- **7 Komponen React:** Navbar, Footer, ProductCard, CategoryPill, HeroBanner, CartDrawer, ChatWidget
- **6 Halaman:** Home (hero + grid), Katalog (search + filter + pagination), Detail Produk (SSR + spek), Login (JWT), Signup (JWT), Checkout (order API)
- State management Zustand: cart (persisted) + auth (JWT token)
- Integrasi API: NestJS backend (`/api/products`, `/api/auth`, `/api/orders`) + FastAPI AI (`/api/chat`)
- Fallback mock data otomatis ketika backend offline
- Dependensi: `axios`, `zustand`, `lucide-react`, `@tanstack/react-query`

**Catatan Teknis:**
- Tailwind CSS v4 menggunakan `@theme inline` di CSS (bukan `tailwind.config.ts`)
- Next.js 16 memerlukan Suspense boundary untuk `useSearchParams()` pada halaman static
- Gambar eksternal dikonfigurasi via `next.config.ts` `remotePatterns` (Unsplash, Pinterest)
- `npm run build` berhasil: 0 error, 8/8 route terkompilasi
