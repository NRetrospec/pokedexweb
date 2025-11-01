import { motion, AnimatePresence } from "framer-motion";
import { Doc } from "../../convex/_generated/dataModel";
import { getTypeColor, getTypeGradient } from "../utils/typeColors";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface PokemonModalProps {
  pokemon: Doc<"pokemon">;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFavorite: boolean;
}

export function PokemonModal({ pokemon, onClose, onNext, onPrev, isFavorite }: PokemonModalProps) {
  // const toggleFavorite = useMutation(api.pokemon.toggleFavorite);

  const handleFavoriteClick = () => {
    // toggleFavorite({ pokemonId: pokemon.pokemonId });
  };

  const primaryType = pokemon.type[0];
  const gradient = getTypeGradient(primaryType);

  const maxStat = Math.max(...Object.values(pokemon.stats));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${gradient}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            ✕
          </button>

          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-white/70 text-sm font-bold mb-1">
                #{pokemon.pokemonId.toString().padStart(3, "0")}
              </div>
              <h2 className="text-3xl font-bold capitalize">{pokemon.name}</h2>
            </div>
            <button
              onClick={handleFavoriteClick}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <span className={`text-2xl ${isFavorite ? "text-red-500" : "text-white/70"}`}>
                {isFavorite ? "❤️" : "🤍"}
              </span>
            </button>
          </div>

          {/* Type Badges */}
          <div className="flex gap-2 mb-4">
            {pokemon.type.map((type) => (
              <span
                key={type}
                className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-white/20 backdrop-blur-sm border border-white/30"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-900 rounded-t-2xl p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Image and Basic Info */}
            <div className="space-y-6">
              <div className="text-center">
                <motion.img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-48 h-48 mx-auto object-contain drop-shadow-2xl"
                  whileHover={{ 
                    scale: 1.05,
                    rotate: [0, -2, 2, 0],
                    transition: { duration: 0.3 }
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(pokemon.height / 10).toFixed(1)}m
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Height</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(pokemon.weight / 10).toFixed(1)}kg
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Weight</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {pokemon.description}
                </p>
              </div>
            </div>

            {/* Right Column - Stats and Abilities */}
            <div className="space-y-6">
              {/* Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Base Stats</h3>
                <div className="space-y-3">
                  {Object.entries(pokemon.stats).map(([stat, value]) => (
                    <div key={stat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-gray-600 dark:text-gray-400">
                          {stat.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full bg-gradient-to-r ${getTypeColor(primaryType)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(value / maxStat) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Abilities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability) => (
                    <span
                      key={ability}
                      className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium"
                    >
                      {ability}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Weaknesses</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.weaknesses.map((weakness) => (
                    <span
                      key={weakness}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm font-medium"
                    >
                      {weakness}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onPrev}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              ← Previous
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Navigate with arrow keys
            </div>
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
