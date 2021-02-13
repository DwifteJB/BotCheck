const fs = require("fs")
window.$ = window.jQuery = require('jquery');
const path = require('path');
const url = require('url');

// RICH PRESENCE //
const presence = require('discord-rich-presence')('810181988060758046');
presence.updatePresence({
  state: 'Checking bots',
  details: 'Bot: N/A',
  startTimestamp: Date.now(),
  endTimestamp: Date.now() + 1337,
  largeImageKey: 'icon',
  instance: true,
});
//
let dataPath = "";
global.config = "";
if (process.platform === "win32") dataPath = process.env.APPDATA;
else if (process.platform === "darwin") dataPath = path.join(process.env.HOME, "Library", "Preferences");
else dataPath = process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : path.join(process.env.HOME, ".config");
dataPath = path.join(dataPath, "BotCheck") + "/";
let PluginPath = path.join(dataPath, "plugins")
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);
if (!fs.existsSync(PluginPath)) fs.mkdirSync(PluginPath);
if (!fs.existsSync(ThemePath)) fs.mkdirSync(ThemePath);

const customTitlebar = require('custom-electron-titlebar');
window.addEventListener('DOMContentLoaded', () => {
  let MyTitleBar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#343A40'),
    icon: url.format(path.join(__dirname, '/src', '/icon.png')),
    maximizable: false,
  });
  MyTitleBar.updateTitle(' ');
  // Load Plugins //
(async () => {
    await switchToTable()
    const pluginFiles = fs.readdirSync(PluginPath).filter(file => file.endsWith('.plugin.js'));
    for (const file of pluginFiles) {
      try {
        const plugin = require(`${PluginPath}/${file}`);
        // add confirm box so the user can choose to load the plugin? //
        console.log(`Loading plugin: ${plugin.name}\nDescription: ${plugin.description}\nAuthor: ${plugin.author}`);
        await plugin.execute();
      } catch(err) {
        console.log(err)
      }
    }

    
    
  })();

});

// TABS 

function switchToTable() {
    let content = "";
    if (!fs.existsSync("./commands.json")) {
      content = "";
    } else {
      let table = JSON.parse(fs.readFileSync("./commands.json"))
      for (index in table) {
        content = content + `\n${table[index]}`
      }
    }
    document.getElementById("tabs").innerHTML = `<span class="header">Servers: </span><br><br><table class="table table-dark table-striped">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Guild Name</th>
          <th scope="col">Member amount</th>
          <th scope="col">Image</th>
        </tr>
      </thead>
      <tbody id="table-guilds">
        ${content}
      </tbody>`
  }
  // function switchToPlugins() {
  //   let content = "";
  //   if (!fs.existsSync("./plugins.json")) {
  //     content = "";
  //   } else {
  //     let table = JSON.parse(fs.readFileSync("./plugins.json"))
  //     for (index in table) {
  //       content = content + `\n${table[index]}`
  //     }
  //   }
  //   document.getElementById("tabs").innerHTML = `<span class="header">Servers: </span><br><br><table class="table table-dark table-striped">
  //     <thead>
  //       <tr>
  //         <th scope="col">ID</th>
  //         <th scope="col">Guild Name</th>
  //         <th scope="col">Member amount</th>
  //         <th scope="col">Image</th>
  //       </tr>
  //     </thead>
  //     <tbody id="table-guilds">
  //       ${content}
  //     </tbody>`
  // }
async function getFromToken() {
  try {
    document.getElementById("table-guilds").innerHTML = ""; // if active
  } catch (err) {
    console.error("table not active.")
  }
  document.getElementById("error").innerHTML = "";
  var token = document.getElementById("tokenform").elements[0].value.trim();
  if (token.length == 0) {
    document.getElementById("error").innerHTML = `<div id=error-message class="alert alert-danger" role="alert">ERROR [IDIOT]: YOU DIDN'T PROVIDE A TOKEN.</div>`;

  }


  // login shit here ;)
  const Discord = require("discord.js");
  const client = new Discord.Client();
  try {
    await client.login(token).catch()
  } catch (error) {
    document.getElementById("error").innerHTML = `<div id=error-message class="alert alert-danger" role="alert">${error}</div>`;
    return console.error(error);
  }
  client.once('ready', async () => {
    let table = [];
    console.log("Logged into " + client.user.username);
    presence.updatePresence({
      state: 'Checking bots',
      details: 'Bot: ' + client.user.username,
      startTimestamp: Date.now(),
      endTimestamp: Date.now() + 1337,
      largeImageKey: 'icon',
      instance: true,
    });
    if (document.getElementById("table-guilds")) {
      // use old method too.
      for(const guild of client.guilds.cache) {
        await guild[1].fetch();
        $("#table-guilds").append(`<tr><th scope"row">${guild[0]}</th><td>${guild[1].name}</td><td>${guild[1].members.cache.size}</td><td><img src="${guild[1].iconURL()}" width=15px height=15px alt="serv"></td></tr>`);
      }
    }
    for(const guild of client.guilds.cache) {
      await guild[1].fetch();
      table.push(`<tr><th scope"row">${guild[0]}</th><td>${guild[1].name}</td><td>${guild[1].members.cache.size}</td><td><img src="${guild[1].iconURL()}" width=15px height=15px alt="serv"></td></tr>`);
    }
    fs.writeFileSync("./commands.json", JSON.stringify(table))
  })

  // for(const guild of client.guilds.cache) {
  //     $("#table-guilds").append(`<tr><th scope"row">${guild[0]}</th><td>${guild[1].name}</td><td>${guild[1].members.cache.size}</td><td><img src="${guild[1].iconURL()}" width=15px height=15px alt="serv"></td></tr>`);
  // }
  // for(const guild of client.guilds.cache) {
  //     const GUILD = client.guilds.cache.get(guild[0]);
  //     console.log(GUILD);
  //     $("#table-guilds").append(`<tr><th scope"row">${GUILD.id}</th><td>${GUILD.name}</td><td>${GUILD.memberCount}</td><td><img src="${GUILD.iconURL({format: "png"})}" width=15px height=15px alt="serv"></td></tr>`);
  // }
}
