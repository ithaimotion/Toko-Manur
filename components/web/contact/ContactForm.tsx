"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { submitContactMessage } from "@/lib/actions/contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (value: string | null) => {
    if (value) setForm((prev) => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const response = await submitContactMessage(form);

    if (response.success) {
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } else {
      setStatus("error");
      setErrorMessage((response as any).error || "Gagal mengirim pesan. Silakan coba lagi.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Pesan Terkirim!</h3>
        <p className="text-muted-foreground text-sm">
          Terima kasih, {form.name}! Kami akan membalas dalam 1x24 jam kerja.
        </p>
        <Button
          onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
          variant="secondary"
          className="mt-6"
        >
          Kirim Pesan Lain
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">
      {status === "error" && errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Nama Lengkap <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Masukkan nama Anda"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="email@contoh.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="phone">
            No. WhatsApp / Telepon
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="subject">
            Subjek <span className="text-destructive">*</span>
          </Label>
          <Select required value={form.subject} onValueChange={handleSelectChange}>
            <SelectTrigger id="subject">
              <SelectValue placeholder="Pilih subjek..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pertanyaan Produk">Pertanyaan Produk</SelectItem>
              <SelectItem value="Kerjasama / Distributor">Kerjasama / Distributor</SelectItem>
              <SelectItem value="Konsultasi Pemilihan Popok">Konsultasi Pemilihan Popok</SelectItem>
              <SelectItem value="Pengiriman & Pemesanan">Pengiriman & Pemesanan</SelectItem>
              <SelectItem value="Lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">
          Pesan <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tuliskan pesan atau pertanyaan Anda..."
          className="resize-none"
        />
      </div>

      <Button
        type="submit"
        id="submit-contact"
        disabled={status === "loading"}
        className="w-full"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Mengirim...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Kirim Pesan
          </>
        )}
      </Button>
    </form>
  );
}
