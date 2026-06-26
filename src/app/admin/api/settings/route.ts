import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { Decimal } from "@prisma/client/runtime/library";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await req.json();
  const { storeName, storeNameEn, whatsappNumber, email, phone, address, shippingFee, freeShippingThreshold, currency, taxRate, bankAccounts, socialLinks, metaTitle, metaDescription, footerText } = body;

  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {
      ...(storeName !== undefined ? { storeName } : {}),
      ...(storeNameEn !== undefined ? { storeNameEn } : {}),
      ...(whatsappNumber !== undefined ? { whatsappNumber } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(address !== undefined ? { address } : {}),
      ...(shippingFee !== undefined ? { shippingFee: new Decimal(shippingFee) } : {}),
      ...(freeShippingThreshold !== undefined
        ? { freeShippingThreshold: freeShippingThreshold ? new Decimal(freeShippingThreshold) : null }
        : {}),
      ...(currency !== undefined ? { currency } : {}),
      ...(taxRate !== undefined ? { taxRate: new Decimal(taxRate) } : {}),
      ...(bankAccounts !== undefined ? { bankAccounts: bankAccounts } : {}),
      ...(socialLinks !== undefined ? { socialLinks: socialLinks } : {}),
      ...(metaTitle !== undefined ? { metaTitle } : {}),
      ...(metaDescription !== undefined ? { metaDescription } : {}),
      ...(footerText !== undefined ? { footerText } : {}),
    },
    create: {
      id: 1,
      storeName: storeName || "حكايا الطيب",
      storeNameEn: storeNameEn || "Hakaya Altayib",
      whatsappNumber: whatsappNumber || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      shippingFee: new Decimal(shippingFee || 25),
      freeShippingThreshold: freeShippingThreshold ? new Decimal(freeShippingThreshold) : null,
      currency: currency || "SAR",
      taxRate: new Decimal(taxRate || 0),
      bankAccounts: bankAccounts || [],
      socialLinks: socialLinks || {},
    },
  });

  return NextResponse.json({ settings });
}
