/**
 * 指定した範囲内で最も近い原木ブロックを返す。
 * @param {object} bot
 * @param {number} maxDistance - 探索半径（デフォルト 16）
 * @returns {import('prismarine-block').Block | null}
 */
export function findNearbyLog(bot, maxDistance = 16) {
  return bot.findBlock({
    matching: (b) => b.name.endsWith("_log"),
    maxDistance,
  });
}
