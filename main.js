const { Menu, app, BrowserWindow } = require("electron");
const fs = require("fs")
function createWindow() {
    const win = new BrowserWindow({
        width: 750,
        height: 525,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false,
        title: "BotCheck",
        fullscreenable: false,
        titleBarStyle: "hidden", 
        icon: "src/icon.png" 
    });
    win.loadFile("index.html");
    win.setAlwaysOnTop(true);
    win.webContents.openDevTools()
    win.setMenuBarVisibility(false)
}
app.whenReady().then(createWindow)
app.whenReady().then(() => {
    const template = [

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
    try {
      fs.unlinkSync("./commands.json")
    } catch {
      //
    }
    if (process.platform != "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }

})
