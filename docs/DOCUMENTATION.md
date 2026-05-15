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
*(Belum Diimplementasi)*
Penerapan layout, routing, tema warna sesuai `DESIGN.md`, dan komponen React (seperti ChatWidget & Cart).

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
