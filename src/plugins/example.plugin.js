
const fs = require("fs")
module.exports = {
  name: "PluginName",
  description: "Plugin Description",
  author: "Dwifte",
  async execute() {
    // adds new plugin text on screen
     $(".center").prepend("<span class=header>Plugins Support is enabled!</span>")
  },
}