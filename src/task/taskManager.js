/**
 * 現在実行中のタスクを管理する。
 * 任意のコマンドがタスクを開始するときに startTask() でシグナルを取得し、
 * finally ブロックで endTask() を呼ぶ。
 * "stop" コマンドは stopCurrentTask() を呼ぶだけでどのタスクも止められる。
 */

let currentController = null;

/**
 * 新しいタスクを開始する。
 * @returns {AbortSignal} タスクに渡す AbortSignal
 * @throws {Error} すでに別のタスクが実行中の場合
 */
export function startTask() {
  if (currentController !== null) {
    throw new Error("別のタスクがすでに実行中です");
  }
  currentController = new AbortController();
  return currentController.signal;
}

/**
 * タスクの終了を登録する（finally で必ず呼ぶ）。
 */
export function endTask() {
  currentController = null;
}

/**
 * 現在実行中のタスクを中止する。
 * タスクがなければ何もしない。
 */
export function stopCurrentTask() {
  currentController?.abort();
}

/**
 * タスクが実行中かどうかを返す。
 * @returns {boolean}
 */
export function isTaskRunning() {
  return currentController !== null;
}
