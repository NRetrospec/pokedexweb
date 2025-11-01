import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { PokemonExplorer } from "./components/PokemonExplorer";
import { useEffect, useState } from "react";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const initializePokemon = useMutation(api.pokemon.initializePokemon);

  useEffect(() => {
    // Initialize Pokémon data on app load
    initializePokemon().catch(console.error);
  }, [initializePokemon]);

  if (showWelcome) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-white font-bold text-3xl">P</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-4">
              Pokédex Explorer
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Discover the world of Pokémon. Explore their types, stats, and more!
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-blue-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Enter
            </button>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
              Pokédex Explorer
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <PokemonExplorer />
      </main>
      <Toaster />
    </div>
  );
}
