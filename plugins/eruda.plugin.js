const fs = require("fs")

module.exports = {
  name: "ErudaConsole",
  description: "loads Eruda's JS Console into the app.",
  author: "CrafterPika, liriliri",
  async execute() {
    var script = document.createElement('script'); script.src="https://raw.githubusercontent.com/DwifteJB/BotCheck/plugins/assets/eruda.js"; script.type="application/javascript";
    document.body.appendChild(script); script.onload = function () { eruda.init() };
  },
}
