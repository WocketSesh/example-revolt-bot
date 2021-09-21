const { Command } = require("../revolt-handler/main.js");
const { roleRequiredToKick } = require("../settings.json");

const kick = new Command({
	name: "kick",
	description: "Kicks a user",
	requiredRoles: [[roleRequiredToKick], false],
});

kick.on("ran", (message, args) => {
	if (!args[0])
		return message.channel.sendMessage(
			"Invalid arguments, Expected: `!kick <user> <reason>`"
		);

	let user = message.mentions ? message.mention_ids[0] : args[0];
	let reason = args[1] ?? "No reason provided.";

	message.channel.server
		.fetchMember(user)
		.then((x) =>
			x
				.kick()
				.then((x) => {
					message.channel.sendMessage(
						`${message.author.username} kicked ${user} for: ${reason}`
					);
				})
				.catch((e) => {
					message.channel.sendMessage(`Failed to kick ${user}`);
				})
		)
		.catch((e) => {
			message.channel.sendMessage(`Could not find user ${user}`);
		});
});

kick.on("invalidRoles", (message, args) => {
	message.channel.sendMessage("You can't use this command big man");
});
