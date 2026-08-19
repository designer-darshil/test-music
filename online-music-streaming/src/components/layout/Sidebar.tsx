import Link from "next/link";
import { Home, Search, Library, Plus } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-black flex-shrink-0 flex flex-col p-6 h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tighter">MusicStream</h1>
      </div>
      
      <nav className="space-y-4 flex-1">
        <Link href="/" className="flex items-center space-x-3 text-neutral-400 hover:text-white transition-colors">
          <Home className="w-6 h-6" />
          <span className="font-semibold text-sm">Home</span>
        </Link>
        <Link href="/search" className="flex items-center space-x-3 text-neutral-400 hover:text-white transition-colors">
          <Search className="w-6 h-6" />
          <span className="font-semibold text-sm">Search</span>
        </Link>
        <Link href="/library" className="flex items-center space-x-3 text-neutral-400 hover:text-white transition-colors">
          <Library className="w-6 h-6" />
          <span className="font-semibold text-sm">Your Library</span>
        </Link>
      </nav>
      
      <div className="mt-8 pt-8 border-t border-neutral-800">
        <button className="flex items-center space-x-3 text-neutral-400 hover:text-white transition-colors mb-4">
          <div className="bg-neutral-300 text-black p-1 rounded-sm">
            <Plus className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm">Create Playlist</span>
        </button>
      </div>
    </aside>
  );
}
