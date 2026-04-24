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
import { getTypeGlow } from "../utils/typeColors";

export function PokemonExplorer() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("pokemonId");
  const [selectedPokemon, setSelectedPokemon] = useState<Doc<"pokemon"> | null>(null);
  const [comparePokemon, setComparePokemon] = useState<Doc<"pokemon"> | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showCompareModal, setShowCompareModal] = useState(false);

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

  const handleCompareClick = () => {
    if (selectedPokemon) {
      setShowCompareModal(true);
    }
  };

  const handleCompareSelect = (pokemon: Doc<"pokemon">) => {
    setComparePokemon(pokemon);
    setShowCompareModal(false);
  };

  const clearCompare = () => {
    setComparePokemon(null);
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
                onClick={() => showCompareModal ? handleCompareSelect(p) : setSelectedPokemon(p)}
                isFavorite={false}
                isCompareMode={showCompareModal}
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
          {selectedPokemon && !showCompareModal && !comparePokemon && (
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
              onCompare={handleCompareClick}
            />
          )}
        </AnimatePresence>

        {/* Compare Selection Modal */}
        <AnimatePresence>
          {showCompareModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCompareModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Select Pokémon to Compare with {selectedPokemon?.name}
                  </h3>
                  <button
                    onClick={() => setShowCompareModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {pokemon.filter(p => p.pokemonId !== selectedPokemon?.pokemonId).map((p) => {
                      const primaryType = p.type[0];
                      const glow = getTypeGlow(primaryType);
                      return (
                        <div
                          key={p.pokemonId}
                          className={`cursor-pointer rounded-lg p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:${glow} transition-all duration-300 border-2 border-transparent hover:border-blue-400`}
                          onClick={() => handleCompareSelect(p)}
                        >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-16 h-16 mx-auto object-contain mb-2"
                        />
                        <div className="text-center">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                            {p.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            #{p.pokemonId.toString().padStart(3, "0")}
                          </div>
                        </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compare View Modal */}
        <AnimatePresence>
          {comparePokemon && selectedPokemon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setComparePokemon(null);
                setSelectedPokemon(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Pokémon Comparison
                  </h3>
                  <button
                    onClick={() => {
                      setComparePokemon(null);
                      setSelectedPokemon(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* First Pokemon */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {selectedPokemon.name}
                      </h4>
                      <img
                        src={selectedPokemon.image}
                        alt={selectedPokemon.name}
                        className="w-32 h-32 mx-auto object-contain"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {(selectedPokemon.height / 10).toFixed(1)}m
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Height</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {(selectedPokemon.weight / 10).toFixed(1)}kg
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Weight</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Stats</h5>
                      <div className="space-y-2">
                        {Object.entries(selectedPokemon.stats).map(([stat, value]) => (
                          <div key={stat} className="flex justify-between text-sm">
                            <span className="capitalize text-gray-600 dark:text-gray-400">
                              {stat.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Second Pokemon */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {comparePokemon.name}
                      </h4>
                      <img
                        src={comparePokemon.image}
                        alt={comparePokemon.name}
                        className="w-32 h-32 mx-auto object-contain"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {(comparePokemon.height / 10).toFixed(1)}m
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Height</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {(comparePokemon.weight / 10).toFixed(1)}kg
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Weight</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Stats</h5>
                      <div className="space-y-2">
                        {Object.entries(comparePokemon.stats).map(([stat, value]) => (
                          <div key={stat} className="flex justify-between text-sm">
                            <span className="capitalize text-gray-600 dark:text-gray-400">
                              {stat.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
