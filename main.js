// main.js
const path = require("path");
const { app, BrowserWindow, screen } = require("electron");

let panelWindow = null;

// 好みで変更OK
const PANEL_RATIO = 0.25;          // 画面横幅の25%
const ALWAYS_ON_TOP = true;        // 常に手前（ウィジェット感）
const SKIP_TASKBAR = true;         // タスクバーに出さない
const BACKGROUND_COLOR = "#0b0f14";// 透明なし前提の背景色

function getTargetDisplay() {
  // マルチモニタでも「今カーソルがいる画面」を基準にする
  const cursor = screen.getCursorScreenPoint();
  return screen.getDisplayNearestPoint(cursor);
}

function calcBounds(display) {
  // workArea: タスクバー等を除いた領域
  const { x, y, width, height } = display.workArea;

  const w = Math.max(320, Math.floor(width * PANEL_RATIO)); // 最低幅つけると見た目が安定
  return {
    x: x + Math.max(0, width - w),
    y,
    width: w,
    height,
  };
}

function reposition() {
  if (!panelWindow) return;
  const d = getTargetDisplay();
  const bounds = calcBounds(d);
  panelWindow.setBounds(bounds, false);
}

function createPanelWindow() {
  const d = getTargetDisplay();
  const bounds = calcBounds(d);

  panelWindow = new BrowserWindow({
    ...bounds,

    // 見た目
    frame: false,
    transparent: false,            // ← 透明にしない（ユーザー希望）
    backgroundColor: BACKGROUND_COLOR,

    // 触れないパネルっぽく
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,

    // 常駐っぽく
    alwaysOnTop: ALWAYS_ON_TOP,
    skipTaskbar: SKIP_TASKBAR,
    show: false,

    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      // preload が必要ならここに追加
      // preload: path.join(__dirname, "preload.js"),
    },
  });

  panelWindow.setMenuBarVisibility(false);

  // macOSでSpaces/フルスクでも見えるように（不要なら消してOK）
  if (process.platform === "darwin") {
    try {
      panelWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    } catch (_) {}
  }

  // 右クリック等でドラッグ移動できちゃうのも防ぎたいなら：
  // panelWindow.setIgnoreMouseEvents(true); // ← 完全にクリック不可になるので通常はOFF推奨

  panelWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  panelWindow.once("ready-to-show", () => {
    // フォーカス奪わず表示（ウィジェットっぽい）
    panelWindow.showInactive();
  });

  // 画面設定が変わっても右端に追従
  screen.on("display-metrics-changed", reposition);
  screen.on("display-added", reposition);
  screen.on("display-removed", reposition);

  panelWindow.on("closed", () => {
    panelWindow = null;
  });
}

app.whenReady().then(() => {
  createPanelWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createPanelWindow();
  });
});

// Windows/Linuxはウィンドウ閉じたら終了
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});