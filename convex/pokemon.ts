import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

// Sample Pokémon data for demonstration
const samplePokemon = [
  {
    pokemonId: 1,
    name: "Bulbasaur",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    type: ["Grass", "Poison"],
    height: 7,
    weight: 69,
    abilities: ["Overgrow", "Chlorophyll"],
    weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
    stats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45 },
    description: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon."
  },
  {
    pokemonId: 4,
    name: "Charmander",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
    type: ["Fire"],
    height: 6,
    weight: 85,
    abilities: ["Blaze", "Solar Power"],
    weaknesses: ["Water", "Ground", "Rock"],
    stats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 },
    description: "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail."
  },
  {
    pokemonId: 7,
    name: "Squirtle",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
    type: ["Water"],
    height: 5,
    weight: 90,
    abilities: ["Torrent", "Rain Dish"],
    weaknesses: ["Electric", "Grass"],
    stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
    description: "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth."
  },
  {
    pokemonId: 25,
    name: "Pikachu",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    type: ["Electric"],
    height: 4,
    weight: 60,
    abilities: ["Static", "Lightning Rod"],
    weaknesses: ["Ground"],
    stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
    description: "When several of these Pokémon gather, their electricity could build and cause lightning storms."
  },
  {
    pokemonId: 150,
    name: "Mewtwo",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
    type: ["Psychic"],
    height: 20,
    weight: 1220,
    abilities: ["Pressure", "Unnerve"],
    weaknesses: ["Bug", "Ghost", "Dark"],
    stats: { hp: 106, attack: 110, defense: 90, specialAttack: 154, specialDefense: 90, speed: 130 },
    description: "It was created by a scientist after years of horrific gene splicing and DNA engineering experiments."
  },
  {
    pokemonId: 144,
    name: "Articuno",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png",
    type: ["Ice", "Flying"],
    height: 17,
    weight: 554,
    abilities: ["Pressure", "Snow Cloak"],
    weaknesses: ["Electric", "Fire", "Rock", "Steel"],
    stats: { hp: 90, attack: 85, defense: 100, specialAttack: 95, specialDefense: 125, speed: 85 },
    description: "A legendary bird Pokémon that is said to appear to doomed people who are lost in icy mountains."
  },
  {
    pokemonId: 6,
    name: "Charizard",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    type: ["Fire", "Flying"],
    height: 17,
    weight: 905,
    abilities: ["Blaze", "Solar Power"],
    weaknesses: ["Water", "Electric", "Rock"],
    stats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 },
    description: "Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally."
  },
  {
    pokemonId: 9,
    name: "Blastoise",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
    type: ["Water"],
    height: 16,
    weight: 855,
    abilities: ["Torrent", "Rain Dish"],
    weaknesses: ["Electric", "Grass"],
    stats: { hp: 79, attack: 83, defense: 100, specialAttack: 85, specialDefense: 105, speed: 78 },
    description: "A brutal Pokémon with pressurized water jets on its shell. They are used for high speed tackles."
  }
];

export const initializePokemon = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if we already have Pokémon data
    const existing = await ctx.db.query("pokemon").first();
    if (existing) {
      return "Pokémon data already exists";
    }

    // Insert sample Pokémon data
    for (const pokemon of samplePokemon) {
      await ctx.db.insert("pokemon", pokemon);
    }
    
    return "Pokémon data initialized";
  },
});

export const getAllPokemon = query({
  args: {
    search: v.optional(v.string()),
    type: v.optional(v.string()),
    sortBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let results;

    // Apply search filter
    if (args.search) {
      results = await ctx.db
        .query("pokemon")
        .withSearchIndex("search_name", (q) => q.search("name", args.search!))
        .collect();
    } else {
      results = await ctx.db.query("pokemon").collect();
    }

    // Apply type filter
    if (args.type && args.type !== "all") {
      results = results.filter(pokemon => 
        pokemon.type.some(t => t.toLowerCase() === args.type!.toLowerCase())
      );
    }

    // Apply sorting
    if (args.sortBy) {
      switch (args.sortBy) {
        case "name":
          results.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "pokemonId":
          results.sort((a, b) => a.pokemonId - b.pokemonId);
          break;
        case "height":
          results.sort((a, b) => b.height - a.height);
          break;
        case "weight":
          results.sort((a, b) => b.weight - a.weight);
          break;
        default:
          results.sort((a, b) => a.pokemonId - b.pokemonId);
      }
    } else {
      results.sort((a, b) => a.pokemonId - b.pokemonId);
    }

    return results;
  },
});

export const getPokemonById = query({
  args: { pokemonId: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pokemon")
      .withIndex("by_pokemon_id", (q) => q.eq("pokemonId", args.pokemonId))
      .first();
  },
});

export const getRandomPokemon = query({
  args: {},
  handler: async (ctx) => {
    const allPokemon = await ctx.db.query("pokemon").collect();
    if (allPokemon.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * allPokemon.length);
    return allPokemon[randomIndex];
  },
});



export const getTypeDistribution = query({
  args: {},
  handler: async (ctx) => {
    const allPokemon = await ctx.db.query("pokemon").collect();
    const typeCount: Record<string, number> = {};

    allPokemon.forEach(pokemon => {
      pokemon.type.forEach(type => {
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
    });

    return Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
    }));
  },
});
