import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cep = searchParams.get("cep")?.replace(/\D/g, "");

  if (!cep || cep.length !== 8) {
    return NextResponse.json({ error: "CEP inválido ou não fornecido" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (!response.ok) {
      return NextResponse.json({ error: "Erro ao buscar CEP" }, { status: response.status });
    }

    const data = await response.json();

    if (data.erro) {
      return NextResponse.json({ error: "CEP não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    });
  } catch (error) {
    console.error("ViaCEP proxy failed:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
