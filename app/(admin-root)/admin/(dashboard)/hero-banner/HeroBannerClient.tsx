"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
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
import { ImageUpload } from "@/components/admin/ui/ImageUpload";
import {
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  createCarouselItem,
  updateCarouselItem,
  deleteCarouselItem,
  getHeroBanners
} from "@/lib/actions/hero-banner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TableSkeleton } from "@/components/admin/ui/TableSkeleton";

export default function HeroBannerClient({ initialBanners }: { initialBanners: any[] }) {
  const queryClient = useQueryClient();
  
  const { data: banners = initialBanners, isLoading: isFetching } = useQuery({
    queryKey: ["heroBanners"],
    queryFn: async () => {
      const res = await getHeroBanners();
      return res.data || [];
    },
    initialData: initialBanners,
  });

  // Modals state
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // IDs state
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [editingCarouselId, setEditingCarouselId] = useState<string | null>(null);
  const [activeBannerIdForCarousel, setActiveBannerIdForCarousel] = useState<string | null>(null);
  const [deleteData, setDeleteData] = useState<{ type: 'banner' | 'carousel', id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Banner Form State
  const [bTitle, setBTitle] = useState("");
  const [bSubtitle, setBSubtitle] = useState("");
  const [bDescription, setBDescription] = useState("");
  const [bImage, setBImage] = useState("");
  const [bCtaText, setBCtaText] = useState("");
  const [bCtaUrl, setBCtaUrl] = useState("");
  const [bCtaSecondaryText, setBCtaSecondaryText] = useState("");
  const [bCtaSecondaryUrl, setBCtaSecondaryUrl] = useState("");
  const [bIsActive, setBIsActive] = useState("true");

  // Carousel Form State
  const [cMarketplace, setCMarketplace] = useState("");
  const [cImage, setCImage] = useState("");
  const [cIsActive, setCIsActive] = useState("true");

  // --- BANNER ACTIONS ---
  const openAddBanner = () => {
    setEditingBannerId(null);
    setBTitle(""); setBSubtitle(""); setBDescription(""); setBImage("");
    setBCtaText(""); setBCtaUrl(""); setBCtaSecondaryText(""); setBCtaSecondaryUrl("");
    setBIsActive("true");
    setIsBannerModalOpen(true);
  };

  const openEditBanner = (b: any) => {
    setEditingBannerId(b.id);
    setBTitle(b.title); setBSubtitle(b.subtitle); setBDescription(b.description || "");
    setBImage(b.image || ""); setBCtaText(b.ctaText || ""); setBCtaUrl(b.ctaUrl || "");
    setBCtaSecondaryText(b.ctaSecondaryText || ""); setBCtaSecondaryUrl(b.ctaSecondaryUrl || "");
    setBIsActive(b.isActive ? "true" : "false");
    setIsBannerModalOpen(true);
  };

  // --- MUTATIONS ---
  const saveBannerMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingBannerId) {
        return updateHeroBanner(editingBannerId, data);
      }
      return createHeroBanner(data);
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["heroBanners"] });
        toast.success(editingBannerId ? "Banner diperbarui" : "Banner ditambahkan");
        setIsBannerModalOpen(false);
      } else {
        toast.error(res.error || "Gagal menyimpan banner");
      }
    },
    onError: () => toast.error("Terjadi kesalahan sistem")
  });

  const deleteBannerMutation = useMutation({
    mutationFn: async (id: string) => deleteHeroBanner(id),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["heroBanners"] });
        toast.success("Banner dihapus");
        setIsDeleteDialogOpen(false);
      } else toast.error(res.error);
    }
  });

  const saveCarouselMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingCarouselId) {
        return updateCarouselItem(editingCarouselId, data);
      }
      return createCarouselItem(data);
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["heroBanners"] });
        toast.success(editingCarouselId ? "Foto diperbarui" : "Foto ditambahkan");
        setIsCarouselModalOpen(false);
      } else toast.error(res.error || "Gagal menyimpan foto");
    }
  });

  const deleteCarouselMutation = useMutation({
    mutationFn: async (id: string) => deleteCarouselItem(id),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["heroBanners"] });
        toast.success("Foto dihapus");
        setIsDeleteDialogOpen(false);
      } else toast.error(res.error);
    }
  });

  // --- ACTIONS HANDLERS ---
  const handleSaveBanner = () => {
    if (!bTitle || !bSubtitle) {
      toast.error("Judul dan Subjudul wajib diisi");
      return;
    }
    saveBannerMutation.mutate({
      title: bTitle, subtitle: bSubtitle, description: bDescription,
      image: bImage, ctaText: bCtaText, ctaUrl: bCtaUrl,
      ctaSecondaryText: bCtaSecondaryText, ctaSecondaryUrl: bCtaSecondaryUrl,
      isActive: bIsActive === "true"
    });
  };

  // --- CAROUSEL ACTIONS ---
  const openAddCarousel = (bannerId: string) => {
    setActiveBannerIdForCarousel(bannerId);
    setEditingCarouselId(null);
    setCMarketplace(""); setCImage(""); setCIsActive("true");
    setIsCarouselModalOpen(true);
  };

  const openEditCarousel = (bannerId: string, c: any) => {
    setActiveBannerIdForCarousel(bannerId);
    setEditingCarouselId(c.id);
    setCMarketplace(c.marketplace || ""); setCImage(c.image);
    setCIsActive(c.isActive ? "true" : "false");
    setIsCarouselModalOpen(true);
  };

  const handleSaveCarousel = () => {
    if (!activeBannerIdForCarousel) return;
    if (!cImage) {
      toast.error("Gambar wajib diisi");
      return;
    }
    saveCarouselMutation.mutate({
      heroBannerId: activeBannerIdForCarousel,
      marketplace: cMarketplace || "Foto",
      image: cImage,
      isActive: cIsActive === "true"
    });
  };

  const confirmDelete = () => {
    if (!deleteData) return;
    if (deleteData.type === 'banner') {
      deleteBannerMutation.mutate(deleteData.id);
    } else {
      deleteCarouselMutation.mutate(deleteData.id);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <div title={banners.length > 0 ? "Bisa digunakan jika belum memiliki banner" : ""}>
          <Button
            onClick={openAddBanner}
            className="gap-2 bg-primary hover:bg-primary-600 text-white rounded-full px-6"
            disabled={banners.length > 0}
          >
            <Plus className="w-4 h-4" /> Tambah Banner
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {banners.map((banner: any) => (
          <div key={banner.id} className="admin-card p-5 flex flex-col gap-4 border border-slate-200 shadow-sm rounded-xl bg-white">
            <div className="flex items-center gap-5">
              <button className="text-muted-foreground cursor-grab">
                <GripVertical className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-lg">{banner.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{banner.subtitle}</p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${banner.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {banner.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                  <span className="text-xs text-muted-foreground bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">Urutan: {banner.order}</span>
                  {banner.ctaText && <span className="text-xs text-primary bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100">CTA: {banner.ctaText}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => openEditBanner(banner)} className="h-8 rounded-full px-4 border-blue-200 hover:bg-blue-50 hover:text-blue-600 text-blue-500">
                  <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setDeleteData({ type: 'banner', id: banner.id }); setIsDeleteDialogOpen(true); }} className="h-8 w-8 rounded-full p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="pl-10 mt-2 pt-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl -mx-5 -mb-5 px-5 pb-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Foto Carousel (Slideshow)
                </h4>
                <Button variant="outline" size="sm" onClick={() => openAddCarousel(banner.id)} className="h-8 rounded-full px-4 text-xs border-primary/20 text-primary hover:bg-primary hover:text-white">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Foto
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {banner.carouselItems?.map((item: any) => (
                  <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden group relative bg-white shadow-sm hover:shadow-md transition-shadow">
                    <img src={item.image} alt={item.marketplace} className="w-full h-28 object-cover" />
                    {item.marketplace && item.marketplace !== "Foto" && (
                      <div className="p-2.5 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-800 line-clamp-1">{item.marketplace}</p>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditCarousel(banner.id, item)} className="p-1.5 bg-white/90 backdrop-blur-sm text-blue-600 rounded-md hover:bg-blue-50 shadow-sm"><Pencil className="w-3 h-3" /></button>
                      <button onClick={() => { setDeleteData({ type: 'carousel', id: item.id }); setIsDeleteDialogOpen(true); }} className="p-1.5 bg-white/90 backdrop-blur-sm text-red-600 rounded-md hover:bg-red-50 shadow-sm"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
                {(!banner.carouselItems || banner.carouselItems.length === 0) && (
                  <p className="text-xs text-muted-foreground italic col-span-full py-4 text-center border border-dashed rounded-lg">Belum ada gambar carousel ditambahkan.</p>
                )}
              </div>
            </div>
          </div>
        ))}
        {isFetching && banners.length === 0 ? (
          <TableSkeleton columns={1} rows={3} showActions={false} />
        ) : banners.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-500 font-medium">Belum ada data Hero Banner.</p>
          </div>
        ) : null}
      </div>

      {/* Banner Modal */}
      <Dialog open={isBannerModalOpen} onOpenChange={setIsBannerModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBannerId ? "Edit Banner" : "Tambah Banner"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Judul Utama *</Label>
              <Input value={bTitle} onChange={e => setBTitle(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Subjudul *</Label>
              <Input value={bSubtitle} onChange={e => setBSubtitle(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Deskripsi</Label>
              <Textarea value={bDescription} onChange={e => setBDescription(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Logo / Gambar Hero *</Label>
              <ImageUpload value={bImage} onChange={setBImage} label="Upload Gambar Banner" />
            </div>
            <div className="space-y-2">
              <Label>Teks CTA 1</Label>
              <Input value={bCtaText} onChange={e => setBCtaText(e.target.value)} placeholder="Cth: Belanja Popok" />
            </div>
            <div className="space-y-2">
              <Label>URL CTA 1</Label>
              <Input value={bCtaUrl} onChange={e => setBCtaUrl(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Teks CTA 2</Label>
              <Input value={bCtaSecondaryText} onChange={e => setBCtaSecondaryText(e.target.value)} placeholder="Cth: Konsultasi" />
            </div>
            <div className="space-y-2">
              <Label>URL CTA 2</Label>
              <Input value={bCtaSecondaryUrl} onChange={e => setBCtaSecondaryUrl(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={bIsActive} onValueChange={(val) => setBIsActive(val || "true")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsBannerModalOpen(false)}>
                Batal
              </Button>
              <Button type="button" onClick={handleSaveBanner} disabled={saveBannerMutation.isPending}>
                {saveBannerMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Carousel Item Modal */}
      <Dialog open={isCarouselModalOpen} onOpenChange={setIsCarouselModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCarouselId ? "Edit Foto Carousel" : "Tambah Foto Carousel"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="space-y-2">
              <Label>Judul Foto (Opsional)</Label>
              <Input value={cMarketplace} onChange={e => setCMarketplace(e.target.value)} placeholder="Cth: Suasana Toko" />
            </div>
            <div className="space-y-2">
              <Label>Foto *</Label>
              <ImageUpload value={cImage} onChange={setCImage} label="Upload Foto" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={cIsActive} onValueChange={(val) => setCIsActive(val || "true")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCarouselModalOpen(false)}>
                Batal
              </Button>
              <Button type="button" onClick={handleSaveCarousel} disabled={saveCarouselMutation.isPending}>
                {saveCarouselMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data?</AlertDialogTitle>
            <AlertDialogDescription>Data yang dihapus tidak dapat dikembalikan lagi.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteBannerMutation.isPending || deleteCarouselMutation.isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700" disabled={deleteBannerMutation.isPending || deleteCarouselMutation.isPending}>
              {deleteBannerMutation.isPending || deleteCarouselMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
