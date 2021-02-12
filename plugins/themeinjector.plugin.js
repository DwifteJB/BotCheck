const fs = require("fs")
const path = require("path")

module.exports = {
  name: "ThemeInjector",
  description: "loads a *.theme.css into BotCheck",
  author: "CrafterPika",
  async execute() {
    const themePath = path.join(__dirname + "/themes/")
    console.log(themePath)
    if (!fs.existsSync(themePath)) {
      fs.mkdirSync(themePath);
    }
    const themeFile = fs.readdirSync(themePath).filter(file => file.endsWith('.theme.css'));
    const css = `file:///${themePath}/${themeFile}`;
    console.log(css)
    try {
      $("head").append(`<link href='${css}' rel='stylesheet'>`);
    } catch (err) {
      console.log("Guess no theme installed.")
    }

  },
}
