import { Music, Heart, ListMusic } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="p-8 pb-32">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center">
          <span className="text-2xl text-white font-bold">A</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Your Library</h1>
      </div>

      <div className="flex space-x-4 mb-8 border-b border-neutral-800 pb-2">
        <button className="px-4 py-2 bg-neutral-800 text-white rounded-full text-sm font-semibold hover:bg-neutral-700 transition-colors">Playlists</button>
        <button className="px-4 py-2 bg-transparent text-white rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors">Artists</button>
        <button className="px-4 py-2 bg-transparent text-white rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors">Albums</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Liked Songs */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-400 p-4 rounded-md transition-colors cursor-pointer group flex flex-col justify-end aspect-square relative hover:scale-[1.02]">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors rounded-md"></div>
          <Heart className="w-8 h-8 text-white mb-4 z-10 fill-white" />
          <h3 className="text-white font-bold text-2xl mb-1 z-10">Liked Songs</h3>
          <p className="text-white/80 text-sm z-10">142 liked songs</p>
        </div>

        {/* Placeholder Playlists */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-neutral-800/40 hover:bg-neutral-800 p-4 rounded-md transition-colors cursor-pointer group shrink-0">
            <div className="w-full aspect-square bg-neutral-700 rounded-md mb-4 shadow-lg flex items-center justify-center">
              <ListMusic className="w-12 h-12 text-neutral-500" />
            </div>
            <h3 className="text-white font-semibold mb-1 truncate">My Playlist #{i}</h3>
            <p className="text-neutral-400 text-sm line-clamp-2">By Admin</p>
          </div>
        ))}
      </div>
    </div>
  );
}
