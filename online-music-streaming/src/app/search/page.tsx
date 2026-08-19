import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="p-8 pb-32">
      <div className="sticky top-0 bg-neutral-900 z-10 pb-4 pt-2">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-full leading-5 bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:bg-white focus:text-black focus:placeholder-neutral-500 sm:text-sm transition-colors"
            placeholder="What do you want to listen to?"
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Browse all</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {["Podcasts", "Live Events", "Made For You", "New Releases", "Pop", "Hip-Hop", "Rock", "Latin"].map((genre) => (
            <div key={genre} className="bg-neutral-800 rounded-lg p-4 aspect-square flex flex-col justify-between overflow-hidden relative cursor-pointer hover:opacity-80 transition-opacity" style={{backgroundColor: `hsl(${Math.random() * 360}, 60%, 40%)`}}>
              <span className="font-bold text-white text-lg z-10">{genre}</span>
              {/* Decorative rotated square */}
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-black/20 rotate-[25deg] shadow-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
