import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

// بيانات أولية واقعية لمتجر عود وعطور
async function main() {
  console.log("🌱 بدء زرع البيانات الأولية...");

  // ============ الفئات ============
  const categories = [
    { name: "العود", slug: "oud", sortOrder: 1, description: "أجود أنواع العود الكمبودي والهندي", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80" },
    { name: "العطور", slug: "perfumes", sortOrder: 2, description: "عطور شرقية وفاخرة بثبات عالٍ", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80" },
    { name: "دهن العود", slug: "oils", sortOrder: 3, description: "دهن عود ملكي ومسك وعنبر", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80" },
    { name: "البخور والمباخر", slug: "incense", sortOrder: 4, description: "بخور عربي أصيل ومباخر فاخرة", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80" },
    { name: "هدايا", slug: "gifts", sortOrder: 5, description: "صناديق هدايا فاخرة منسّقة بأناقة", image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&q=80" },
    { name: "إكسسوارات", slug: "accessories", sortOrder: 6, description: "مباخر وخلاطات وإكسسوارات العود", image: "https://images.unsplash.com/photo-1607602132700-068258431c6c?w=400&q=80" },
  ];

  const seededCategories: Record<string, { id: string; slug: string }> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
        description: cat.description,
        image: cat.image,
      },
    });
    seededCategories[cat.slug] = c;
  }

  const oudCategory = seededCategories.oud;
  const perfumesCategory = seededCategories.perfumes;
  const oilsCategory = seededCategories.oils;
  const incenseCategory = seededCategories.incense;
  const giftsCategory = seededCategories.gifts;

  // ============ الفروع ============
  const riyadhBranch = await prisma.branch.upsert({
    where: { id: "branch-riyadh" },
    update: {},
    create: {
      id: "branch-riyadh",
      name: "فرع الرياض - العليا",
      address: "الرياض، حي العليا، طريق الملك فهد",
      phone: "0112000000",
      sortOrder: 1,
    },
  });

  const jeddahBranch = await prisma.branch.upsert({
    where: { id: "branch-jeddah" },
    update: {},
    create: {
      id: "branch-jeddah",
      name: "فرع جدة - الروضة",
      address: "جدة، حي الروضة، شارع الأمير سلطان",
      phone: "0126000000",
      sortOrder: 2,
    },
  });

  // ============ المنتجات ============
  const products: any[] = [
    {
      slug: "cambodian-oud-supreme",
      name: "عود كمبودي فاخر",
      description:
        "عود كمبودي أصيل من أجود الأنواع، يتميّز برائحة عميقة ودافئة تدوم طويلًا. معتّق بعناية ليمنحك تجربة عطرية استثنائية تناسب المناسبات الخاصة.",
      price: new Decimal(490),
      compareAtPrice: new Decimal(590),
      images: [
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
      ],
      stock: 25,
      isFeatured: true,
      category: { connect: { id: oudCategory.id } },
    },
    {
      slug: "royal-oud-dehn",
      name: "دهن عود ملكي",
      description:
        "دهن عود ملكي مركّز، مستخلص من أجود أخشاب العود بطريقة تقليدية. ثبات عالٍ ورائحة فخمة تناسب كل الأوقات.",
      price: new Decimal(490),
      compareAtPrice: new Decimal(620),
      images: [
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
      ],
      stock: 40,
      isFeatured: true,
      category: { connect: { id: oilsCategory.id } },
    },
    {
      slug: "taif-rose-perfume",
      name: "عطر ورد الطائف",
      description:
        "عطر فرنسي راقٍ بلمسة من ورد الطائف الأصيل. مزيج بين الأصالة الشرقية والفخامة الغربية بثبات يدوم 12 ساعة.",
      price: new Decimal(320),
      images: [
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
      ],
      stock: 60,
      isFeatured: true,
      category: { connect: { id: perfumesCategory.id } },
    },
    {
      slug: "indian-oud-ink",
      name: "عود هندي معتّق",
      description:
        "عود هندي معتّق لمدة طويلة، يتميّز بنفحات حيوانية دافئة يحبّها عشاق العود الأصيل. قطع مختارة بعناية.",
      price: new Decimal(380),
      images: [
        "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800&q=80",
      ],
      stock: 18,
      isFeatured: false,
      category: { connect: { id: oudCategory.id } },
    },
    {
      slug: "amber-musk-oil",
      name: "دهن العنبر والمسك",
      description:
        "مزيج فاخر من دهن العنبر والمسك الأبيض، رائحة ناعمة ودافئة تناسب الاستخدام اليومي للجنسين.",
      price: new Decimal(180),
      compareAtPrice: new Decimal(220),
      images: [
        "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80",
      ],
      stock: 75,
      isFeatured: false,
      category: { connect: { id: oilsCategory.id } },
    },
    {
      slug: "arabic-incense-luxury",
      name: "بخور عربي فاخر",
      description:
        "خلطة بخور عربية فاخرة بنفحات العود والورد والعنبر. تملأ المكان برائحة فخمة تدوم ساعات. عبوة 100 غرام.",
      price: new Decimal(140),
      images: [
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
      ],
      stock: 100,
      isFeatured: false,
      category: { connect: { id: incenseCategory.id } },
    },
    {
      slug: "royal-mabthooth",
      name: "مبطّن عود ملكي",
      description:
        "مبطّن عود فاخر بخلاصة العود الكمبودي والزيوت العطرية الراقية. رائحة متوازنة تناسب المداخل والصالات.",
      price: new Decimal(260),
      images: [
        "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80",
      ],
      stock: 50,
      isFeatured: true,
      category: { connect: { id: incenseCategory.id } },
    },
    {
      slug: "oud-night-edp",
      name: "عطر ليل العود",
      description:
        "عطر شرقي غني بنفحات العود والفانيليا والباتشولي. مثالي للسهرات والمناسبات المسائية. حجم 100 مل.",
      price: new Decimal(450),
      compareAtPrice: new Decimal(540),
      images: [
        "https://images.unsplash.com/photo-1523293182086-7651a7c14e40?w=800&q=80",
      ],
      stock: 30,
      isFeatured: false,
      category: { connect: { id: perfumesCategory.id } },
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  // ============ الإعدادات ============
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "حكايا الطيب",
      storeNameEn: "Hakaya Altayib",
      whatsappNumber: "966500000000",
      email: "info@hakaya-altayib.com",
      phone: "+966500000000",
      address: "الرياض، المملكة العربية السعودية",
      shippingFee: new Decimal(25),
      freeShippingThreshold: new Decimal(500),
      currency: "SAR",
      taxRate: new Decimal(0),
      bankAccounts: [
        {
          bankName: "مصرف الراجحي",
          iban: "SA0380000000608010167519",
          holder: "حكايا الطيب للتجارة",
        },
        {
          bankName: "البنك الأهلي السعودي",
          iban: "SA4410000000000000000000",
          holder: "حكايا الطيب للتجارة",
        },
      ] as any,
    },
  });

  // ============ البنرات ============
  const banners = [
    {
      title: "تشكيلة العود الكمبودي",
      subtitle: "بصمة أصيلة من قلب الشرق",
      image: "https://images.unsplash.com/photo-1607602132700-068258431c6c?w=1600&q=80",
      link: "/products?category=oud",
      position: "home_hero",
      sortOrder: 1,
    },
    {
      title: "عطور فاخرة",
      subtitle: "حكايا الطيب بعبق الأصالة",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1600&q=80",
      link: "/products?category=perfumes",
      position: "home_hero",
      sortOrder: 2,
    },
  ];
  for (const b of banners) {
    await prisma.banner.upsert({
      where: { id: `banner-${b.sortOrder}` },
      update: {},
      create: { id: `banner-${b.sortOrder}`, ...b },
    });
  }

  console.log("✅ تم زرع البيانات بنجاح:");
  console.log(`   - ${categories.length} فئات`);
  console.log(`   - 2 فرع`);
  console.log(`   - ${products.length} منتج`);
  console.log(`   - ${banners.length} بنر`);
  console.log(`   - الإعدادات`);
}

main()
  .catch((e) => {
    console.error("❌ فشل الزرع:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
