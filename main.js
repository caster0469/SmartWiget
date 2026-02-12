const { app, BrowserWindow, screen } = require('electron');

let panelWindow = null;

function createPanelWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const panelWidth = Math.max(1, Math.floor(width * 0.25));
  const x = primaryDisplay.workArea.x + Math.max(0, width - panelWidth);
  const y = primaryDisplay.workArea.y;

  panelWindow = new BrowserWindow({
    x,
    y,
    width: panelWidth,
    height,
    frame: false,
    resizable: false,
    show: true,
    backgroundColor: '#000000',
    webPreferences: {
      sandbox: true
    }
  });

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SmartWiget Panel</title>
        <style>
          html, body {
            margin: 0;
            width: 100%;
            height: 100%;
            background: #000;
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          body {
            display: grid;
            place-items: center;
          }
        </style>
      </head>
      <body>SmartWiget Panel</body>
    </html>
  `;

  panelWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

  panelWindow.on('closed', () => {
    panelWindow = null;
  });
}

app.whenReady().then(() => {
  createPanelWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createPanelWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
