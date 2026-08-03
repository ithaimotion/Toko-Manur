import { PrismaClient, Role, UserStatus, RequestStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const defaultContact = {
  address: "Jl. Kasih Bunda No. 88, Malang, Jawa Timur 65141",
  email: "hello@tokomanur.id",
  whatsapp: "6281234567890",
  whatsappMessage: "Halo, saya ingin tahu lebih lanjut tentang Toko Manur.",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.0000000000004!2d112.63000000000001!3d-7.9800000000000005!2m3!1f0!2f0!3f0!3m2!1m1!2s0x0%3A0x0!5e0!3m2!1sid!2sid!4v1710000000000",
  googleMapsUrl: "https://maps.google.com/?q=Toko+Manur",
  businessHours: "Senin – Sabtu: 08.00 – 17.00 WIB",
};

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean old data
  await prisma.contactInfo.deleteMany();
  await prisma.resetRequest.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash("12345678", 10);

  // Create Users
  const superAdmin = await prisma.user.create({
    data: {
      name: "Admin Utama",
      email: "admin@tokomanur.id",
      password: defaultPasswordHash,
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      lastLogin: new Date(),
    },
  });

  const editor = await prisma.user.create({
    data: {
      name: "Content Creator",
      email: "content@tokomanur.id",
      password: defaultPasswordHash,
      role: Role.EDITOR,
      status: UserStatus.ACTIVE,
      lastLogin: new Date(Date.now() - 86400000),
    },
  });

  const viewer = await prisma.user.create({
    data: {
      name: "Tim Support",
      email: "support@tokomanur.id",
      password: defaultPasswordHash,
      role: Role.VIEWER,
      status: UserStatus.INACTIVE,
    },
  });

  console.log({ superAdmin, editor, viewer });

  const contactInfo = await prisma.contactInfo.create({
    data: defaultContact,
  });

  console.log({ contactInfo });

  // Create Reset Requests
  const req1 = await prisma.resetRequest.create({
    data: {
      email: "editor@tokomanur.id",
      status: RequestStatus.PENDING,
    },
  });

  const req2 = await prisma.resetRequest.create({
    data: {
      email: "support@tokomanur.id",
      status: RequestStatus.PENDING,
    },
  });

  console.log({ req1, req2 });
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
