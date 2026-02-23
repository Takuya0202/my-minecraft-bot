import { equipBestTool } from "../tools/equipBestTool.js";
import { Vec3 } from "vec3";
const AIR_NAMES = new Set(["air", "void_air", "cave_air"]);

/**
 * 指定した直方体範囲内で、まだ整地されていない（壊すべき）ブロックの位置一覧を返す。
 * @returns {import("vec3").Vec3[]}
 */
export function getRemainingBlocks(bot, box) {
  const xMin = Math.min(box.x1, box.x2);
  const xMax = Math.max(box.x1, box.x2);
  const yMin = Math.min(box.y1, box.y2);
  const yMax = Math.max(box.y1, box.y2);
  const zMin = Math.min(box.z1, box.z2);
  const zMax = Math.max(box.z1, box.z2);
  const remaining = [];
  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      for (let z = zMin; z <= zMax; z++) {
        const pos = new Vec3(x, y, z);
        const block = bot.blockAt(pos);
        if (!block) continue;
        if (AIR_NAMES.has(block.name)) continue;
        if (!block.diggable) continue;
        remaining.push(pos);
      }
    }
  }
  return remaining;
}

/**
 * 指定した直方体範囲内のブロックを上から順に壊して整地する。
 * 道具はボットのインベントリから自動で選択する。
 * @param {object} [signal] - AbortSignal を渡すと、中止要求でループを抜ける
 */
export async function levelArea(bot, box, signal) {
  const xMin = Math.min(box.x1, box.x2);
  const xMax = Math.max(box.x1, box.x2);
  const yMin = Math.min(box.y1, box.y2);
  const yMax = Math.max(box.y1, box.y2);
  const zMin = Math.min(box.z1, box.z2);
  const zMax = Math.max(box.z1, box.z2);

  const positions = [];
  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      for (let z = zMin; z <= zMax; z++) {
        positions.push(new Vec3(x, y, z));
      }
    }
  }
  // 上から壊す（y 降順）
  positions.sort((a, b) => b.y - a.y);

  for (const pos of positions) {
    if (signal?.aborted) break;
    const block = bot.blockAt(pos);
    if (!block) continue;
    if (AIR_NAMES.has(block.name)) continue;
    if (!bot.canDigBlock(block)) continue;
    try {
      await equipBestTool(bot, block);
      await bot.dig(block, true);
    } catch (e) {
      console.warn("dig skip", pos, e.message);
    }
  }
}
