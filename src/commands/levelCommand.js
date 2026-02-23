import { goToPosition } from "../navigation/goToPosition.js";
import { levelArea, getRemainingBlocks } from "../leveling/levelArea.js";
import { startTask, endTask, isTaskRunning } from "../task/taskManager.js";

const MAX_LEVEL_PASSES = 100;

const FLAT_USAGE =
  "使い方: flat x1 x2 y1 y2 z1 z2 （直方体の範囲を整地）。例: flat 100 102 64 66 200 202";

export const command = {
  trigger: "flat",
  usage: "flat x1 x2 y1 y2 z1 z2  ─  直方体の範囲を整地。例: flat 100 102 64 66 200 202",
  handle: handleFlatCommand,
};

/**
 * チャットで "flat x1 x2 y1 y2 z1 z2" を受け取り、その空間を整地する。
 */
async function handleFlatCommand(bot, _username, msg) {
  if (isTaskRunning()) {
    bot.chat("現在タスク実行中です。stop と入力して中止してください。");
    return;
  }
  const parts = msg.trim().split(/\s+/);
  if (parts.length < 7) {
    bot.chat(FLAT_USAGE);
    return;
  }
  const x1 = Number(parts[1]);
  const x2 = Number(parts[2]);
  const y1 = Number(parts[3]);
  const y2 = Number(parts[4]);
  const z1 = Number(parts[5]);
  const z2 = Number(parts[6]);
  if (
    Number.isNaN(x1) ||
    Number.isNaN(x2) ||
    Number.isNaN(y1) ||
    Number.isNaN(y2) ||
    Number.isNaN(z1) ||
    Number.isNaN(z2)
  ) {
    bot.chat(FLAT_USAGE);
    return;
  }

  const box = { x1, x2, y1, y2, z1, z2 };
  const cx = Math.round((x1 + x2) / 2);
  const cy = Math.round((y1 + y2) / 2);
  const cz = Math.round((z1 + z2) / 2);

  const signal = startTask();

  try {
    bot.chat(`整地開始: 範囲 (${x1}〜${x2}, ${y1}〜${y2}, ${z1}〜${z2})。道具は持っているものを使うよ`);
    let passes = 0;
    while (passes < MAX_LEVEL_PASSES) {
      const remaining = getRemainingBlocks(bot, box);
      if (remaining.length === 0) {
        bot.chat("整地完了");
        return;
      }
      const target = remaining[0];
      const tx = target.x;
      const ty = target.y;
      const tz = target.z;
      await goToPosition(bot, tx, ty, tz, 2);
      if (signal.aborted) return;
      await levelArea(bot, box, signal);
      if (signal.aborted) return;
      passes++;
    }
    bot.chat("整地: 最大パス数に達しました。未完了のブロックがある可能性があります。");
  } catch (e) {
    if (signal.aborted) return;
    throw e;
  } finally {
    endTask();
  }
}
