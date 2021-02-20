const { Menu, app, BrowserWindow, shell, Notification, } = require("electron");
const fs = require("fs");
const fetch = require("node-fetch")
const path = require("path");
let dataPath;
if (process.platform === "win32") dataPath = process.env.APPDATA;
else if (process.platform === "darwin") dataPath = path.join(process.env.HOME, "Library", "Preferences");
else dataPath = process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : path.join(process.env.HOME, ".config");
dataPath = path.join(dataPath, "BotCheck") + "/";
let PluginPath = path.join(dataPath, "plugins")
let ThemePath = path.join(PluginPath, "themes")
// Install Themer //
if (!fs.existsSync(PluginPath + "/themeinjector.plugin.js")) {
(async () => {
  const res = await fetch("https://raw.githubusercontent.com/DwifteJB/BotCheck/plugins/plugins/themeinjector.plugin.js");
  const fileStream = fs.createWriteStream(PluginPath + "/themeinjector.plugin.js");
  await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", reject);
      fileStream.on("finish", resolve);
    });
})();
}
const template = [

  {
    label: 'Plugins',
    submenu: [
      
      {
          label: 'Open Plugins folder',
          
          click: async () => {
            let dataPath;
            if (process.platform === "win32") dataPath = process.env.APPDATA;
            else if (process.platform === "darwin") dataPath = path.join(process.env.HOME, "Library", "Preferences");
            else dataPath = process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : path.join(process.env.HOME, ".config");
            dataPath = path.join(dataPath, "BotCheck") + "/";
            shell.openItem(path.join(dataPath, "plugins"))
          }
      },
      {
        label: "Get Plugins Here",
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://github.com/DwifteJB/BotCheck/tree/plugins')
        }
      }
    ]
  },
  {
    label: 'Themes',
    submenu: [
      
      {
          label: 'Open Themes folder',
          
          click: async () => {
            let dataPath;
            if (process.platform === "win32") dataPath = process.env.APPDATA;
            else if (process.platform === "darwin") dataPath = path.join(process.env.HOME, "Library", "Preferences");
            else dataPath = process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : path.join(process.env.HOME, ".config");
            dataPath = path.join(dataPath, "BotCheck") + "/plugins";
            shell.openItem(path.join(dataPath, "themes"))
          }
      },
      {
        label: "Get Themes Here",
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://github.com/DwifteJB/BotCheck/tree/plugins')
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
            await shell.openExternal('https://crafterpika.ml')
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
    // win.setAlwaysOnTop(true);
    // win.webContents.openDevTools()
    win.setMenuBarVisibility(false)
}
app.whenReady().then(() => {
  createWindow();
  let contextMenu = Menu.buildFromTemplate(template);
  for (const file of fs.readdirSync(PluginPath).filter(file => file.endsWith('.plugin.js'))) { 
      const loaded = require(`${PluginPath}/${file}`);
      template[0].submenu.splice(1, 0, {label: loaded.name, click: async () => {
        const notification = {
          title: "BotCheck Plugin Inspect",
          body: `Plugin info for ${loaded.name} by ${loaded.author}\n${loaded.description}`
        }
        new Notification(notification).show()
    }});
    render();
  }
  for (const file of fs.readdirSync(ThemePath).filter(file => file.endsWith('.theme.css'))) { 

    template[1].submenu.splice(1, 0, {label: path.parse(path.parse(file).name).name});
    render();
  }
  function render() {
    contextMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(contextMenu)
  }
      
})
app.on("window-all-closed", () => {
    try {
      fs.unlinkSync("./commands.json")
    } catch {}
    if (process.platform != "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }

})
