const { app, BrowserWindow } = require("electron");

function createWindow() {
    const win = new BrowserWindow({
        width: 500,
        height: 250,
        icon: "src/icon.png", // Currently just a normal discord logo.
        webPreferences: {
            nodeIntegreation: true
        },
        resizable: false
    });
    win.loadFile("index.html");
    win.setResizable(false);
    win.setFullScreenable(false);
    win.setAlwaysOnTop(true);
    win.setTitle("Bot Check - DwifteJB")
    win.setMenuBarVisibility(false)
}
app.whenReady().then(createWindow)

app.on("window-all-closed", () => {
    if (process.platform != "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
