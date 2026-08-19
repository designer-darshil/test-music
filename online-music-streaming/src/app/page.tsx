import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Play } from "lucide-react";

export default async function Home() {
  const albums = await prisma.album.findMany({
    include: { artist: true },
    take: 5,
  });

  const artists = await prisma.artist.findMany({
    take: 6,
  });

  return (
    <div className="p-8 pb-32">
      <h1 className="text-3xl font-bold text-white mb-6">Good evening</h1>
      
      {/* Quick Picks / Artists (placeholder for liked/recent) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {artists.map((artist) => (
          <Link href={`/artist/${artist.id}`} key={artist.id}>
            <div className="bg-neutral-800/50 hover:bg-neutral-800 transition-colors rounded overflow-hidden flex items-center cursor-pointer group pr-4">
              <div className="w-16 h-16 bg-neutral-700 shrink-0 shadow-lg flex items-center justify-center">
                {/* Placeholder image */}
              </div>
              <span className="text-white font-semibold ml-4 flex-1 truncate">{artist.name}</span>
              <button className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl text-black hover:scale-105">
                <Play className="w-5 h-5 fill-current ml-1" />
              </button>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-white mb-4">Recommended Albums</h2>
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {albums.map((album) => (
          <Link href={`/album/${album.id}`} key={album.id}>
            <div className="w-48 bg-neutral-800/40 hover:bg-neutral-800 p-4 rounded-md transition-colors cursor-pointer group shrink-0">
              <div className="w-full aspect-square bg-neutral-700 rounded-md mb-4 shadow-lg relative">
                 <button className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-xl text-black hover:scale-105">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
              </div>
              <h3 className="text-white font-semibold mb-1 truncate">{album.title}</h3>
              <p className="text-neutral-400 text-sm line-clamp-2">{album.artist.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
