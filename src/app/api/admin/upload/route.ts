import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isStorageConfigured, uploadImage } from "@/lib/storage";

const ADMIN_COOKIE = "lojai_admin";

export async function POST(request: Request) {
  // Admin gate (same cookie as the panel)
  const store = await cookies();
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || store.get(ADMIN_COOKIE)?.value !== expected) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { error: "Storage não configurado. Defina SUPABASE_SERVICE_ROLE_KEY e crie um bucket público." },
      { status: 503 }
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "produtos");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo ausente." }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Imagem muito grande (máx. 8MB)." }, { status: 413 });
    }

    const url = await uploadImage(file, folder);
    return NextResponse.json({ url });
  } catch (e: any) {
    console.error("Upload failed:", e);
    return NextResponse.json({ error: e?.message || "Falha no upload." }, { status: 500 });
  }
}
