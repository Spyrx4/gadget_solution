# 📊 Gadget Solution Project Diagrams (Mermaid Version)

Dokumen ini berisi visualisasi arsitektur, alur data, skema database, dan linimasa proyek Gadget Solution menggunakan sintaksis **Mermaid.js**. Kode ini dapat di-render langsung oleh VS Code, GitHub, atau peninjau Markdown modern lainnya.

---

## 1. Core Components

```mermaid
graph TD
    subgraph GSP["Gadget Solution Platform"]
        FE["Frontend (Next.js)<br/>• Web Storefront<br/>• Chat Widget<br/>• Product Pages<br/>• Checkout"]
        BE["Backend (NestJS)<br/>• REST API<br/>• Auth/JWT<br/>• Business Logic<br/>• Validation"]
        AI["AI (Python)<br/>• RAG Engine<br/>• Embeddings<br/>• LLM Chat"]
    end
    DB[(PostgreSQL + pgvector)]
    
    FE --> DB
    BE --> DB
    AI --> DB
```

---

## 2. High-Level System Architecture

```mermaid
graph TD
    subgraph Client["Client Layer"]
        Browser["Web Browser"]
        Mobile["Mobile App"]
        Widget["Chat Widget"]
    end
    
    CDN["CDN / Static Files"]

    subgraph FE_Serv["Frontend Service (Next.js + TS)"]
        Pages["Product Pages (SSR)"]
        Checkout["Checkout Flow"]
        Dash["User Dashboard"]
        Pay["Payment Integration"]
        Search["Search & Filter"]
        Track["Order Tracking"]
        AIChat["AI Chat Widget"]
        Responsive["Responsive Design"]
    end

    Gateway["API Gateway / Load Balancer"]

    subgraph BE_Serv["Backend Service (NestJS + Prisma)"]
        B_Auth["Auth & JWT"]
        B_Prod["Product Management"]
        B_Order["Order Processing"]
        B_User["User Management"]
        B_Pay["Payment API"]
        B_Inv["Inventory Tracking"]
        B_Anal["Analytics"]
    end

    subgraph AI_Serv["AI Microservice (FastAPI + Python)"]
        AI_RAG["RAG Engine"]
        AI_Embed["Embeddings"]
        AI_Vec["Vector Search"]
        AI_LLM["LLM Integration"]
        AI_Stream["Chat Streaming"]
    end

    subgraph DBL["Database Layer (PostgreSQL + pgvector)"]
        T_Users[(Users Table)]
        T_Orders[(Orders Table)]
        T_Prods[(Products Table)]
        T_Items[(OrderItems Table)]
        T_Embed[(ProductEmbedding)]
        T_Inv[(Inventory Table)]
        T_Tx[(Transactions Table)]
        T_Rev[(Reviews Table)]
    end

    subgraph Ext["External Services"]
        Ext_LLM["Claude / OpenAI API"]
        Ext_Pay["Stripe / PayPal"]
        Ext_Mail["SendGrid / AWS SES"]
        Ext_Stor["AWS S3 / GCS"]
        Ext_Anal["Google Analytics"]
    end

    Client --> FE_Serv
    FE_Serv --> Gateway
    Gateway --> BE_Serv
    Gateway --> AI_Serv
    
    BE_Serv --> DBL
    AI_Serv --> DBL
    
    BE_Serv --> Ext
    AI_Serv --> Ext
```

---

## 3. Frontend Architecture

```mermaid
graph TD
    subgraph APP["Next.js Frontend Application"]
        subgraph P["Pages (App Router)"]
            H["/ (Home)"]
            Pr["/products"]
            L["/auth/login"]
            C["/checkout"]
            PD["/products/[id]"]
            D["/dashboard"]
        end

        subgraph CH["Components & Hooks Layer"]
            Nav["Navbar"]
            PC["ProductCard"]
            CW["ChatWidget"]
            CF["CheckoutForm"]
            Foot["Footer"]
            FP["FilterPanel"]
            uA["useAuth"]
            uP["useProducts"]
            uC["useCart"]
            uCh["useChat"]
        end

        subgraph SM["State Management & Data Fetching"]
            Zus["Zustand (Cart State)"]
            RQ["React Query (API Data)"]
            Ctx["Context API (Auth)"]
        end

        subgraph AC["API Client & Services"]
            Ax["Axios Instance"]
            sA["Auth Service"]
            sP["Product Service"]
            sCh["Chat Service"]
        end
    end

    subgraph BE["Backend API (NestJS)"]
    end
    subgraph AIS["AI Chat Service (FastAPI)"]
    end

    P --- CH
    CH --- SM
    SM --- AC
    AC --> BE
    AC --> AIS
```

---

## 4. Backend Service Architecture

```mermaid
graph TD
    subgraph NSA["NestJS Backend Application"]
        subgraph CTRL["Controllers Layer"]
            C1["AuthController"]
            C2["ProductsController"]
            C3["OrdersController"]
            C4["UsersController"]
            C5["PaymentController"]
            C6["ReviewsController"]
        end

        subgraph SVC["Services Layer (Business Logic)"]
            S1["AuthService"]
            S2["ProductService"]
            S3["OrderService"]
            S4["UserService"]
            S5["PaymentService"]
            S6["InventoryService"]
            S7["NotificationService"]
            S8["AnalyticsService"]
        end

        subgraph REP["Repository / ORM Layer"]
            Prisma["Prisma Client (ORM)"]
            R1["User Repository"]
            R2["Product Repository"]
            R3["Order Repository"]
            R4["Payment Repository"]
        end

        subgraph MW["Middleware & Guards"]
            G1["JWT Auth Guard"]
            G2["Rate Limiting"]
            G3["CORS Middleware"]
            G4["Error Handler"]
            G5["Logging"]
        end
    end

    DB[(PostgreSQL Database)]
    Redis[(Redis Cache - Opt)]

    CTRL --> SVC
    SVC --> REP
    REP --> DB
    REP --> Redis
    MW -.-> CTRL
```

---

## 5. AI Service Architecture

```mermaid
graph TD
    subgraph FAI["Python FastAPI AI Microservice"]
        subgraph RT["HTTP Routes / Endpoints"]
            R1["POST /api/chat"]
            R2["POST /api/recommend"]
            R3["POST /api/analyze"]
            R4["GET /api/health"]
            R5["POST /webhooks/sync-products"]
        end

        subgraph RAG["RAG Engine & LangChain"]
            P1["1. Query Embedding"]
            P2["2. Vector Similarity Search"]
            P3["3. Context Assembly"]
            P4["4. LLM Call"]
            P5["5. Response Streaming"]
            P1 --> P2 --> P3 --> P4 --> P5
        end

        subgraph VEC["Embedding & Vectorization"]
            V1["Text to Embedding"]
            V2["Spec Summarizer"]
            V3["Batch Generator"]
            V4["Embedding Cache"]
        end

        subgraph DBL_AI["Database Layer"]
            SQLA["SQLAlchemy ORM"]
            AT1["Product Embeddings (pgvector)"]
            AT2["Chat History"]
            AT3["Analytics"]
        end
    end

    PG[(PostgreSQL with pgvector)]
    LLM_API["Claude / OpenAI LLM API"]

    RT --> RAG
    RAG --> VEC
    VEC --> DBL_AI
    DBL_AI --> PG
    RAG --> LLM_API
```

---

## 6. Database Schema ERD

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "is in"
    PRODUCT ||--|| PRODUCT_EMBEDDING : has
    
    USER {
        string id PK
        string email UK
        string password
        string role
        datetime created_at
    }
    
    ORDER {
        string id PK
        string userId FK
        decimal totalPrice
        string status
        datetime created_at
    }
    
    ORDER_ITEM {
        string id PK
        string orderId FK
        string productId FK
        int quantity
        decimal priceAtTime
    }
    
    PRODUCT {
        string id PK
        string name
        string description
        decimal price
        int stock
        string category
        json tech_specs
        datetime created_at
    }
    
    PRODUCT_EMBEDDING {
        string id PK
        string productId FK
        vector embedding
        string tech_specs_summary
        datetime created_at
    }
```

---

## 7. User Registration Flow

```mermaid
flowchart TD
    Start([User masukkan email & password]) --> ValidInput{Validasi format input?}
    ValidInput -- "Tidak Valid" --> ShowErr[Tampilkan Pesan Galat Validasi] --> Retry([Coba Registrasi Kembali]) --> Start
    ValidInput -- "Valid" --> ReqSign[POST /auth/signup ke Backend]
    ReqSign --> CheckDB{Cek apakah email sudah terdaftar?}
    CheckDB -- "Ya" --> RetErr[Kembalikan 400 Conflict] --> ShowConflict[Tampilkan 'Email already registered'] --> Retry
    CheckDB -- "Tidak" --> HashPwd[Hash password dengan bcrypt]
    HashPwd --> CreateRec[Buat record User baru di DB]
    CreateRec --> GenJWT[Generate JWT token]
    GenJWT --> RetRes[Kembalikan data token & user ke Frontend]
    RetRes --> StoreLS[Simpan token di localStorage]
    StoreLS --> RedDash([Redirect ke dashboard])
```

---

## 8. AI Consultant Recommendation Flow

```mermaid
flowchart TD
    Start([User bertanya: 'Apa laptop terbaik untuk gaming?']) --> PostChat[Frontend kirim pesan ke /api/chat]
    PostChat --> ValTok[Backend validasi token & catat log request]
    ValTok --> FwdAI[Teruskan kueri ke AI Service /api/chat]
    FwdAI --> ConvEmbed[AI Service: Konversi teks ke Embedding Vektor]
    ConvEmbed --> QueryVect[Query PostgreSQL dengan pgvector]
    QueryVect --> Find5[Cari 5 Produk Termirip via Cosine Distance]
    Find5 --> GetSpecs[Ambil spesifikasi, harga & ketersediaan produk]
    GetSpecs --> BuildRAG[Susun konteks RAG dengan data produk]
    BuildRAG --> SendLLM[Kirim prompt + konteks ke Claude/OpenAI]
    SendLLM --> GenRes[LLM hasilkan rekomendasi & pemikiran logis]
    GenRes --> StreamFE[Alirkan respon stream balik ke Frontend]
    StreamFE --> RenderWidget[Tampilkan jawaban di Chat Widget]
    RenderWidget --> AddToCart([User klik 'Add to Cart'])
```

---

## 9. Checkout & Order Processing Flow

```mermaid
flowchart TD
    Start([User menekan tombol 'Proceed to Checkout']) --> GetCart[Ambil data keranjang dari Zustand]
    GetCart --> ShowSumm[Tampilkan halaman ringkasan keranjang]
    ShowSumm --> EnterData[User masukkan alamat kirim & data bayar]
    EnterData --> ValForm{Validasi kolom formulir?}
    ValForm -- "Tidak Valid" --> ShowFormErr[Tampilkan pesan galat formulir] --> EnterData
    ValForm -- "Valid" --> ReqOrder[POST /orders/create ke Backend]
    ReqOrder --> CheckStock{Backend: Cek & potong stok di DB?}
    CheckStock -- "Stok Kurang" --> ErrStock[Kembalikan error stok] --> DispStockOut[Tampilkan 'Item out of stock']
    CheckStock -- "Stok Tersedia" --> ProcPay[Backend hubungi Stripe API untuk bayar]
    ProcPay --> ValPay{Stripe memproses pembayaran?}
    ValPay -- "Gagal" --> RetPayErr[Kembalikan galat bayar] --> RetryPay[Tampilkan transaksi gagal & minta ulangi] --> EnterData
    ValPay -- "Sukses" --> RecDB[Catat Order di DB status CONFIRMED]
    RecDB --> RecItems[Catat OrderItems & simpan TransactionID]
    RecItems --> RedStock[Potong jumlah stok fisik di tabel Product]
    RedStock --> SendMail[Kirim email konfirmasi dengan nomor pelacakan]
    SendMail --> ConfirmFE[Tampilkan layar sukses #ORD-12345 ke User] --> Finish([Selesai / Lanjut Belanja])
```

---

## 10. Product Embedding & Indexing Pipeline

```mermaid
flowchart TD
    A[Backend Updates Product Catalog] -->|Trigger Webhook| B[POST /webhooks/sync-products]
    B --> C[AI Service Receives Product Batch]
    C --> D[Chunk product data into text segments]
    D --> E[Generate Embeddings via LLM Provider]
    E --> F[INSERT INTO product_embeddings]
    F --> G[Rebuild pgvector HNSW Index]
    G --> H[Index Complete - Products ready for AI search!]
```

---

## 11. Admin Dashboard Analytics Flow

```mermaid
flowchart TD
    Start([Admin mengunjungi /dashboard]) --> CheckRole{Apakah user.role == 'ADMIN'?}
    CheckRole -- "Bukan" --> RedHome([Alihkan kembali ke Beranda])
    CheckRole -- "Ya" --> LoadDash[Buka halaman dashboard analitik]
    LoadDash --> FetchData[Panggil GET /analytics API backend]
    FetchData --> DBQueries[Backend jalankan kueri SQL agregasi]
    DBQueries --> Aggregate[Hitung total omset, pesanan, & produk terlaris]
    Aggregate --> RetData[Kembalikan data tren format JSON]
    RetData --> RenderCharts[Frontend render bagan grafis via Recharts]
    RenderCharts --> DispDash[Tampilkan dashboard interaktif ke Admin]
    DispDash --> Export{Admin menekan 'Export Report'?}
    Export -- "Ya" --> Download([Unduh dokumen PDF / CSV])
    Export -- "Tidak" --> DispDash
```

---

## 12. Project Timeline & Milestones

```mermaid
gantt
    title Gadget Solution - Project Timeline
    dateFormat  YYYY-MM-DD
    section Phase 0
    Setup & Infrastructure   :done,    des1, 2026-05-14, 2026-05-28
    section Phase 1
    Backend Development      :active,  des2, 2026-05-28, 2026-06-25
    section Phase 2
    AI Microservice          :         des3, 2026-06-25, 2026-07-23
    section Phase 3
    Frontend Development     :         des4, 2026-07-23, 2026-08-27
    section Phase 4
    Integration & Testing    :         des5, 2026-08-27, 2026-09-17
```

---

## 📊 Diagram Tambahan untuk Kebutuhan Website (Requirements)

Berikut adalah kumpulan diagram pelengkap industri standar yang sangat berguna untuk presentasi teknis, dokumentasi akademik, atau pemahaman rinci fungsionalitas e-commerce.

---

### A. Use Case Diagram

Menjelaskan kaitan hak akses (Actor) terhadap fitur-fitur inti di dalam sistem.

```mermaid
graph LR
    %% --- Actors (Outside System Boundary) ---
    Guest["👤 Pengunjung (Guest)"]
    Customer["👥 Pelanggan (Customer)"]
    Admin["🔑 Administrator"]

    %% --- Actor Generalizations (UML Inheritance) ---
    Customer -->|Generalization| Guest
    Admin -->|Generalization| Guest

    %% --- System Boundary ---
    subgraph SystemBoundary ["📦 Gadget Solution System Platform"]
        direction TB
        %% Use Cases
        UC1(("Melihat Katalog &<br/>Filter Gadget"))
        UC2(("Konsultasi Chat AI<br/>(RAG Assistant)"))
        UC3(("Registrasi & Login"))
        UC4(("Mengatur Keranjang<br/>Belanja"))
        UC5(("Melakukan Checkout<br/>Pesanan"))
        UC6(("Membayar Transaksi<br/>(Payment Gateway)"))
        UC7(("Melihat Riwayat<br/>Transaksi"))
        UC8(("Manajemen Produk &<br/>Stok (CRUD)"))
        UC9(("Memantau Grafik<br/>Analitik & Dashboard"))
        UC10(("Sinkronisasi Vektor<br/>Embeddings"))
    end

    %% --- Actor to Use Case Connections (Associations) ---
    Guest --- UC1
    Guest --- UC2
    Guest --- UC3

    Customer --- UC4
    Customer --- UC5
    Customer --- UC7

    Admin --- UC8
    Admin --- UC9
    Admin --- UC10

    %% --- Use Case to Use Case Relationships (UML Standards) ---
    UC5 -.->|«include»| UC3
    UC5 -.->|«include»| UC6
    UC2 -.->|«extend»| UC1
```

---

### B. Peta Situs & Navigasi Frontend (Sitemap)

Struktur rute (*routing structure*) dari aplikasi Next.js 14.

```mermaid
graph TD
    Home["/ (Halaman Utama)"]
    
    Home --> Catalog["/products (Grid Katalog)"]
    Home --> Auth["/auth (Masuk / Daftar)"]
    Home --> AIWidget["Tombol Melayang Konsultan AI"]
    
    Catalog --> ProductDetail["/products/:id (Detail Gadget)"]
    Catalog --> Filter["Filter Samping (Drawer)"]
    
    ProductDetail --> Cart["/cart (Slide Drawer Keranjang)"]
    
    Cart --> Checkout["/checkout (Gerbang Pembayaran)"]
    
    Checkout --> OrderSuccess["/checkout/success (Halaman Sukses)"]
    
    Auth --> Profile["/dashboard (Portal Pelanggan)"]
    Profile --> OrderHist["/dashboard/orders (Daftar Transaksi)"]
    Profile --> AdminView["/admin/dashboard (Pusat Kontrol)"]
    
    AdminView --> ProdManage["/admin/products (Kelola Produk)"]
    AdminView --> StatsView["/admin/analytics (Data Statistik)"]
```

---

### C. Diagram Status Transaksi & Pembayaran (State Diagram)

Menjelaskan transisi status pesanan sejak checkout dibuat hingga pengiriman selesai.

```mermaid
stateDiagram-v2
    [*] --> PENDING_PAYMENT : Pembeli menekan tombol bayar
    
    PENDING_PAYMENT --> CANCELLED : Batal oleh Pengguna / Waktu Habis
    PENDING_PAYMENT --> PROCESSING : Gateway mengembalikan status BERHASIL
    PENDING_PAYMENT --> PAYMENT_FAILED : Kartu ditolak / Saldo tidak cukup
    
    PAYMENT_FAILED --> PENDING_PAYMENT : Pengguna mencoba bayar kembali
    PAYMENT_FAILED --> CANCELLED : Pengguna menutup halaman transaksi
    
    PROCESSING --> CONFIRMED : Stok barang berhasil dipotong di DB
    PROCESSING --> REFUNDED : Terjadi race condition (Barang Habis)
    
    CONFIRMED --> SHIPPED : Penjual menyerahkan paket ke kurir
    SHIPPED --> DELIVERED : Pembeli mengonfirmasi barang sampai
    
    DELIVERED --> [*]
    CANCELLED --> [*]
    REFUNDED --> [*]
```

---

### D. Diagram Alir Data (Data Flow Diagram - DFD Level 1)

Menggambarkan bagaimana data mengalir di antara Entitas Luar, Proses Internal, dan Tempat Penyimpanan Data (*Data Store*).

```mermaid
flowchart LR
    subgraph Entitas Luar
        U[Pembeli]
        A[Admin]
        PG[Payment Gateway]
    end

    subgraph Batasan Sistem["Sistem Gadget Solution"]
        subgraph Proses Aplikasi
            P1((1.0 Modul Autentikasi))
            P2((2.0 Katalog Produk))
            P3((3.0 Konsultan AI RAG))
            P4((4.0 Transaksi Checkout))
            P5((5.0 Analitik Backoffice))
        end
        
        subgraph Penyimpanan Data
            D1[(Tabel Users)]
            D2[(Tabel Products)]
            D3[(Tabel Orders)]
            D4[(Vektor Embeddings)]
        end
    end

    U -->|Kredensial Akun| P1
    P1 <-->|Simpan/Baca Akun| D1
    
    U -->|Aktivitas Browse/Filter| P2
    P2 <-->|Baca Detail Produk| D2
    
    U -->|Kueri Bahasa Alami| P3
    P3 <-->|Hitung Kedekatan Vektor| D4
    P3 -->|Baca Spesifikasi Teknis| D2
    
    U -->|Kirim Data Keranjang| P4
    P4 -->|Permintaan Tagihan| PG
    PG -->|Token Token/Capture| P4
    P4 <-->|Simpan Transaksi Baru| D3
    P4 -->|Update Sisa Stok| D2
    
    A -->|Perbarui Katalog & Stok| P2
    A -->|Permintaan Data Grafik| P5
    P5 <-->|Kalkulasi Agregasi Omset| D3
```

---

### E. Arsitektur Keamanan & Alur Token JWT (Security & Session)

Urutan validasi request yang aman dengan mekanisme *Access Token* (jangka pendek) dan *Refresh Token* (jangka panjang).

```mermaid
sequenceDiagram
    autonumber
    actor U as Browser (Klien)
    participant G as NestJS AuthGuard
    participant A as Modul Auth Backend
    participant D as Redis / Database
    
    U ->> A: POST /auth/login (email, password)
    A ->> A: Validasi format & verifikasi password
    A ->> A: Buat AccessToken (15 menit) & RefreshToken (7 hari)
    A ->> U: Set-Cookie: RefreshToken (httpOnly) & Kirim JSON AccessToken
    
    Note over U,G: Saat Browser Mengirim Permintaan Autentikasi
    U ->> G: GET /orders/my-orders (Header Auth: Bearer AccessToken)
    G ->> G: Verifikasi tanda tangan digital & masa aktif JWT
    alt Token Masih VALID
        G ->> U: Status 200 OK (Data Dikirim)
    else Token Kedaluwarsa (EXPIRED)
        G ->> U: Status 401 Unauthorized (Akses Ditolak)
        U ->> A: POST /auth/refresh (Mengirim httpOnly Cookie RefreshToken)
        A ->> A: Validasi database / memori token refresh
        alt Refresh Token VALID
            A ->> U: Kirim AccessToken Baru
            U ->> G: Ulangi kueri dengan Token baru
        else Refresh Token EXPIRED / PALSU
            A ->> U: Status 403 Forbidden (Paksa Login Ulang)
        end
    end
```

