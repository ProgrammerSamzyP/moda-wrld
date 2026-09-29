/*
  HOW TO ADD MORE IMAGES TO A PRODUCT
  1. Put the files in /public/assets (e.g. /public/assets/riot-back.jpeg)
  2. Add the path to that product's `images` array below.
  The first image is the main one. `image` is used on shop cards,
  `images` is used on the product detail page.
*/

export const PRODUCTS = [
  {
    id: 1,
    name: "MODA RIOT TEE",
    price: 19200,
    originalPrice: 29999,
    image: "/assets/riot.jpeg",
    images: [
      "/assets/riot.jpeg",
      "/assets/riot1.jpeg",
      "/assets/riot2.jpeg",
      "/assets/riot3.jpeg",
    ],
    description: "Washed Material DTF print",
    inStock: true,
    // badge: "Limited",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: 2,
    name: "MODAxELITE8 TEE (BLACK)",
    price: 19200,
    originalPrice: 24999,
    image: "/assets/elite1.jpeg",
    images: [
      "/assets/elite1.jpeg",
      "/assets/elite2.jpeg",
    ],
    description: "100% cotton DTF Print",
    inStock: true,
    // badge: "Limited",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: 3,
    name: "MODAxELITE8 TEE (WHITE)",
    price: 28000,
    originalPrice: 24999,
    image: "/assets/modaE.jpeg",
    images: [
      "/assets/modaE.jpeg",
      "/assets/modaE1.jpeg",
    ],
    description: '100% cotton DTF Print',
    inStock: true,
    // badge: "Best Seller",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: 4,
    name: "MODA BB JERSEY",
    price: 21600,
    originalPrice: 34999,
    image: "/assets/jersey.jpeg",
    images: [
      "/assets/jersey.jpeg",
      "/assets/jersey1.jpeg",
      "/assets/jersey2.jpeg",
      "/assets/jersey3.jpeg",
    ],
    description: "100% cotton DTF and Screen Print, net material",
    inStock: true,
    // badge: "New",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: 5,
    name: "MODA RYU TANKS (WHITE)",
    price: 20000,
    originalPrice: 25999,
    image: "/assets/ryu.jpeg",
    images: [
      "/assets/ryu.jpeg",
      "/assets/ryu1.jpeg",
      "/assets/ryu2.jpeg",
    ],
    description: "100% cotton Sublimation print",
    inStock: true,
    // badge: "New",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: 6,
    name: "MODA RYU TANKS (RED)",
    price: 20000,
    originalPrice: 25999,
    image: "/assets/ryuR.jpeg",
    images: [
      "/assets/ryuR.jpeg",
      "/assets/ryuR1.jpeg",
      "/assets/ryuR2.jpeg",
      "/assets/ryuR3.jpeg",
    ],
    description: "100% cotton Sublimation print",
    inStock: true,
    // badge: "Best Seller",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: 7,
    name: "MODA GRAFFITI SHORT",
    price: 20000,
    originalPrice: 34999,
    image: "/assets/short.jpeg",
    images: [
      "/assets/short.jpeg",
      "/assets/short1.jpeg",
      "/assets/short2.jpeg",
      "/assets/short3.jpeg",

    ],
    description: "Mesh material DTF print",
    inStock: true,
    // badge: "New",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: 8,
    name: "MODA 61 SWEAT (GRAY)",
    price: 24000,
    originalPrice: 54999,
    image: "/assets/Gray.jpeg",
    images: [
      "/assets/Gray.jpeg",
      "/assets/gray1.jpeg",
      "/assets/gray2.jpeg",
      "/assets/gray3.jpeg",
    ],
    description: "",
    inStock: true,
    // badge: "New",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: 9,
    name: "MODA 61 SWEAT (BLACK)",
    price: 19200,
    originalPrice: 54999,
    image: "/assets/black.jpeg",
    images: [
      "/assets/black.jpeg",
      "/assets/black1.jpeg",
      "/assets/black2.jpeg",
      "/assets/black3.jpeg",
    ],
    description: "Bold meets Boujee, period",
    inStock: true,
    // badge: "Limited",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Products' }
];

export const WHATSAPP_NUMBER = "2349078859896";
export const ADMIN_EMAIL = "modawrld61@gmail.com";

// EmailJS configuration – replace with your real IDs and public key
export const EMAIL_CONFIG = {
  serviceId: 'service_v8v7leo',             // from EmailJS dashboard
  ownerTemplateId: 'template_v0hlft4',
  customerTemplateId: 'template_cg4y4fk',
  publicKey: 'wCOUNbc7cXDBnJETR'              // from EmailJS Account → API Keys
};