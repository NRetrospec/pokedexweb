export const typeColors: Record<string, string> = {
  Normal: "bg-gray-400",
  Fire: "bg-red-500",
  Water: "bg-blue-500",
  Electric: "bg-yellow-400",
  Grass: "bg-green-500",
  Ice: "bg-blue-300",
  Fighting: "bg-red-700",
  Poison: "bg-purple-500",
  Ground: "bg-yellow-600",
  Flying: "bg-indigo-400",
  Psychic: "bg-pink-500",
  Bug: "bg-green-400",
  Rock: "bg-yellow-800",
  Ghost: "bg-purple-700",
  Dragon: "bg-indigo-700",
  Dark: "bg-gray-800",
  Steel: "bg-gray-500",
  Fairy: "bg-pink-300",
};

export const typeGradients: Record<string, string> = {
  Normal: "bg-gradient-to-br from-gray-400 to-gray-500",
  Fire: "bg-gradient-to-br from-red-400 to-orange-600",
  Water: "bg-gradient-to-br from-blue-400 to-blue-600",
  Electric: "bg-gradient-to-br from-yellow-300 to-yellow-500",
  Grass: "bg-gradient-to-br from-green-400 to-green-600",
  Ice: "bg-gradient-to-br from-blue-200 to-blue-400",
  Fighting: "bg-gradient-to-br from-red-600 to-red-800",
  Poison: "bg-gradient-to-br from-purple-400 to-purple-600",
  Ground: "bg-gradient-to-br from-yellow-500 to-yellow-700",
  Flying: "bg-gradient-to-br from-indigo-300 to-indigo-500",
  Psychic: "bg-gradient-to-br from-pink-400 to-pink-600",
  Bug: "bg-gradient-to-br from-green-300 to-green-500",
  Rock: "bg-gradient-to-br from-yellow-700 to-yellow-900",
  Ghost: "bg-gradient-to-br from-purple-600 to-purple-800",
  Dragon: "bg-gradient-to-br from-indigo-600 to-indigo-800",
  Dark: "bg-gradient-to-br from-gray-700 to-gray-900",
  Steel: "bg-gradient-to-br from-gray-400 to-gray-600",
  Fairy: "bg-gradient-to-br from-pink-200 to-pink-400",
};

export function getTypeColor(type: string): string {
  return typeColors[type] || typeColors.Normal;
}

export function getTypeGradient(type: string): string {
  return typeGradients[type] || typeGradients.Normal;
}
