"use client";

import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="mt-4">
            {message || (
              <>
                Apakah kamu yakin ingin menghapus{" "}
                {itemName ? (
                  <span className="font-semibold text-foreground">
                    &ldquo;{itemName}&rdquo;
                  </span>
                ) : (
                  "item ini"
                )}
                ?
              </>
            )}
            <br />
            <span className="text-xs text-red-500 mt-2 block">
              ⚠️ Tindakan ini tidak dapat dibatalkan.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={onCancel}>
            Batal
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
