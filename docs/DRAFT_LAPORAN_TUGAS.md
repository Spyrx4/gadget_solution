# 📄 DRAFT LAPORAN PROYEK E-COMMERCE
**Mata Kuliah:** E-Commerce  
**Proyek:** Rancang Toko Online UMKM (Standalone Platform)  

---

## 📌 1. Cover & Identitas
* **Judul Proyek:** GadgetSol: Toko Online Ritel Gadget Independen Berbasis AI Microservices untuk Solusi Gawai Produktif  
* **Kategori Tema Proyek:** Pendukung Infrastruktur Jasa Kreatif / Ritel Gadget Teknologi (UMKM)  
* **Disusun Oleh:** [Nama Kelompok / Nama Anggota]  
* **Kelas:** [Nama Kelas]  
* **Tanggal:** 15 Mei 2026  
* **Dosen Pengampu:** [Nama Dosen]  

---

## 🏬 2. Profil UMKM & Analisis Model Bisnis (BMC)

### A. Profil UMKM
**GadgetSol (Gadget Solution)** adalah sebuah usaha mikro, kecil, dan menengah (UMKM) ritel gawai independen asal Indonesia yang menjual aneka perangkat digital terkini meliputi **Handphone, Laptop, Tablet, dan Smartwatch**. 

Berbeda dengan konter HP atau ritel besar yang pasif, GadgetSol hadir sebagai solusi kurasi gawai personal yang berfokus membantu pembeli menemukan gadget yang paling tepat guna. Nilai tambah utama dari platform mandiri ini adalah adanya fitur **AI Consultant Widget** berbasis RAG (*Retrieval-Augmented Generation*). Fitur pintar ini bertindak sebagai asisten belanja digital pribadi yang membantu pelanggan awam memilih tipe gawai (misal: memilih tablet untuk kuliah vs mendesain, atau memilih smartwatch dengan daya tahan baterai terbaik) dengan instan 24/7 tanpa tekanan dari pramuniaga fisik.

### B. Tabel Business Model Canvas (BMC) - 9 Elemen

| **Elemen BMC** | **Rincian / Penjelasan untuk GadgetSol** |
| :--- | :--- |
| **Customer Segments** | Mahasiswa, pelajar, pekerja kantoran (*remote workers*), penggemar gaya hidup sehat, dan masyarakat umum di Indonesia (Rentang usia: 15 - 45 tahun) yang membutuhkan gawai andal untuk produktivitas, komunikasi, dan *health tracking*. |
| **Value Proposition** | 1. **Asisten Gawai Pintar (AI Consultant):** Rekomendasi produk instan berdasarkan kebutuhan spesifik user (misal: mencari laptop tipis murah, atau HP kamera bagus).<br>2. **Keaslian Terjamin & Garansi Lokal:** Jaminan produk orisinal (bukan barang ilegal/BM) dengan garansi resmi.<br>3. **One-Stop Solution:** Kelengkapan kategori esensial (ponsel, laptop, tablet, smartwatch) dalam satu keranjang belanja. |
| **Channels** | 1. **Toko Online Mandiri** (GadgetSol Platform - Menggunakan Next.js).<br>2. **Media Sosial:** TikTok & Instagram untuk me-review singkat fitur gawai dan unboxing.<br>3. **Grup Promo & Komunitas:** WhatsApp/Telegram Channel info flash sale gadget mingguan. |
| **Customer Relationships** | 1. **Layanan Konsultan AI:** Respon instan 24 jam tanpa antrean.<br>2. **Pusat Bantuan & Edukasi:** Informasi klaim garansi resmi brand dan tips optimasi baterai gadget baru.<br>3. **Sistem Ulasan Otentik:** Transparansi review pembeli asli di setiap halaman detail produk. |
| **Revenue Streams** | 1. Margin penjualan unit fisik: Laptop, Handphone, Tablet, dan Smartwatch.<br>2. Penjualan bundling aksesoris tambahan (misal: TG/tempered glass, case, atau strap jam tambahan). |
| **Key Resources** | 1. **Infrastruktur Teknologi:** Basis data pintar PostgreSQL + pgvector untuk mesin rekomendasi AI.<br>2. **Persediaan Produk (Inventory):** Stok gawai yang tersimpan rapi dan aman.<br>3. **Aset Digital:** Website yang cepat, responsif, dan katalog gambar berkualitas tinggi. |
| **Key Activities** | 1. Kurasi stok gawai terbaru yang memiliki permintaan tinggi di pasar Indonesia.<br>2. Pengelolaan katalog web, deskripsi spek teknis produk, dan update basis data AI.<br>3. Quality Control (QC) segel box, pememasan pesanan dengan standar keamanan tinggi.<br>4. Pemasaran konten media sosial dan *digital ads*. |
| **Key Partnerships** | 1. **Authorized Reseller/Distributor Resmi** brand gadget terkemuka di Indonesia.<br>2. **Penyedia Payment Gateway** (Midtrans / Xendit) untuk kemudahan bayar QRIS & transfer otomatis.<br>3. **Layanan Pengiriman Kilat** (GoSend/GrabExpress untuk lokal kota, JNE YES / SiCepat untuk antar kota berasuransi).<br>4. **Penyedia API Kecerdasan Buatan** (OpenAI / Claude SDK). |
| **Cost Structure** | 1. Modal pembelian stok gawai (*HPP/Cost of Goods*).<br>2. Biaya operasional hosting server dan sewa token API LLM.<br>3. Biaya pengemasan standar keamanan tinggi (box tebal + bubble wrap berlapis + lakban fragile).<br>4. Pengeluaran biaya promosi digital untuk menarik trafik pengunjung baru. |

---

## 📐 3. Desain Arsitektur Sistem & Pilihan Teknologi

### A. Pilihan Teknologi (*Tech Stack Matrix*)

| Komponen | Pilihan Teknologi | Alasan & Peran dalam Proyek |
| :--- | :--- | :--- |
| **Platform** | *Custom Development* | Menjamin kendali penuh atas desain antarmuka dan performa tinggi toko online tanpa ada batasan dari penyedia CMS instan. |
| **Frontend** | Next.js 14 (React) + Tailwind CSS | Memberikan kecepatan muat halaman yang luar biasa cepat (*fast loading*) dan rendering server-side (SSR) yang vital untuk visibilitas produk di mesin pencari. |
| **Backend** | NestJS (TypeScript) | Mesin backend tangguh untuk mengelola otorisasi pengguna (JWT), pemrosesan keranjang belanja, hingga validasi transaksi order. |
| **AI Microservice** | Python FastAPI + LangChain | Bertugas menghitung pencarian kemiripan spesifikasi produk secara cerdas dan cepat guna menjawab pertanyaan user di widget chat. |
| **Database** | PostgreSQL + `pgvector` | Satu database untuk menyimpan dua tipe data: data transaksi penjualan dan data vektor teks spek gawai untuk pencarian pintar. |
| **Hosting** | Docker Containers & Cloud VPS | Memungkinkan replikasi lingkungan pengembangan yang konsisten dan kemudahan *deployment* menggunakan Docker Compose. |
| **Payment Gateway**| Midtrans / Xendit API | Memungkinkan pembeli melakukan pembayaran otomatis via QRIS (GoPay, OVO), ShopeePay, atau Virtual Account bank-bank lokal Indonesia. |
| **Keamanan** | SSL/TLS, Hashing Bcrypt, CORS | Melindungi privasi data akun pembeli, mengacak kata sandi di database, dan mengamankan komunikasi antar-domain API. |
| **Integrasi API** | API RajaOngkir & Kurir Instan | Untuk cek ongkos kirim nasional secara real-time dan estimasi jarak tempuh untuk pengiriman instan hari itu juga. |

### B. Alur Komponen Arsitektur (High-Level)

```
┌────────────────────────────────────────────────────────────────────┐
│                      WEB CLIENT (Browser / Mobile)                 │
│    [Katalog Gadget]      [Widget AI Consultant]   [Form Transaksi] │
└─────────────────┬──────────────────────────────────┬───────────────┘
                  │ (API Gateway)                    │
  ┌───────────────▼──────────────┐    ┌──────────────▼──────────────┐
  │       BACKEND SERVICE        │    │        AI SERVICE           │
  │     (NestJS REST API)        │    │    (Python RAG Engine)      │
  ├──────────────────────────────┤    ├──────────────────────────────┤
  │ • Akun, Keranjang & Checkout │    │ • Pemrosesan Kueri Alami     │
  │ • Integrasi Midtrans API     │    │ • Cari Kemiripan Spek Gawai  │
  │ • Cek Ongkir RajaOngkir      │    │ • Prompt LLM Rekomendasi     │
  └───────────────┬──────────────┘    └──────────────┬──────────────┘
                  │                                  │
                  └─────────────────┬────────────────┘
                          ┌─────────▼─────────┐
                          │  DATABASE LAYER   │
                          │  (PostgreSQL DB)  │
                          │  + pgvector index │
                          └───────────────────┘
```

---

## 📣 4. Strategi Digital Marketing & Logistik

### A. Strategi Digital Marketing
Untuk bersaing secara sehat dengan ritel gadget mapan lainnya, GadgetSol menerapkan 4 strategi pemasaran digital terukur:

1. **SEO (Search Engine Optimization):**
   * Menargetkan kata kunci pencarian berbasis ulasan dan harga gawai murah di Indonesia, seperti *"harga tablet untuk kuliah termurah 2026"*, *"smartwatch android baterai awet"*, atau *"rekomendasi laptop tipis mahasiswa"*.
2. **Media Sosial (Instagram & TikTok):**
   * Fokus memproduksi konten video vertikal singkat berformat ulasan fitur kunci (*key features*), tips trik gadget (misal: *"3 Fitur Tersembunyi di HP Android Ini"*), serta video estetik unboxing produk gadget terlaris.
3. **Iklan Berbayar (Meta Ads / Google Search Ads):**
   * Iklan tertarget di Facebook/Instagram yang membidik audiens muda dengan ketertarikan spesifik pada kategori perangkat baru, gadget gadget olahraga (untuk smartwatch), atau kebutuhan sekolah/kantor (untuk laptop/tablet).
4. **Email & Loyalitas (*Retention Marketing*):**
   * Pengiriman email pengingat keranjang terbengkalai (*abandoned cart recovery*) otomatis dan tawaran aksesoris khusus bagi pelanggan yang baru saja membeli unit utama (misal: menawarkan strap keren setelah membeli smartwatch).

### B. Rancangan Logistik & Pengiriman
Karena objek yang diperjualbelikan adalah barang elektronik bernilai tinggi namun memiliki bobot yang relatif ringan sampai sedang, sistem pengiriman dirancang sebagai berikut:

* **Mitra Logistik Lokal:** **GoSend & GrabExpress** untuk pengiriman *instant/same day* di area cakupan kota operasional toko agar gawai sampai dalam hitungan jam secara aman.
* **Mitra Logistik Antar Kota:** **JNE YES (Yakin Esok Sampai)** atau **SiCepat BEST** yang memprioritaskan paket sampai satu hari kerja untuk meminimalisir waktu gawai berada di perjalanan ekspedisi.
* **Biaya Ongkir:** **Weight-Based & Jarak Tempuh** terintegrasi langsung melalui modul API di website secara *real-time*.
* **Standar Pengemasan Aman (Wajib):** Kotak produk dibungkus dengan lapisan gelembung (*bubble wrap*) minimal 3 lapis, dimasukkan ke kotak kardus pelindung tebal sekunder, dan disegel dengan lakban pengaman (*security seal tape*) serta stiker "FRAGILE - ELEKTRONIK".
* **Kebijakan Asuransi & Retur:** Seluruh pengiriman **Wajib Diasuransikan** 100%. Jika terjadi kerusakan/kehilangan di kurir, klaim diganti penuh. Konsumen berhak mendapatkan retur unit baru dalam kurun waktu 7 hari setelah barang tiba jika produk cacat pabrik dengan menyertakan rekaman video bongkar paket (*unboxing*) tanpa edit.

---

## 🏆 5. Kesimpulan & Keunggulan Kompetitif

### Kesimpulan
Pembangunan toko online mandiri **GadgetSol** membuktikan bahwa bisnis ritel gawai skala UMKM mampu menghadirkan pengalaman berbelanja berkelas dunia yang mandiri dari ketergantungan marketplace besar. Dengan memadukan kemudahan transaksi, jaminan keamanan barang bernilai tinggi, dan asisten digital cerdas, proyek ini memenuhi seluruh pilar e-commerce modern secara utuh.

### Keunggulan Kompetitif Utama:
1. **Panduan AI Mandiri:** Solusi utama bagi pelanggan bingung yang ingin membeli gawai tanpa perlu membandingkan tabel spesifikasi teknis di banyak tab browser secara manual.
2. **Fleksibilitas Pembayaran Lokal:** Integrasi dengan gateway Midtrans/Xendit menghapus hambatan pembayaran, memungkinkan pemrosesan instan melalui aplikasi dompet digital lokal (E-Wallet) favorit pembeli.
3. **Kepercayaan Keamanan Gawai:** Standar pengiriman dengan proteksi asuransi penuh dan lapisan pengaman ketat membuang kekhawatiran konsumen Indonesia dalam membeli perangkat elektronik berharga tinggi secara daring.
