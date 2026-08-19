import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Play, Clock } from "lucide-react";
import Link from "next/link";

export default async function AlbumPage({ params }: { params: { id: string } }) {
  const album = await prisma.album.findUnique({
    where: { id: params.id },
    include: {
      artist: true,
      songs: true
    }
  });

  if (!album) {
    notFound();
  }

  const totalDuration = album.songs.reduce((acc, song) => acc + song.duration, 0);

  return (
    <div className="pb-32">
      <div className="bg-gradient-to-b from-neutral-600 to-neutral-900 p-8 flex items-end">
        <div className="w-48 h-48 bg-neutral-800 shadow-2xl mr-6 shrink-0">
           {/* Placeholder cover art */}
        </div>
        <div>
          <span className="text-sm font-bold text-white uppercase tracking-wider mb-2 block">Album</span>
          <h1 className="text-5xl font-extrabold text-white mb-4">{album.title}</h1>
          <div className="flex items-center text-sm text-neutral-300">
            <Link href={`/artist/${album.artistId}`} className="font-bold text-white hover:underline">
              {album.artist.name}
            </Link>
            <span className="mx-1">•</span>
            <span>{album.releaseYear}</span>
            <span className="mx-1">•</span>
            <span>{album.songs.length} songs, {Math.floor(totalDuration / 60)} min {totalDuration % 60} sec</span>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <div className="mb-8">
          <button className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center hover:scale-105 transition-transform text-black shadow-xl">
            <Play className="w-6 h-6 fill-current ml-1" />
          </button>
        </div>

        <div>
          <div className="flex items-center text-neutral-400 border-b border-neutral-800 pb-2 mb-4 px-2">
            <span className="w-8 text-center">#</span>
            <span className="flex-1 ml-4">Title</span>
            <span className="w-12 text-right"><Clock className="w-4 h-4 inline-block" /></span>
          </div>
          {album.songs.map((song, index) => (
            <div key={song.id} className="flex items-center group hover:bg-neutral-800 p-2 rounded transition-colors cursor-pointer text-white">
              <span className="w-8 text-center text-neutral-400 group-hover:hidden">{index + 1}</span>
              <span className="w-8 text-center text-white hidden group-hover:block"><Play className="w-4 h-4 fill-current mx-auto" /></span>
              <div className="flex-1 ml-4">
                <div className="text-white">{song.title}</div>
                <Link href={`/artist/${album.artistId}`} className="text-neutral-400 text-sm hover:underline group-hover:text-white">
                  {album.artist.name}
                </Link>
              </div>
              <div className="w-12 text-right text-neutral-400 text-sm">
                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
