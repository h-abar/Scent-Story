import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import { getStorage, MAX_RECEIPT_SIZE } from "@/lib/storage";
import { generateOrderNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let customerName: string;
    let phone: string;
    let city: string;
    let address: string;
    let notes: string;
    let fulfillment: "shipping" | "pickup";
    let branchId: string;
    let paymentMethod: "receipt_upload" | "whatsapp";
    let cartItems: Array<{ id: string; name: string; price: number; quantity: number }>;
    let bankName: string;
    let accountHolderName: string;
    let transferDateStr: string;
    let last4: string;
    let receiptFile: File | null = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      customerName = formData.get("name") as string;
      phone = formData.get("phone") as string;
      city = (formData.get("city") as string) || "";
      address = (formData.get("address") as string) || "";
      notes = (formData.get("notes") as string) || "";
      fulfillment = formData.get("fulfillment") as "shipping" | "pickup";
      branchId = (formData.get("branchId") as string) || "";
      paymentMethod = formData.get("paymentMethod") as "receipt_upload" | "whatsapp";
      bankName = (formData.get("bankName") as string) || "";
      accountHolderName = (formData.get("accountHolderName") as string) || "";
      transferDateStr = (formData.get("transferDate") as string) || "";
      last4 = (formData.get("last4") as string) || "";
      receiptFile = formData.get("receipt") as File | null;
      const itemsJson = (formData.get("items") as string) || "[]";
      cartItems = JSON.parse(itemsJson);
    } else {
      const body = await req.json();
      customerName = body.name;
      phone = body.phone;
      city = body.city || "";
      address = body.address || "";
      notes = body.notes || "";
      fulfillment = body.fulfillment;
      branchId = body.branchId || "";
      paymentMethod = body.paymentMethod;
      bankName = body.bankName || "";
      accountHolderName = body.accountHolderName || "";
      transferDateStr = body.transferDate || "";
      last4 = body.last4 || "";
      cartItems = body.items || [];
    }

    // التحقق
    if (!customerName || !phone || !fulfillment || !paymentMethod) {
      return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
    }
    if (!cartItems.length) {
      return NextResponse.json({ error: "السلة فارغة" }, { status: 400 });
    }
    if (fulfillment === "pickup" && !branchId) {
      return NextResponse.json({ error: "يجب اختيار فرع للاستلام" }, { status: 400 });
    }
    if (paymentMethod === "receipt_upload" && !receiptFile) {
      return NextResponse.json({ error: "يجب رفع إيصال التحويل" }, { status: 400 });
    }
    if (paymentMethod === "receipt_upload" && !accountHolderName) {
      return NextResponse.json({ error: "اسم صاحب الحساب مطلوب" }, { status: 400 });
    }

    // جلب الإعدادات لحساب الشحن
    const settings = await prisma.settings.findUnique({ where: { id: 1 } });
    if (!settings) {
      return NextResponse.json({ error: "إعدادات المتجر غير مكتملة" }, { status: 500 });
    }

    // حساب المجموع
    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const freeThreshold = settings.freeShippingThreshold
      ? parseFloat(settings.freeShippingThreshold.toString())
      : null;
    const shippingFee =
      fulfillment === "shipping"
        ? freeThreshold && subtotal >= freeThreshold
          ? 0
          : parseFloat(settings.shippingFee.toString())
        : 0;
    const total = subtotal + shippingFee;

    // توليد رقم الطلب
    const orderCount = await prisma.order.count();
    const orderNumber = generateOrderNumber(orderCount + 1);

    // رفع الإيصال إن وجد
    let receiptUrl: string | null = null;
    if (receiptFile && receiptFile.size > 0) {
      if (receiptFile.size > MAX_RECEIPT_SIZE) {
        return NextResponse.json({ error: "حجم الإيصال يتجاوز 8 ميجابايت" }, { status: 400 });
      }
      const storage = getStorage();
      const result = await storage.upload(receiptFile);
      receiptUrl = result.url;
    }

    // تحديد حالة الطلب
    const orderStatus =
      paymentMethod === "receipt_upload" && receiptUrl
        ? "receipt_uploaded"
        : paymentMethod === "receipt_upload"
        ? "awaiting_transfer"
        : "new";

    // إنشاء الطلب مع العناصر والدفع
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        phone,
        city: city || null,
        address: address || null,
        notes: notes || null,
        fulfillment,
        branchId: fulfillment === "pickup" ? branchId : null,
        subtotal: new Decimal(subtotal),
        shippingFee: new Decimal(shippingFee),
        total: new Decimal(total),
        status: orderStatus,
        paymentMethod,
        items: {
          create: cartItems.map((item) => ({
            productId: item.id || null,
            name: item.name,
            price: new Decimal(item.price),
            quantity: item.quantity,
          })),
        },
        payment: {
          create: {
            method: paymentMethod,
            receiptUrl,
            bankName: bankName || null,
            accountHolderName: accountHolderName || null,
            transferDate: transferDateStr ? new Date(transferDateStr) : null,
            last4: last4 || null,
            status: "pending",
          },
        },
      },
      include: { items: true, payment: true },
    });

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الطلب" },
      { status: 500 }
    );
  }
}
