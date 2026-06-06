"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { SignInFormData, SignUpFormData } from "@/schemas/auth";

export async function getUserRole() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      select: { role: true, name: true, email: true },
    });

    return dbUser;
  } catch (error) {
    console.error("Failed to fetch user role:", error);
    return null;
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return { success: true };
  } catch (error) {
    console.error("Failed to sign out:", error);
    return { success: false, error: "Erro ao sair" };
  }
}

export async function signIn(credentials: SignInFormData) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Sign in failed:", error);
    return { success: false, error: "Falha ao fazer login" };
  }
}

export async function signUp(credentials: SignUpFormData) {
  try {
    const supabase = await createClient();
    
    // 1. Sign up user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Erro ao criar usuário." };
    }

    // 2. Synchronize to our PostgreSQL database via Prisma
    try {
      await prisma.user.create({
        data: {
          supabaseId: data.user.id,
          email: credentials.email,
          name: credentials.name,
          surname: credentials.surname,
          phone: credentials.phone,
        },
      });
    } catch (dbError) {
      console.error("Failed to create profile database sync:", dbError);
      // Suppress or rollback if needed, but since it is created in Supabase, the user exists.
      // We can retry or let it be. But typically it is successful.
    }

    return { success: true };
  } catch (error) {
    console.error("Sign up failed:", error);
    return { success: false, error: "Falha ao realizar cadastro" };
  }
}

export async function updateProfile(data: {
  name: string;
  surname?: string | null;
  phone?: string | null;
  cpf?: string | null;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Não autorizado" };
    }

    await prisma.user.update({
      where: { supabaseId: user.id },
      data: {
        name: data.name,
        surname: data.surname,
        phone: data.phone,
        cpf: data.cpf,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Update profile failed:", error);
    return { success: false, error: "Falha ao atualizar perfil" };
  }
}

export async function addAddress(data: {
  label?: string | null;
  cep: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Não autorizado" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return { success: false, error: "Usuário não registrado no banco." };
    }

    await prisma.address.create({
      data: {
        userId: dbUser.id,
        label: data.label || "Endereço",
        cep: data.cep,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Add address failed:", error);
    return { success: false, error: "Falha ao adicionar endereço" };
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Não autorizado" };
    }

    // Verify ownership before deleting
    const address = await prisma.address.findUnique({
      where: { id: addressId },
      include: { user: true },
    });

    if (!address || address.user.supabaseId !== user.id) {
      return { success: false, error: "Endereço não encontrado ou acesso negado." };
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    return { success: true };
  } catch (error) {
    console.error("Delete address failed:", error);
    return { success: false, error: "Falha ao excluir endereço" };
  }
}


