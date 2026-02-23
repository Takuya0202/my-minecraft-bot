import { startTask, endTask, isTaskRunning } from "../task/taskManager.js";
import { findNearbyLog } from "../tree/findNearbyLog.js";
import { chopNearbyLogs } from "../tree/chopTree.js";
import { goToPosition } from "../navigation/goToPosition.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const command = {
  trigger: "tree",
  usage: "tree  ─  近くの原木を探して木を切り続ける",
  handle: handleTreeCommand,
};

/** ランダムな探索移動先を返す（現在地から水平に 20〜30 ブロック先） */
function randomWanderTarget(bot) {
  const angle = Math.random() * 2 * Math.PI;
  const dist = 20 + Math.random() * 10;
  return {
    x: Math.floor(bot.entity.position.x + Math.cos(angle) * dist),
    y: Math.floor(bot.entity.position.y),
    z: Math.floor(bot.entity.position.z + Math.sin(angle) * dist),
  };
}

async function handleTreeCommand(bot, _username, _msg) {
  if (isTaskRunning()) {
    bot.chat("現在タスク実行中です。stop と入力して中止してください。");
    return;
  }
  const signal = startTask();
  bot.chat("木を探すよ！（stop で中止）");

  try {
    let searchCount = 0;
    while (!signal.aborted) {
      const log = findNearbyLog(bot, 16);

      if (!log) {
        searchCount++;
        const target = randomWanderTarget(bot);
        try {
          await goToPosition(bot, target.x, target.y, target.z, 1);
        } catch (e) {
          console.warn("[tree] wander 失敗:", e.message);
          await sleep(1000);
        }
        continue;
      }

      searchCount = 0;
      const lp = log.position;
      try {
        await goToPosition(bot, lp.x, lp.y, lp.z, 4);
      } catch (e) {
        console.warn("[tree] 原木への移動失敗:", e.message);
        await sleep(1000);
        continue;
      }
      if (signal.aborted) break;
      await chopNearbyLogs(bot, signal);
    }
  } finally {
    endTask();
  }
}
