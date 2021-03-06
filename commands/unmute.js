const { Command } = require("../revolt-handler/main");
const { roleRequiredToMute, mutedRole } = require("../settings.json");

const unmute = new Command({
	name: "unmute",
	description: "Unutes a user",
	requiredRoles: [[roleRequiredToMute], false],
});

unmute.on("ran", (message, args) => {
	if (!args[0])
		return message.channel.sendMessage(
			"Invalid Arguments; expected: `!unmute <user> <reason>`"
		);

	let user = message.mentions ? message.mention_ids[0] : args[0];
	let reason = args[1] ?? "No reason provided.";

	message.channel.server
		.fetchMember(user)
		.then((x) => {
			if (!x.roles.find((x) => x == mutedRole))
				return message.channel.sendMessage("This user is not muted");
			x.edit({
				roles: x.roles.filter((x) => x != mutedRole),
			})
				.then((b) => {
					message.channel.sendMessage(
						`${message.author.username} unmuted ${user} for: ${reason}`
					);
				})
				.catch((e) => {
					message.channel.sendMessage(`Failed to unmute ${user}`);
				});
		})
		.catch((e) => {
			message.channel.sendMessage(`Could not find user ${user}`);
		});
});

unmute.on("invalidRoles", (message, args) => {
	message.channel.sendMessage("You can't use this command big man");
});
