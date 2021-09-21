const { Command } = require("../revolt-handler/main.js");
const { roleRequiredToBan } = require("../settings.json");

const ban = new Command({
	name: "ban",
	description: "Bans a user",
	requiredRoles: [[roleRequiredToBan], false],
});

ban.on("ran", (message, args) => {
	if (!args[0])
		return message.channel.sendMessage(
			"Invalid arguments, Expected: `!ban <user> <reason>`"
		);

	let user = message.mentions ? message.mention_ids[0] : args[0];
	let reason = args[1] ?? "No reason provided.";

	message.channel.server
		.banUser(user, { reason: reason })
		.then((x) => {
			message.channel.sendMessage(
				`${message.author.username} banned ${user} for: ${reason}`
			);
		})
		.catch((e) => {
			message.channel.sendMessage(`Failed to ban ${user}`);
		});
});

ban.on("invalidRoles", (message, args) => {
	message.channel.sendMessage("You can't use this command big man");
});
