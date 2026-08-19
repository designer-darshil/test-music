import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create an Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: "password", // In reality, hash this
    },
  });

  // Create Artists
  const artist1 = await prisma.artist.create({
    data: {
      name: "The Midnight",
      bio: "Synthwave band from Los Angeles.",
    },
  });

  const artist2 = await prisma.artist.create({
    data: {
      name: "Daft Punk",
      bio: "Electronic music duo from Paris.",
    },
  });

  // Create Albums and Songs
  const album1 = await prisma.album.create({
    data: {
      title: "Endless Summer",
      releaseYear: 2016,
      artistId: artist1.id,
      songs: {
        create: [
          { title: "Sunset", duration: 326, audioUrl: "https://example.com/sunset.mp3", artistId: artist1.id },
          { title: "Vampires", duration: 317, audioUrl: "https://example.com/vampires.mp3", artistId: artist1.id },
        ],
      },
    },
  });

  const album2 = await prisma.album.create({
    data: {
      title: "Discovery",
      releaseYear: 2001,
      artistId: artist2.id,
      songs: {
        create: [
          { title: "One More Time", duration: 320, audioUrl: "https://example.com/onemoretime.mp3", artistId: artist2.id },
          { title: "Aerodynamic", duration: 207, audioUrl: "https://example.com/aerodynamic.mp3", artistId: artist2.id },
        ],
      },
    },
  });

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
