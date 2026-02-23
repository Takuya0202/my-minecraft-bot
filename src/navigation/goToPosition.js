import pathfinderModule from "mineflayer-pathfinder";

const { goals, Movements } = pathfinderModule;

export function goToPosition(bot, x, y, z, range = 2) {
  const pf = bot.pathfinder;
  if (!pf) throw new Error("pathfinder プラグインが読み込まれていません");
  pf.setGoal(null);
  pf.setMovements(new Movements(bot));
  const goal = new goals.GoalNear(x, y, z, range);
  pf.setGoal(goal);
  return pf.goto(goal);
}
