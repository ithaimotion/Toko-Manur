"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";
import type { Promo } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { createPromo, updatePromo, deletePromo } from "@/lib/actions/promo";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PromoClientProps {
  initialPromos: Promo[];
}

export default function PromoClient({ initialPromos }: PromoClientProps) {
  const [promos, setPromos] = useState<Promo[]>(initialPromos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("true");

  const openAddModal = () => {
    setEditingId(null);
    setTitle("");
    setCode("");
    setDiscount("");
    setValidUntil("");
    setDescription("");
    setIsActive("true");
    setIsModalOpen(true);
  };

  const openEditModal = (promo: Promo) => {
    setEditingId(promo.id);
    setTitle(promo.title);
    setCode(promo.subtitle || "");
    setDiscount(promo.badgeText || "");
    setValidUntil(promo.validUntil ? promo.validUntil.split("T")[0] : "");
    setDescription(promo.description || "");
    setIsActive(promo.isActive ? "true" : "false");
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title) {
      toast.error("Judul promo wajib diisi");
      return;
    }

    setIsLoading(true);
    const data = {
      title,
      subtitle: code,
      badgeText: discount,
      validUntil: validUntil || undefined,
      description,
      isActive: isActive === "true",
    };

    try {
      if (editingId) {
        const res = await updatePromo(editingId, data);
        if (res.success && res.data) {
          setPromos((prev) =>
            prev.map((p) => (p.id === editingId ? (res.data as Promo) : p))
          );
          toast.success("Promo berhasil diperbarui");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createPromo(data);
        if (res.success && res.data) {
          setPromos((prev) => [...prev, res.data as Promo]);
          toast.success("Promo berhasil ditambahkan");
        } else {
          toast.error(res.error);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    
    try {
      const res = await deletePromo(deletingId);
      if (res.success) {
        setPromos((prev) => prev.filter((p) => p.id !== deletingId));
        toast.success("Promo berhasil dihapus");
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Promo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {promos.length === 0 ? (
          <div className="col-span-full p-10 text-center border rounded-xl border-dashed">
            <Megaphone className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Belum ada promo aktif</p>
          </div>
        ) : (
          promos.map((promo) => (
            <div
              key={promo.id}
              className={`card-base p-5 border-l-4 ${
                promo.isActive ? "border-l-primary" : "border-l-muted opacity-70"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="pr-2">
                  <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">
                    {promo.title}
                  </h3>
                  {promo.description && (
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {promo.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(promo)}
                    className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors text-slate-400"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(promo.id)}
                    className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors text-slate-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
                {promo.badgeText && (
                  <span className="bg-rose-100 text-rose-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                    {promo.badgeText}
                  </span>
                )}
                {promo.subtitle && (
                  <span className="px-2 py-0.5 bg-slate-100 font-mono text-xs font-semibold rounded text-slate-600 border border-slate-200">
                    {promo.subtitle}
                  </span>
                )}
              </div>
              
              {promo.validUntil && (
                <p className="text-[11px] font-medium text-slate-500 mt-3">
                  Valid s/d {formatDate(promo.validUntil)}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Promo" : "Tambah Promo Baru"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Judul Promo *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Cth: Promo Kemerdekaan"
              />
            </div>
            <div className="space-y-2">
              <Label>Kode Voucher (Opsional)</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Cth: MERDEKA45"
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi Diskon</Label>
              <Input
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="Cth: Diskon s/d 45%"
              />
            </div>
            <div className="space-y-2">
              <Label>Berlaku Sampai</Label>
              <Input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Deskripsi Tambahan</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Syarat & ketentuan singkat..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={isActive} onValueChange={(val) => setIsActive(val as string)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Promo?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Promo akan dihapus secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
