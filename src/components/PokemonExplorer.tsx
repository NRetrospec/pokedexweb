import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PokemonCard } from "./PokemonCard";
import { PokemonModal } from "./PokemonModal";
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import { TypeChart } from "./TypeChart";
import { motion, AnimatePresence } from "framer-motion";
import { Doc } from "../../convex/_generated/dataModel";

export function PokemonExplorer() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("pokemonId");
  const [selectedPokemon, setSelectedPokemon] = useState<Doc<"pokemon"> | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const pokemon = useQuery(api.pokemon.getAllPokemon, {
    search: search || undefined,
    type: selectedType !== "all" ? selectedType : undefined,
    sortBy,
  });

  const randomPokemon = useQuery(api.pokemon.getRandomPokemon);
  const typeDistribution = useQuery(api.pokemon.getTypeDistribution);

  const allTypes = useMemo(() => {
    if (!pokemon) return [];
    const types = new Set<string>();
    pokemon.forEach(p => p.type.forEach(t => types.add(t)));
    return Array.from(types).sort();
  }, [pokemon]);

  const handleLuckyClick = () => {
    if (randomPokemon) {
      setSelectedPokemon(randomPokemon);
    }
  };

  const getNextPokemon = () => {
    if (!pokemon || !selectedPokemon) return null;
    const currentIndex = pokemon.findIndex(p => p.pokemonId === selectedPokemon.pokemonId);
    return currentIndex < pokemon.length - 1 ? pokemon[currentIndex + 1] : pokemon[0];
  };

  const getPrevPokemon = () => {
    if (!pokemon || !selectedPokemon) return null;
    const currentIndex = pokemon.findIndex(p => p.pokemonId === selectedPokemon.pokemonId);
    return currentIndex > 0 ? pokemon[currentIndex - 1] : pokemon[pokemon.length - 1];
  };

  if (pokemon === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <SearchBar value={search} onChange={setSearch} />
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleLuckyClick}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🎲 Feeling Lucky
              </button>
              <button
                onClick={() => setShowChart(!showChart)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                📊 {showChart ? "Hide" : "Show"} Chart
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>

          <FilterBar
            types={allTypes}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Type Distribution Chart */}
        <AnimatePresence>
          {showChart && typeDistribution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <TypeChart data={typeDistribution} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Found {pokemon.length} Pokémon
            {search && ` matching "${search}"`}
            {selectedType !== "all" && ` of type ${selectedType}`}
          </p>
        </div>

        {/* Pokemon Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          layout
        >
          <AnimatePresence>
            {pokemon.map((p) => (
              <PokemonCard
                key={p.pokemonId}
                pokemon={p}
                onClick={() => setSelectedPokemon(p)}
                isFavorite={false}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {pokemon.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Pokémon found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Pokemon Detail Modal */}
        <AnimatePresence>
          {selectedPokemon && (
            <PokemonModal
              pokemon={selectedPokemon}
              onClose={() => setSelectedPokemon(null)}
              onNext={() => {
                const next = getNextPokemon();
                if (next) setSelectedPokemon(next);
              }}
              onPrev={() => {
                const prev = getPrevPokemon();
                if (prev) setSelectedPokemon(prev);
              }}
              isFavorite={false}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
