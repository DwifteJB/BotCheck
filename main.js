const { Menu } = require("electron");
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
        resizable: false,
        fullscreenable: false,
        titleBarStyle: "hidden", // add this line
        icon: "src/icon.png" // Currently just a normal discord logo.
    });
    win.loadFile("index.html");
    win.setAlwaysOnTop(true);
    win.setMenuBarVisibility(false)
}
app.whenReady().then(createWindow)
app.whenReady().then(() => {
    console.log("oo")

    const isMac = process.platform === 'darwin'
    const template = [
        // { role: 'appMenu' }
        ...(isMac ? [{
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
          ]
        }] : []),
        // { role: 'fileMenu' }
        {
          label: 'File',
          submenu: [
            {
                label: 'Save as JSON',
                click: async () => {
                  // ETA S0N
                }
            }
          ]
        },
        {
          label: 'Credits',
          submenu: [
            {
              label: 'DwifteJB - Creator',
              click: async () => {
                const { shell } = require('electron')
                await shell.openExternal('https://dwifte.me')
              }
            },
            {
                label: 'CrafterPika - Helper',
                click: async () => {
                  const { shell } = require('electron')
                  await shell.openExternal('https://crafterpika.tech')
                }
              },
              {
                label: 'Github',
                click: async () => {
                  const { shell } = require('electron')
                  await shell.openExternal('https://github.com/DwifteJB/BotCheck')
                }
              }
          ]
        }
      ]

      const menu = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menu)
})
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
