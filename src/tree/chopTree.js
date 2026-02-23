import { equipBestTool } from "../tools/equipBestTool.js";
import { goToPosition } from "../navigation/goToPosition.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * ボットの近く（4ブロック以内）にある原木を繰り返し切り続ける。
 * 周辺の原木がなくなったら終了。
 * @param {object} bot
 * @param {object} signal - AbortSignal
 */
export async function chopNearbyLogs(bot, signal) {
  while (!signal.aborted) {
    const log = bot.findBlock({
      matching: (b) => b.name.endsWith("_log"),
      maxDistance: 6,
    });
    if (!log) break;

    const pos = log.position;
    try {
      await goToPosition(bot, pos.x, pos.y, pos.z, 3);
    } catch (e) {
      console.warn("[chop] 移動失敗:", e.message);
      await sleep(500);
      continue;
    }
    if (signal.aborted) break;

    const freshBlock = bot.blockAt(pos);
    if (!freshBlock || !freshBlock.name.endsWith("_log")) continue;

    try {
      await equipBestTool(bot, freshBlock);
      await bot.dig(freshBlock, true);
    } catch (e) {
      console.warn("[chop] dig skip", pos, e.message);
      await sleep(500);
    }
  }
}
