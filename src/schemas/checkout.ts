import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email("E-mail inválido"),
  name: z.string().min(2, "O nome deve conter pelo menos 2 caracteres"),
  surname: z.string().min(2, "O sobrenome deve conter pelo menos 2 caracteres"),
  cpf: z
    .string()
    .min(11, "CPF inválido")
    .max(14)
    .refine((val) => {
      const clean = val.replace(/\D/g, "");
      return clean.length === 11;
    }, "CPF deve ter exatamente 11 dígitos"),
  phone: z
    .string()
    .min(10, "Telefone inválido")
    .max(15)
    .refine((val) => {
      const clean = val.replace(/\D/g, "");
      return clean.length >= 10 && clean.length <= 11;
    }, "Telefone deve conter DDD + 8 ou 9 dígitos"),
  cep: z
    .string()
    .min(8, "CEP inválido")
    .max(9)
    .refine((val) => {
      const clean = val.replace(/\D/g, "");
      return clean.length === 8;
    }, "CEP deve ter 8 dígitos"),
  street: z.string().min(3, "Rua/Avenida inválida"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro obrigatório"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().length(2, "Estado (UF) deve ter 2 caracteres"),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
