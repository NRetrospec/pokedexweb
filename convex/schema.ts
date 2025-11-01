import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pokemon: defineTable({
    pokemonId: v.number(),
    name: v.string(),
    image: v.string(),
    type: v.array(v.string()),
    height: v.number(),
    weight: v.number(),
    abilities: v.array(v.string()),
    weaknesses: v.array(v.string()),
    stats: v.object({
      hp: v.number(),
      attack: v.number(),
      defense: v.number(),
      specialAttack: v.number(),
      specialDefense: v.number(),
      speed: v.number(),
    }),
    description: v.string(),
  })
    .index("by_name", ["name"])
    .index("by_pokemon_id", ["pokemonId"])
    .searchIndex("search_name", {
      searchField: "name",
    }),
});
