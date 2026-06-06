"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  folder?: string;
  multiple?: boolean;
  onUploaded: (url: string) => void;
  label?: string;
}

export function ImageUploader({
  folder = "produtos",
  multiple = false,
  onUploaded,
  label = "Arraste imagens ou clique para enviar",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let ok = 0;
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Falha no upload");
        onUploaded(data.url);
        ok++;
      }
      toast.success(ok > 1 ? `${ok} imagens enviadas!` : "Imagem enviada!");
    } catch (e: any) {
      toast.error(e?.message || "Erro ao enviar imagem.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div
      onClick={() => !uploading && inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (!uploading) handleFiles(e.dataTransfer.files);
      }}
      className="flex cursor-pointer flex-col items-center justify-center gap-1.5 border-2 border-dashed border-foreground bg-muted/20 p-4 text-center transition-colors hover:bg-muted/40"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {uploading ? (
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      ) : (
        <Upload className="h-5 w-5 text-primary" />
      )}
      <span className="font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">
        {uploading ? "Enviando..." : label}
      </span>
    </div>
  );
}
