"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  title = "Konfirmasi Hapus",
  message,
  itemName,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-background border border-border rounded-2xl w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="font-bold text-base text-foreground">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-sm text-muted-foreground">
            {message || (
              <>
                Apakah kamu yakin ingin menghapus{" "}
                {itemName ? (
                  <>
                    <span className="font-semibold text-foreground">
                      &ldquo;{itemName}&rdquo;
                    </span>
                    ?
                  </>
                ) : (
                  "item ini?"
                )}
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-2 text-red-500">
            ⚠️ Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-5 pt-0">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center py-2.5 px-4 bg-destructive hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 px-4 bg-muted hover:bg-secondary text-foreground text-sm font-semibold rounded-xl transition-all"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
