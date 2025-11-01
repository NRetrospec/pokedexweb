import { motion } from "framer-motion";
import { getTypeColor } from "../utils/typeColors";

interface FilterBarProps {
  types: string[];
  selectedType: string;
  onTypeChange: (type: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function FilterBar({ types, selectedType, onTypeChange, sortBy, onSortChange }: FilterBarProps) {
  const sortOptions = [
    { value: "pokemonId", label: "Pokédex #" },
    { value: "name", label: "Name" },
    { value: "height", label: "Height" },
    { value: "weight", label: "Weight" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row gap-4"
    >
      {/* Type Filter */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter by Type
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTypeChange("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedType === "all"
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            All Types
          </button>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedType === type
                  ? `${getTypeColor(type)} text-white shadow-lg transform scale-105`
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="lg:w-48">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sort by
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}
