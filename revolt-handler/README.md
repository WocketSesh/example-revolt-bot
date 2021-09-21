# Revolt Command Handler

npm i revolt-handler

```js
const revolt = require("revolt.js");
const client = new revolt.Client();
const { Command, checkForCommand } = require("revolt-handler");

client.loginBot("token");

client.on("ready", () => console.log("Logged in"));

const ping = new Command({
	name: "ping",
	aliases: ["p"], //Other "commands" that trigger this to run
	description: "Returns Pong!", //Description, has no actual user other than ping.description for now.
	requiredRoles: [
		["01FEXNSTM1VZESBXY43QPGAFE5", "01FEZNCCD2AD21T48E7X23CNX3"], //Role ID's
		true, //true means the user needs all of the roles provided, false means they only need one
	],
});

ping.on("ran", (message, args, exec) => {
	//This is what will run if someone uses the command
	message.channel.sendMessage("Pong!").then((x) => {
		x.edit({
			content: `Pong! \`Took ${new Date().getTime() - exec}ms to execute\``,
		});
	});
});

ping.on("invalidRoles", (message, args, exec) => {
	// This is what runs when the user does not have the required roles.
	message.channel.sendMessage("You do not have the required roles");
});

client.on("message", async (message) => {
	checkForCommand(message, "!");
});
```
