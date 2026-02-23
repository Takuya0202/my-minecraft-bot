import { command as flatCommand } from "./levelCommand.js";
import { command as moveCommand } from "./moveCommand.js";
import { command as treeCommand } from "./treeCommand.js";

const commands = [
  flatCommand,
  moveCommand,
  treeCommand,
];

export default commands;
