const electron = require("electron");
const app = electron.app;
const path = require("path")
function createWindow() {
    const win = new electron.BrowserWindow({
        width: 500,
        height: 250,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        titleBarStyle: "hidden", // add this line
        icon: "src/icon.png" // Currently just a normal discord logo.
    });
    win.loadFile("index.html");
    win.setResizable(false);
    win.setFullScreenable(false);
    win.setAlwaysOnTop(true);
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
