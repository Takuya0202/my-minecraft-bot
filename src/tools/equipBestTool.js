const SHOVEL_BLOCKS = new Set([
  "dirt", "grass_block", "podzol", "coarse_dirt", "rooted_dirt",
  "sand", "red_sand", "gravel", "soul_sand", "soul_soil", "clay", "mud", "muddy_mangrove_roots",
  "farmland", "dirt_path", "mycelium", "snow_block", "snow", "grass_path",
]);
const PICKAXE_BLOCKS = new Set([
  "stone", "cobblestone", "granite", "diorite", "andesite", "deepslate",
  "calcite", "tuff", "dripstone_block", "sandstone", "red_sandstone",
  "coal_ore", "iron_ore", "copper_ore", "gold_ore", "nether_gold_ore",
  "redstone_ore", "lapis_ore", "diamond_ore", "netherite_block",
  "obsidian", "crying_obsidian", "ancient_debris", "terracotta", "concrete", "concrete_powder",
  "bricks", "stone_bricks", "mossy_cobblestone", "mossy_stone_bricks",
  "ice", "packed_ice", "blue_ice", "glass", "stone_slab", "stone_stairs",
]);
const AXE_BLOCKS = new Set([
  "oak_log", "spruce_log", "birch_log", "jungle_log", "acacia_log", "dark_oak_log", "mangrove_log", "cherry_log",
  "oak_planks", "spruce_planks", "birch_planks", "jungle_planks", "acacia_planks", "dark_oak_planks", "mangrove_planks", "cherry_planks",
  "oak_leaves", "spruce_leaves", "birch_leaves", "jungle_leaves", "acacia_leaves", "dark_oak_leaves", "mangrove_leaves", "cherry_leaves",
  "crafting_table", "bookshelf", "chest", "trapped_chest", "note_block", "jukebox", "pumpkin", "melon",
  "ladder", "fence", "fence_gate", "door", "trapdoor", "sign", "beehive", "bee_nest",
]);

function toolForBlock(blockName) {
  if (SHOVEL_BLOCKS.has(blockName)) return "shovel";
  if (PICKAXE_BLOCKS.has(blockName)) return "pickaxe";
  if (AXE_BLOCKS.has(blockName)) return "axe";
  return null;
}

/** ブロックに最適な道具をインベントリから装備する（道具はボットが持っているものを使う） */
export async function equipBestTool(bot, block) {
  const kind = toolForBlock(block.name);
  if (!kind) return;
  const nameKeyword = kind === "shovel" ? "shovel" : kind === "pickaxe" ? "pickaxe" : "axe";
  const item = bot.inventory.items().find((i) => i.name.includes(nameKeyword));
  if (item) {
    await bot.equip(item, "hand");
  }
}
