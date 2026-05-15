import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Gadget Solution database...\n');

  // ─── Seed Users ──────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gadgetsolution.com' },
    update: {},
    create: {
      email: 'admin@gadgetsolution.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'GadgetSol',
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@demo.com' },
    update: {},
    create: {
      email: 'customer@demo.com',
      password: customerPassword,
      firstName: 'Demo',
      lastName: 'Customer',
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Users seeded:', { admin: admin.email, customer: customer.email });

  // ─── Seed Products ───────────────────────────────────────────
  const products = [
    // Gaming Smartphones
    {
      name: 'ASUS ROG Phone 7 Ultimate',
      category: 'Gaming Smartphone',
      price: 1999,
      stock: 15,
      description: 'Ultra-powerful gaming phone with Snapdragon 8 Gen 2 and 24GB RAM. Features AeroActive Cooler 7 for sustained performance.',
      images: ['/images/rog-phone-7.jpg'],
      techSpecs: {
        processor: 'Snapdragon 8 Gen 2 Leading Version',
        ram: '24GB LPDDR5X',
        storage: '512GB UFS 4.0',
        display: '6.78 inch AMOLED 165Hz',
        battery: '5000mAh with 65W HyperCharge',
        cooling: 'AeroActive Cooler 7 + Vapor Chamber',
        os: 'Android 13',
      },
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      category: 'Gaming Smartphone',
      price: 1419,
      stock: 22,
      description: 'Flagship Samsung with Galaxy AI, S Pen, and Snapdragon 8 Gen 3 for mobile gaming perfection.',
      images: ['/images/galaxy-s24-ultra.jpg'],
      techSpecs: {
        processor: 'Snapdragon 8 Gen 3 for Galaxy',
        ram: '12GB LPDDR5X',
        storage: '512GB',
        display: '6.8 inch Dynamic AMOLED 2X 120Hz',
        battery: '5000mAh with 45W Fast Charge',
        camera: '200MP Main + 50MP Periscope Telephoto',
        os: 'Android 14 + One UI 6.1',
      },
    },
    {
      name: 'iPhone 15 Pro Max',
      category: 'Gaming Smartphone',
      price: 1599,
      stock: 18,
      description: 'Apple A17 Pro chip with hardware-accelerated ray tracing. Titanium design with Action Button.',
      images: ['/images/iphone-15-pro-max.jpg'],
      techSpecs: {
        processor: 'Apple A17 Pro (3nm)',
        ram: '8GB',
        storage: '512GB',
        display: '6.7 inch Super Retina XDR OLED 120Hz',
        battery: '4422mAh with 27W Fast Charge',
        camera: '48MP Main + 12MP Periscope 5x Telephoto',
        os: 'iOS 17',
      },
    },

    // Gaming Laptops
    {
      name: 'MSI Raider GE78 HX',
      category: 'Gaming Laptop',
      price: 2499,
      stock: 8,
      description: 'Extreme gaming laptop with dual GPU capability and 4K 144Hz display for maximum AAA performance.',
      images: ['/images/msi-raider-ge78.jpg'],
      techSpecs: {
        processor: 'Intel Core i9-13900HX (24 Cores)',
        gpu: 'NVIDIA RTX 4090 16GB GDDR6',
        ram: '64GB DDR5-5200',
        storage: '2TB NVMe Gen 4 SSD',
        display: '17.3 inch 4K UHD+ 144Hz IPS',
        battery: '99.9Wh',
        weight: '2.89 kg',
      },
    },
    {
      name: 'ASUS ROG Strix SCAR 18',
      category: 'Gaming Laptop',
      price: 3299,
      stock: 5,
      description: 'Born for eSports champions with per-key RGB keyboard, Nebula HDR display, and liquid metal cooling.',
      images: ['/images/rog-strix-scar-18.jpg'],
      techSpecs: {
        processor: 'Intel Core i9-14900HX',
        gpu: 'NVIDIA RTX 4090 16GB GDDR6',
        ram: '64GB DDR5-5600',
        storage: '2TB PCIe Gen4 NVMe',
        display: '18 inch QHD+ 240Hz Nebula HDR',
        battery: '90Wh',
        cooling: 'Liquid Metal + Triple Fan',
      },
    },
    {
      name: 'Razer Blade 16',
      category: 'Gaming Laptop',
      price: 2799,
      stock: 10,
      description: 'The world thinnest 16-inch gaming laptop with dual-mode display technology and CNC aluminum chassis.',
      images: ['/images/razer-blade-16.jpg'],
      techSpecs: {
        processor: 'Intel Core i9-14900HX',
        gpu: 'NVIDIA RTX 4080 12GB GDDR6',
        ram: '32GB DDR5-5600',
        storage: '1TB PCIe Gen 4 NVMe',
        display: '16 inch UHD+ 120Hz / FHD+ 240Hz Dual Mode',
        battery: '95.2Wh',
        weight: '2.45 kg',
      },
    },
    {
      name: 'Lenovo Legion Pro 7i',
      category: 'Gaming Laptop',
      price: 2199,
      stock: 12,
      description: 'Premium gaming with ColdFront 5.0 cooling, Mini LED display, and PureSight technology.',
      images: ['/images/lenovo-legion-pro-7i.jpg'],
      techSpecs: {
        processor: 'Intel Core i9-14900HX',
        gpu: 'NVIDIA RTX 4080 12GB GDDR6',
        ram: '32GB DDR5-5600',
        storage: '1TB PCIe Gen 4 NVMe',
        display: '16 inch WQXGA 240Hz Mini LED',
        battery: '99.9Wh',
        cooling: 'ColdFront 5.0 Vapor Chamber',
      },
    },
    {
      name: 'Acer Predator Helios Neo 16',
      category: 'Gaming Laptop',
      price: 1499,
      stock: 20,
      description: 'Best value gaming laptop with 14th Gen Intel and RTX 4070. Perfect balance of power and price.',
      images: ['/images/acer-predator-helios.jpg'],
      techSpecs: {
        processor: 'Intel Core i7-14700HX',
        gpu: 'NVIDIA RTX 4070 8GB GDDR6',
        ram: '16GB DDR5-4800',
        storage: '1TB PCIe Gen 4 NVMe',
        display: '16 inch WQXGA 165Hz IPS',
        battery: '76Wh',
        weight: '2.6 kg',
      },
    },

    // Gaming Monitors
    {
      name: 'ASUS ROG Swift PG32UQ',
      category: 'Gaming Monitor',
      price: 899,
      stock: 14,
      description: '32-inch 4K UHD gaming monitor with HDMI 2.1 for next-gen consoles and 144Hz refresh rate.',
      images: ['/images/rog-swift-pg32uq.jpg'],
      techSpecs: {
        panel: 'IPS',
        resolution: '3840x2160 (4K UHD)',
        refreshRate: '144Hz',
        responseTime: '1ms GTG',
        hdr: 'DisplayHDR 600',
        ports: '2x HDMI 2.1, 1x DisplayPort 1.4',
        features: 'G-Sync Compatible, FreeSync Premium Pro',
      },
    },
    {
      name: 'Samsung Odyssey G9 49"',
      category: 'Gaming Monitor',
      price: 1299,
      stock: 7,
      description: 'Ultra-wide 49-inch dual QHD curved gaming monitor with 240Hz and 1000R curvature.',
      images: ['/images/samsung-odyssey-g9.jpg'],
      techSpecs: {
        panel: 'VA',
        resolution: '5120x1440 (Dual QHD)',
        refreshRate: '240Hz',
        responseTime: '1ms GTG',
        curvature: '1000R',
        hdr: 'Quantum HDR 2000',
        ports: '1x DisplayPort 1.4, 2x HDMI 2.1',
      },
    },

    // Gaming Peripherals
    {
      name: 'Logitech G Pro X Superlight 2',
      category: 'Gaming Mouse',
      price: 159,
      stock: 45,
      description: 'Ultra-lightweight wireless gaming mouse at just 60g with HERO 2 sensor and LIGHTSPEED technology.',
      images: ['/images/gpro-superlight-2.jpg'],
      techSpecs: {
        sensor: 'HERO 2 (44K DPI)',
        weight: '60g',
        battery: '95 hours',
        connectivity: 'LIGHTSPEED Wireless + USB-C',
        switches: 'LIGHTFORCE Hybrid Optical-Mechanical',
        pollingRate: '2000Hz',
      },
    },
    {
      name: 'Razer DeathAdder V3 Pro',
      category: 'Gaming Mouse',
      price: 149,
      stock: 35,
      description: 'Ergonomic wireless gaming mouse with Focus Pro 30K sensor and ultra-lightweight 63g design.',
      images: ['/images/razer-deathadder-v3.jpg'],
      techSpecs: {
        sensor: 'Focus Pro 30K Optical',
        weight: '63g',
        battery: '90 hours',
        connectivity: 'HyperSpeed Wireless + USB-C',
        switches: 'Razer Gen-3 Optical',
        pollingRate: '4000Hz (with dongle)',
      },
    },
    {
      name: 'Corsair K100 RGB',
      category: 'Gaming Keyboard',
      price: 229,
      stock: 25,
      description: 'Premium optical-mechanical keyboard with iCUE wheel, per-key RGB, and 4000Hz AXON processing.',
      images: ['/images/corsair-k100.jpg'],
      techSpecs: {
        switches: 'Corsair OPX Optical-Mechanical',
        layout: 'Full-size with iCUE Control Wheel',
        pollingRate: '4000Hz AXON',
        keycaps: 'PBT Double-Shot',
        lighting: 'Per-Key RGB (44-zone LightEdge)',
        connectivity: 'USB-C Detachable',
      },
    },
    {
      name: 'SteelSeries Apex Pro TKL (2023)',
      category: 'Gaming Keyboard',
      price: 189,
      stock: 30,
      description: 'World fastest gaming keyboard with adjustable OmniPoint 2.0 switches and Rapid Trigger technology.',
      images: ['/images/steelseries-apex-pro.jpg'],
      techSpecs: {
        switches: 'OmniPoint 2.0 Adjustable (0.1mm - 4.0mm)',
        layout: 'Tenkeyless (TKL)',
        pollingRate: '1000Hz',
        keycaps: 'PBT Double-Shot',
        lighting: 'Per-Key RGB',
        features: 'Rapid Trigger, OLED Smart Display',
      },
    },

    // Audio
    {
      name: 'SteelSeries Arctis Nova Pro Wireless',
      category: 'Gaming Headset',
      price: 349,
      stock: 20,
      description: 'Premium wireless gaming headset with Active Noise Cancellation, hot-swap battery, and multi-system connectivity.',
      images: ['/images/arctis-nova-pro.jpg'],
      techSpecs: {
        driver: '40mm Neodymium (Hi-Res Audio)',
        frequency: '10Hz - 40kHz',
        anc: 'Active Noise Cancellation (4-mic hybrid)',
        battery: 'Dual hot-swap (18h each)',
        connectivity: '2.4GHz Wireless + Bluetooth 5.0',
        microphone: 'ClearCast Gen 2 Retractable',
      },
    },
    {
      name: 'HyperX Cloud III Wireless',
      category: 'Gaming Headset',
      price: 169,
      stock: 28,
      description: 'Comfortable wireless gaming headset with DTS Headphone:X Spatial Audio and 120-hour battery life.',
      images: ['/images/hyperx-cloud-iii.jpg'],
      techSpecs: {
        driver: '53mm with Neodymium magnets',
        frequency: '10Hz - 21kHz',
        battery: '120 hours',
        connectivity: '2.4GHz Wireless (USB-C Dongle)',
        microphone: 'Detachable noise-cancelling',
        surround: 'DTS Headphone:X Spatial Audio',
      },
    },

    // Gaming Components
    {
      name: 'NVIDIA GeForce RTX 4090 Founders Edition',
      category: 'Graphics Card',
      price: 1599,
      stock: 3,
      description: 'The ultimate GPU with Ada Lovelace architecture, 24GB GDDR6X, and DLSS 3 Frame Generation.',
      images: ['/images/rtx-4090-fe.jpg'],
      techSpecs: {
        architecture: 'Ada Lovelace',
        cudaCores: '16384',
        vram: '24GB GDDR6X',
        boostClock: '2.52 GHz',
        tdp: '450W',
        interface: 'PCIe 4.0 x16',
        features: 'DLSS 3, Ray Tracing Gen 3',
      },
    },
    {
      name: 'AMD Ryzen 9 7950X3D',
      category: 'Processor',
      price: 699,
      stock: 16,
      description: 'World best gaming processor with 3D V-Cache technology, 16 cores and 5.7GHz boost clock.',
      images: ['/images/ryzen-9-7950x3d.jpg'],
      techSpecs: {
        cores: '16 Cores / 32 Threads',
        baseClock: '4.2 GHz',
        boostClock: '5.7 GHz',
        cache: '144MB (L2+L3) with 3D V-Cache',
        tdp: '120W',
        socket: 'AM5',
        architecture: 'Zen 4',
      },
    },
    {
      name: 'Corsair Vengeance DDR5-6000 32GB Kit',
      category: 'Memory',
      price: 139,
      stock: 40,
      description: 'High-performance DDR5 memory kit optimized for AMD EXPO and Intel XMP 3.0.',
      images: ['/images/corsair-vengeance-ddr5.jpg'],
      techSpecs: {
        type: 'DDR5',
        speed: '6000MHz',
        capacity: '32GB (2x16GB)',
        latency: 'CL36-36-36-76',
        voltage: '1.35V',
        compatibility: 'Intel XMP 3.0 / AMD EXPO',
        heatspreader: 'Aluminum',
      },
    },
    {
      name: 'Samsung 990 Pro 2TB NVMe SSD',
      category: 'Storage',
      price: 179,
      stock: 32,
      description: 'PCIe 4.0 NVMe SSD with up to 7,450 MB/s sequential read and integrated heatsink option.',
      images: ['/images/samsung-990-pro.jpg'],
      techSpecs: {
        interface: 'PCIe 4.0 x4 NVMe 2.0',
        capacity: '2TB',
        seqRead: '7,450 MB/s',
        seqWrite: '6,900 MB/s',
        formFactor: 'M.2 2280',
        endurance: '1,200 TBW',
        encryption: 'AES 256-bit',
      },
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') },
      update: {},
      create: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        techSpecs: product.techSpecs,
        images: product.images,
      },
    });
  }

  console.log(`✅ ${products.length} products seeded successfully!`);

  // Summary
  const userCount = await prisma.user.count();
  const productCount = await prisma.product.count();
  console.log(`\n📊 Database Summary:`);
  console.log(`   Users:    ${userCount}`);
  console.log(`   Products: ${productCount}`);
  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
