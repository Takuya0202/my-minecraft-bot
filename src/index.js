import mineflayer from "mineflayer";
import "dotenv/config";
import commands from "./commands/registry.js";
import { stopCurrentTask } from "./task/taskManager.js";
import pathfinderPlugin from "mineflayer-pathfinder";
import { loader as autoeatLoader } from "mineflayer-auto-eat";

const bot = mineflayer.createBot({
  host: process.env.SERVER_IP_ADDRESS,
  port: 25565,
  username: process.env.BOT_USERNAME,
  auth: "microsoft",
  checkTimeoutInterval: false,
  skipValidation: true,
});

bot.loadPlugin(pathfinderPlugin.pathfinder);
bot.loadPlugin(autoeatLoader);

bot.on("spawn", () => {
  console.log("接続成功");
  bot.autoEat.options = {
    priority: "foodPoints",
    minHunger: 18,
    bannedFood: [],
  };
  bot.autoEat.enableAuto();
  const usageLines = commands.map((c) => `  ${c.usage}`).join("\n");
  bot.chat(
    `${process.env.BOT_USERNAME} がログインしたよ（bot）\n` +
    `コマンド一覧:\n${usageLines}\n` +
    `  stop  ─  実行中のタスクを止める`
  );
});

bot.on("chat", (username, msg) => {
  if (username === bot.username) return;
  const trimmed = msg.trim();
  if (trimmed === "stop") {
    stopCurrentTask();
    bot.chat("タスクを中止しました");
    return;
  }
  const matched = commands.find((c) => trimmed.startsWith(c.trigger));
  if (matched) {
    matched.handle(bot, username, trimmed).catch((err) => {
      console.error(err);
      bot.chat(`エラー: ${err.message}`);
    });
  }
});

bot.on("end", (reason) => {
  console.log("接続終了:", reason);
});

bot.on("kicked", (reason) => {
  console.log("キックされた:", reason);
});

bot.on("error", (err) => {
  console.error("エラー:", err);
});
