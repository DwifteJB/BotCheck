const fs = require("fs");
const Discord = require("discord.js");

const client = new Discord.Client({
    presence: {
        status: 'invisible'
    }
});

function onClick() {
    const token = document.body.getElementById("form-input")
}