const fs = require("fs")
window.$ = window.jQuery = require('jquery');
const path = require('path');
const url = require('url');

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
    console.log(__dirname)
    if (!fs.existsSync(`${__dirname}/../../plugins`)) {
      fs.mkdirSync(`${__dirname}/../../plugins`);
    }
    const path = require("path")
    await switchToTable()
    const pluginFiles = fs.readdirSync(__dirname + '/../../plugins').filter(file => file.endsWith('.plugin.js'));
    for (const file of pluginFiles) {
      try {
        const plugin = require(__dirname + `/../../plugins/${file}`);
        // add confirm box so the user can choose to load the plugin? //
        console.log(`Loading ${plugin.name}\nDescription: ${plugin.description}\nAuthor: ${plugin.author}`);
        await plugin.execute();
      } catch(err) {
        console.log(err)
      }
    }
    
    
  })();
  
});

// TABS //

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
