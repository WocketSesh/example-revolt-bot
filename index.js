const { Client } = require("revolt.js");
const client = new Client();

const { checkForCommand } = require("./revolt-handler/main");
require("./commands/ban");
require("./commands/kick");
require("./commands/unban");
require("./commands/mute");
require("./commands/unmute");

client.loginBot("");

client.on("ready", () => {
	console.log(`Logged in as ${client.user.username}`);
});

client.on("message", (message) => {
	checkForCommand(message, "!");
});
