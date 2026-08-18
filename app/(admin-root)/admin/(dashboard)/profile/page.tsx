"use client";

import { useEffect, useState } from "react";
import { User, Save, Lock, Mail, Shield, Camera } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ImageUpload } from "@/components/admin/ui/ImageUpload";
import { getMyProfile, updateMyProfile } from "@/lib/actions/users";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CardSkeleton } from "@/components/admin/ui/CardSkeleton";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [role, setRole] = useState("EDITOR");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const res = await getMyProfile();
      return (res.success && res.data) ? res.data : null;
    }
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        password: "",
        avatar: profile.avatar || "",
      });
      setRole(profile.role);
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await updateMyProfile(data);
      if (!res.success) throw new Error(res.error || "Gagal memperbarui profil");
      return res;
    },
    onSuccess: () => {
      toast.success("Profil berhasil diperbarui.");
      setFormData(prev => ({ ...prev, password: "" }));
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      // Reload to update header (because it might be needed for the avatar on header)
      setTimeout(() => window.location.reload(), 1000);
    },
    onError: (error: any) => toast.error(error.message)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      avatar: formData.avatar,
    });
  };

  return (
    <div>
      <PageHeader
        title="Profil Saya"
        description="Kelola informasi akun, kata sandi, dan foto profil Anda"
        breadcrumb={[{ label: "Dasbor", href: "/admin" }, { label: "Profil Saya" }]}
      />

      <div className="max-w-4xl mx-auto mt-6">
        <div className="admin-card overflow-hidden">
          {isLoading ? (
            <div className="p-6 md:p-8">
              <CardSkeleton lines={5} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-10">
                {/* Left Column: Avatar */}
                <div className="w-full md:w-1/3 flex flex-col items-center space-y-4 border-b md:border-b-0 md:border-r border-border pb-8 md:pb-0 md:pr-8">
                  <div className="w-full max-w-[200px] aspect-square rounded-full overflow-hidden border-4 border-muted relative group mx-auto">
                    {formData.avatar ? (
                      <Image src={formData.avatar} alt="Profile" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <User className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="w-full space-y-2">
                    <label className="text-sm font-semibold text-center block text-foreground">Foto Profil</label>
                    <ImageUpload 
                      value={formData.avatar}
                      onChange={(url) => setFormData(prev => ({ ...prev, avatar: url }))}
                      onRemove={() => setFormData(prev => ({ ...prev, avatar: "" }))}
                      aspectRatio="square"
                    />
                    <p className="text-[11px] text-muted-foreground text-center">Rasio 1:1, max 2MB (JPG/PNG)</p>
                  </div>
                  <div className="mt-4 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hak Akses</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                      {role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : 'EDITOR'}
                    </span>
                  </div>
                </div>

                {/* Right Column: Details */}
                <div className="w-full md:w-2/3 space-y-6">
                  <h3 className="font-bold text-lg text-foreground border-b border-border pb-2">Informasi Akun</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="admin-label flex items-center gap-1.5"><User className="w-4 h-4" /> Nama Lengkap</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        placeholder="Masukkan nama Anda" 
                        className="admin-input" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="admin-label flex items-center gap-1.5"><Mail className="w-4 h-4" /> Email</label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        placeholder="email@contoh.com" 
                        className="admin-input" 
                        required 
                      />
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-foreground border-b border-border pb-2 pt-4">Keamanan</h3>
                  
                  <div className="space-y-1.5">
                    <label className="admin-label flex items-center gap-1.5"><Lock className="w-4 h-4" /> Kata Sandi Baru</label>
                    <input 
                      type="password" 
                      value={formData.password} 
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                      placeholder="Biarkan kosong jika tidak ingin mengubah" 
                      className="admin-input" 
                      minLength={8}
                    />
                    <p className="text-[11px] text-muted-foreground mt-1 bg-blue-50 text-blue-700 p-2 rounded-md">
                      💡 Ketik kata sandi baru (minimal 8 karakter) hanya jika Anda ingin mengubahnya. Jika tidak, biarkan saja kosong.
                    </p>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button type="submit" disabled={saveMutation.isPending} className="btn-admin-primary px-8 py-2.5 shadow-md shadow-primary/20">
                      <Save className="w-4 h-4 mr-2" />
                      {saveMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
