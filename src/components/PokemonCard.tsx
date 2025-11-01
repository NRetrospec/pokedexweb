import { motion } from "framer-motion";
import { Doc } from "../../convex/_generated/dataModel";
import { getTypeColor, getTypeGradient } from "../utils/typeColors";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface PokemonCardProps {
  pokemon: Doc<"pokemon">;
  onClick: () => void;
  isFavorite: boolean;
}

export function PokemonCard({ pokemon, onClick, isFavorite }: PokemonCardProps) {
  // const toggleFavorite = useMutation(api.pokemon.toggleFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // toggleFavorite({ pokemonId: pokemon.pokemonId });
  };

  const primaryType = pokemon.type[0];
  const gradient = getTypeGradient(primaryType);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      className={`relative cursor-pointer rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 ${gradient} group overflow-hidden`}
      onClick={onClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-white/20"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-white/10"></div>
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <span className={`text-lg ${isFavorite ? "text-red-500" : "text-white/70"}`}>
          {isFavorite ? "❤️" : "🤍"}
        </span>
      </button>

      {/* Pokemon Number */}
      <div className="text-white/70 text-sm font-bold mb-2">
        #{pokemon.pokemonId.toString().padStart(3, "0")}
      </div>

      {/* Pokemon Image */}
      <div className="flex justify-center mb-4">
        <motion.img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-24 h-24 object-contain drop-shadow-lg"
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.3 }
          }}
          loading="lazy"
        />
      </div>

      {/* Pokemon Name */}
      <h3 className="text-white font-bold text-lg text-center mb-3 capitalize">
        {pokemon.name}
      </h3>

      {/* Type Badges */}
      <div className="flex justify-center gap-2 mb-3">
        {pokemon.type.map((type) => (
          <span
            key={type}
            className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-white/20 backdrop-blur-sm border border-white/30"
          >
            {type}
          </span>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 text-white/90 text-xs">
        <div className="text-center">
          <div className="font-semibold">Height</div>
          <div>{(pokemon.height / 10).toFixed(1)}m</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">Weight</div>
          <div>{(pokemon.weight / 10).toFixed(1)}kg</div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
    </motion.div>
  );
}
