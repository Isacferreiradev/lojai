"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { productSchema, ProductFormData } from "@/schemas/admin";
import { createProduct, updateProduct } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploader } from "@/components/admin/image-uploader";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  defaultValues?: Partial<ProductFormData>;
  productId?: string;
  existingImages?: string[];
}

const COMMON_COLORS = ["Bege", "Cinza", "Marrom", "Preto", "Branco", "Azul", "Verde", "Rosa", "Amarelo", "Laranja"];
const COMMON_SIZES = ["50x80cm", "60x100cm", "80x150cm", "100x150cm", "140x200cm", "160x230cm", "200x250cm", "200x300cm"];

export function ProductForm({ categories, defaultValues, productId, existingImages = [] }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imageUrls, setImageUrls] = useState<string[]>(existingImages);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "seo">("basic");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
      isFeatured: false,
      isWashable: false,
      colors: [],
      sizes: [],
      stock: 0,
      ...defaultValues,
    },
  });

  const watchedColors = watch("colors") || [];
  const watchedSizes = watch("sizes") || [];
  const watchedName = watch("name");

  // Auto-generate slug from name
  const generateSlug = () => {
    if (watchedName && !defaultValues?.slug) {
      const slug = watchedName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setValue("slug", slug);
    }
  };

  const toggleColor = (color: string) => {
    const current = watchedColors;
    const updated = current.includes(color)
      ? current.filter((c) => c !== color)
      : [...current, color];
    setValue("colors", updated);
  };

  const toggleSize = (size: string) => {
    const current = watchedSizes;
    const updated = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size];
    setValue("sizes", updated);
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      setImageUrls((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImage = (url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const onSubmit = (data: ProductFormData) => {
    startTransition(async () => {
      const result = productId
        ? await updateProduct(productId, data, imageUrls)
        : await createProduct(data, imageUrls);

      if (result.success) {
        toast.success(productId ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");
        router.push("/admin/produtos");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao salvar produto.");
      }
    });
  };

  const tabs = [
    { id: "basic", label: "Informações Básicas" },
    { id: "details", label: "Detalhes & Estoque" },
    { id: "seo", label: "SEO & Meta" },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-0 p-0 bg-card border-2 border-foreground divide-x-2 divide-foreground w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all",
              activeTab === tab.id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Tab */}
          {activeTab === "basic" && (
            <div className="bg-card border-2 border-foreground p-6 space-y-5">
              <h2 className="font-heading font-bold text-foreground">Informações Básicas</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Nome *</label>
                  <input
                    {...register("name")}
                    onBlur={generateSlug}
                    placeholder="Ex: Luminária de Mesa Cogumelo"
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Slug *</label>
                  <input
                    {...register("slug")}
                    placeholder="luminaria-de-mesa-cogumelo"
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                  />
                  {errors.slug && <p className="text-xs text-destructive mt-1">{errors.slug.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">SKU *</label>
                  <input
                    {...register("sku")}
                    placeholder="TAP-001"
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                  />
                  {errors.sku && <p className="text-xs text-destructive mt-1">{errors.sku.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Categoria *</label>
                  <select
                    {...register("categoryId")}
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Selecione...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-xs text-destructive mt-1">{errors.categoryId.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Marca</label>
                  <input
                    {...register("brand")}
                    placeholder="Ex: Tapestry"
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Preço (R$) *</label>
                  <input
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {errors.price && <p className="text-xs text-destructive mt-1">{errors.price.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Preço Promocional (R$)</label>
                  <input
                    {...register("promoPrice", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Descrição</label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    placeholder="Descreva o produto em detalhes..."
                    className="w-full rounded-none border-2 border-foreground bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Cores Disponíveis</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColor(color)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium border-2 transition-all",
                        watchedColors.includes(color)
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground/40 text-muted-foreground hover:border-foreground"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Tamanhos Disponíveis</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium border-2 transition-all",
                        watchedSizes.includes(size)
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground/40 text-muted-foreground hover:border-foreground"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="bg-card border-2 border-foreground p-6 space-y-5">
              <h2 className="font-heading font-bold text-foreground">Detalhes & Estoque</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Estoque *</label>
                  <input
                    {...register("stock", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {errors.stock && <p className="text-xs text-destructive mt-1">{errors.stock.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Material</label>
                  <input
                    {...register("material")}
                    placeholder="Ex: Polipropileno"
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Peso (kg)</label>
                  <input
                    {...register("weight", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="0.000"
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Largura (cm)</label>
                  <input
                    {...register("width", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Altura (cm)</label>
                  <input
                    {...register("height", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Profundidade (cm)</label>
                  <input
                    {...register("depth", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    {...register("isWashable")}
                    type="checkbox"
                    className="w-4 h-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm text-foreground">Produto lavável</span>
                </label>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === "seo" && (
            <div className="bg-card border-2 border-foreground p-6 space-y-5">
              <h2 className="font-heading font-bold text-foreground">SEO & Meta Tags</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Meta Título</label>
                  <input
                    {...register("metaTitle")}
                    placeholder="Título para mecanismos de busca"
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Meta Descrição</label>
                  <textarea
                    {...register("metaDescription")}
                    rows={3}
                    placeholder="Descrição para mecanismos de busca (recomendado: até 160 caracteres)"
                    className="w-full rounded-none border-2 border-foreground bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Palavras-chave</label>
                  <input
                    {...register("metaKeywords")}
                    placeholder="iluminação, mesa, moderno, decoração"
                    className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-card border-2 border-foreground p-6 space-y-4">
            <h2 className="font-heading font-bold text-foreground">Publicação</h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-foreground/30 hover:bg-muted/30 transition-colors">
                <input
                  {...register("isActive")}
                  type="checkbox"
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">Produto ativo</p>
                  <p className="text-xs text-muted-foreground">Visível na loja</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-foreground/30 hover:bg-muted/30 transition-colors">
                <input
                  {...register("isFeatured")}
                  type="checkbox"
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">Produto em destaque</p>
                  <p className="text-xs text-muted-foreground">Aparece na homepage</p>
                </div>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</>
                ) : (
                  productId ? "Atualizar" : "Criar Produto"
                )}
              </Button>
            </div>
          </div>

          {/* Images */}
          <div className="bg-card border-2 border-foreground p-6 space-y-4">
            <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" /> Imagens
            </h2>

            {/* Image list */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={url}
                      alt={`Imagem ${i + 1}`}
                      className="w-full aspect-square object-cover border-2 border-foreground"
                    />
                    {i === 0 && (
                      <span className="absolute top-1.5 left-1.5 border-2 border-foreground bg-primary text-primary-foreground font-mono text-[10px] font-bold px-1.5 py-0.5">
                        Principal
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1.5 right-1.5 border-2 border-foreground bg-destructive text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload de arquivos */}
            <ImageUploader
              folder="produtos"
              multiple
              label="Arraste as imagens ou clique (várias de uma vez)"
              onUploaded={(url) =>
                setImageUrls((prev) => (prev.includes(url) ? prev : [...prev, url]))
              }
            />

            {/* Add image URL */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="URL da imagem..."
                className="flex-1 h-9 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImageUrl();
                  }
                }}
              />
              <Button type="button" size="sm" onClick={addImageUrl} className="h-9 px-3">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              A primeira imagem será a imagem principal do produto.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
