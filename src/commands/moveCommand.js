import { goToPosition } from "../navigation/goToPosition.js";
import { startTask, endTask, isTaskRunning } from "../task/taskManager.js";

export const command = {
  trigger: "move",
  usage: "move x y z  ─  指定した座標まで移動。例: move 100 64 200",
  handle: handleMoveCommand,
};

async function handleMoveCommand(bot, _username, msg) {
  if (isTaskRunning()) {
    bot.chat("現在タスク実行中です。stop と入力して中止してください。");
    return;
  }
  const parts = msg.trim().split(/\s+/);
  if (parts.length < 4) {
    bot.chat("使い方: move x y z  例: move 100 64 200");
    return;
  }
  const x = Number(parts[1]);
  const y = Number(parts[2]);
  const z = Number(parts[3]);
  if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
    bot.chat("座標は数値で指定してください。例: move 100 64 200");
    return;
  }

  const signal = startTask();
  try {
    bot.chat(`移動開始: (${x}, ${y}, ${z}) へ向かうよ`);
    await goToPosition(bot, x, y, z, 1);
    if (signal.aborted) return;
    bot.chat(`(${x}, ${y}, ${z}) に到着したよ`);
  } catch (e) {
    if (signal.aborted) return;
    throw e;
  } finally {
    endTask();
  }
}
