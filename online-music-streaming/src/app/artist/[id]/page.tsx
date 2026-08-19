import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";
import Link from "next/link";

export default async function ArtistPage({ params }: { params: { id: string } }) {
  const artist = await prisma.artist.findUnique({
    where: { id: params.id },
    include: {
      albums: {
        include: { songs: true }
      },
      songs: {
        take: 5
      }
    }
  });

  if (!artist) {
    notFound();
  }

  return (
    <div className="pb-32">
      <div className="h-64 bg-gradient-to-b from-neutral-600 to-neutral-900 flex items-end p-8">
        <h1 className="text-5xl font-extrabold text-white">{artist.name}</h1>
      </div>
      
      <div className="p-8">
        <div className="mb-8">
          <button className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center hover:scale-105 transition-transform text-black shadow-xl">
            <Play className="w-6 h-6 fill-current ml-1" />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Popular</h2>
        <div className="mb-8">
          {artist.songs.map((song, index) => (
            <div key={song.id} className="flex items-center group hover:bg-neutral-800 p-2 rounded transition-colors cursor-pointer">
              <span className="w-8 text-center text-neutral-400 group-hover:hidden">{index + 1}</span>
              <span className="w-8 text-center text-white hidden group-hover:block"><Play className="w-4 h-4 fill-current mx-auto" /></span>
              <div className="flex-1 ml-4 text-white">{song.title}</div>
              <div className="text-neutral-400 text-sm">
                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Albums</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {artist.albums.map((album) => (
            <Link href={`/album/${album.id}`} key={album.id}>
              <div className="bg-neutral-800/40 hover:bg-neutral-800 p-4 rounded-md transition-colors cursor-pointer group">
                <div className="w-full aspect-square bg-neutral-700 rounded-md mb-4 shadow-lg relative">
                  <button className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-xl text-black">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </button>
                </div>
                <h3 className="text-white font-semibold mb-1 truncate">{album.title}</h3>
                <p className="text-neutral-400 text-sm">{album.releaseYear}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
