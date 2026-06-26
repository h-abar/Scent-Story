// Serialization helpers — uses any to avoid Prisma type resolution issues

interface SerializedOrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

interface SerializedPayment {
  id: string;
  method: string;
  receiptUrl: string | null;
  status: string;
  accountHolderName: string | null;
  transferDate: string | null;
  last4: string | null;
  rejectionReason: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
}

interface SerializedBranch {
  id: string;
  name: string;
  address: string | null;
}

export interface SerializedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string | null;
  address: string | null;
  notes: string | null;
  fulfillment: string;
  status: string;
  paymentMethod: string;
  subtotal: string;
  shippingFee: string;
  total: string;
  createdAt: string;
  items: SerializedOrderItem[];
  payment: SerializedPayment | null;
  branch: SerializedBranch | null;
}

export function serializeOrder(order: any): SerializedOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    phone: order.phone,
    city: order.city,
    address: order.address,
    notes: order.notes,
    fulfillment: order.fulfillment,
    status: order.status,
    paymentMethod: order.paymentMethod,
    subtotal: String(order.subtotal),
    shippingFee: String(order.shippingFee),
    total: String(order.total),
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : String(order.createdAt),
    items: (order.items ?? []).map((item: any) => ({
      id: item.id,
      name: item.name,
      price: String(item.price),
      quantity: item.quantity,
    })),
    payment: order.payment
      ? {
          id: order.payment.id,
          method: order.payment.method,
          receiptUrl: order.payment.receiptUrl,
          status: order.payment.status,
          accountHolderName: order.payment.accountHolderName,
          transferDate: order.payment.transferDate instanceof Date ? order.payment.transferDate.toISOString() : (order.payment.transferDate ?? null),
          last4: order.payment.last4,
          rejectionReason: order.payment.rejectionReason,
          verifiedBy: order.payment.verifiedBy,
          verifiedAt: order.payment.verifiedAt instanceof Date ? order.payment.verifiedAt.toISOString() : (order.payment.verifiedAt ?? null),
        }
      : null,
    branch: order.branch
      ? { id: order.branch.id, name: order.branch.name, address: order.branch.address }
      : null,
  };
}

export function serializeOrders(orders: any[]): SerializedOrder[] {
  return orders.map(serializeOrder);
}

export interface SerializedProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  shortDescription: string | null;
  price: string;
  compareAtPrice: string | null;
  images: string[];
  stock: number;
  sku: string | null;
  barcode: string | null;
  weight: string | null;
  origin: string | null;
  fragranceNotes: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  views: number;
  categoryId: string;
  category?: { id: string; name: string; slug: string; image: string | null } | null;
}

export function serializeProduct(product: any): SerializedProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description ?? null,
    shortDescription: product.shortDescription ?? null,
    price: String(product.price),
    compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : null,
    images: product.images ?? [],
    stock: product.stock,
    sku: product.sku ?? null,
    barcode: product.barcode ?? null,
    weight: product.weight ? String(product.weight) : null,
    origin: product.origin ?? null,
    fragranceNotes: product.fragranceNotes ?? null,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    isNew: product.isNew,
    views: product.views,
    categoryId: product.categoryId,
    category: product.category
      ? { id: product.category.id, name: product.category.name, slug: product.category.slug, image: product.category.image ?? null }
      : null,
  };
}

export function serializeProducts(products: any[]): SerializedProduct[] {
  return products.map(serializeProduct);
}

export interface SerializedCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
}

export function serializeCategory(category: any): SerializedCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? null,
    image: category.image ?? null,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    productCount: category._count?.products ?? category.products?.length ?? undefined,
  };
}

export function serializeCategories(categories: any[]): SerializedCategory[] {
  return categories.map(serializeCategory);
}

export interface SerializedBanner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image: string;
  link: string | null;
  position: string;
  sortOrder: number;
  isActive: boolean;
}

export function serializeBanner(banner: any): SerializedBanner {
  return {
    id: banner.id,
    title: banner.title ?? null,
    subtitle: banner.subtitle ?? null,
    image: banner.image,
    link: banner.link ?? null,
    position: banner.position,
    sortOrder: banner.sortOrder,
    isActive: banner.isActive,
  };
}

export function serializeBanners(banners: any[]): SerializedBanner[] {
  return banners.map(serializeBanner);
}
