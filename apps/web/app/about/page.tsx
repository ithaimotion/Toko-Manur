import type { Metadata } from "next";
import Image from "next/image";
import { Shield, Heart, Zap, Star, Target, BookOpen, Award, Users, Flame as Fire, Activity } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CTAWhatsApp } from "@/components/sections/CTAWhatsApp";
import { mockCompanyProfile } from "@toko-manur/mock-data";
import { getCompanyProfile } from "@/../admin/app/actions/company";
import { getContactInfo } from "@/../admin/app/actions/contact";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kenali lebih dekat Toko Manur Baby Care — sahabat belanja Bunda. Pelajari sejarah, visi, misi, dan nilai-nilai kami.",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  heart: Heart,
  zap: Zap,
  star: Star,
  fire: Fire,
  award: Award,
  activity: Activity,
};

export default async function AboutPage() {
  const profileResponse = await getCompanyProfile();
  const profile = (profileResponse.success && profileResponse.data) ? profileResponse.data : mockCompanyProfile;
  const contactResponse = await getContactInfo();
  const contact = contactResponse.success ? contactResponse.data : undefined;

  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-border py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Tentang Kami" }]} />
        </div>
      </div>

      {/* Page Hero */}
      <section className="section bg-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge-primary inline-flex mb-6">
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Profil Perusahaan
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Tentang{" "}
            <span className="gradient-text">Toko Manur</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {profile.about.slice(0, 200)}...
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-3xl mx-auto">
            {[
              { value: `Sejak ${profile.founded}`, label: "Berdiri" },
              { value: "10,000+", label: "Bunda Terbantu" },
              { value: "100+", label: "Jenis Produk" },
              { value: "24/7", label: "Layanan Pelanggan" },
            ].map(({ value, label }) => (
              <div key={label} className="card-base p-5 text-center">
                <p className="text-2xl font-bold text-primary mb-1">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionTitle
                badge="Tentang Kami"
                title="Siapa"
                highlight="Toko Manur?"
                align="left"
              />
              <p className="text-slate-600 leading-relaxed mb-6">{profile.about}</p>
              <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-sm text-slate-700 font-medium">
                  Berdiri sejak {profile.founded}, kami telah melayani lebih dari 10.000 Bunda di seluruh Indonesia.
                </p>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop"
                alt="Tentang Toko Manur"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section bg-section-alt">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle badge="Arah Kami" title="Visi &" highlight="Misi" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="card-base p-8 border-l-4 border-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Visi</h3>
              </div>
              <p className="text-slate-600 leading-relaxed italic text-lg">
                &ldquo;{profile.vision}&rdquo;
              </p>
            </div>

            {/* Mission */}
            <div className="card-base p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Misi</h3>
              </div>
              <ul className="space-y-3">
                {profile.mission.map((m, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                    <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <SectionTitle badge="Perjalanan Kami" title="Brand" highlight="Story" />
            <p className="text-slate-600 leading-relaxed text-lg">{profile.brandStory}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-section-alt">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle badge="Prinsip Kami" title="Nilai-Nilai" highlight="Perusahaan" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profile.values.map((value) => {
              const Icon = iconMap[value.icon ?? "star"] ?? Star;
              return (
                <div key={value.id} className="card-base p-6 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{value.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Legal Documents */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Legalitas"
            title="Dokumen"
            highlight="Legal"
            description="Toko Manur beroperasi secara legal dan terdaftar resmi di Indonesia"
          />
          <div className="max-w-2xl mx-auto space-y-4">
            {profile.legalDocuments.map((doc) => (
              <div key={doc.id} className="card-base p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm">{doc.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">No. {doc.number}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {doc.issuedBy} · {doc.issuedDate}
                  </p>
                </div>
                <span className="badge-success text-xs">Aktif</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTAWhatsApp phone={contact?.whatsapp ?? ""} message={contact?.whatsappMessage ?? "Halo, saya ingin tahu lebih lanjut tentang Toko Manur."} />
    </div>
  );
}
