"use client";

import { useState, useRef, useCallback } from "react";
import { ImagePlus, X, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  onRemove?: () => void;
  aspectRatio?: string;
}

export function ImageUpload({ value, onChange, label = "Upload Gambar", onRemove, aspectRatio = "video" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, dll)");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Ukuran maksimal file adalah 20MB");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal upload");
      onChange(data.url);
      toast.success("Gambar berhasil diupload");
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const removeImage = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange("");
    }
  };

  if (value) {
    return (
      <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 group">
        <div className={`relative aspect-${aspectRatio} w-full bg-slate-100 flex items-center justify-center p-2`}>
          <img
            src={value}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
          />
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={removeImage}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px]
        ${isDragOver ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary hover:bg-slate-50"}
        ${isUploading ? "pointer-events-none opacity-70" : ""}
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleUpload(e.target.files[0]);
          }
        }}
        accept="image/*"
        className="hidden"
      />
      
      {isUploading ? (
        <>
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-700">Mengupload...</p>
        </>
      ) : (
        <>
          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-1">{label}</p>
          <p className="text-xs text-slate-500 mb-4">Seret dan lepas file di sini, atau klik untuk memilih file</p>
          <span className="btn-admin-secondary text-xs px-4 py-1.5 pointer-events-none">
            Pilih File
          </span>
        </>
      )}
    </div>
  );
}
