const { Command } = require("../revolt-handler/main");
const { mutedRole, roleRequiredToMute } = require("../settings.json");

const mute = new Command({
	name: "mute",
	description: "Mutes a user",
	requiredRoles: [[roleRequiredToMute], false],
});

mute.on("ran", (message, args) => {
	if (!args[1])
		return message.channel.sendMessage(
			"Invalid Arguments; expected: `!mute <user> <time> <reason>`"
		);

	let user = message.mentions ? message.mention_ids[0] : args[0];
	let time = args[1];
	let reason = args[2] ?? "No reason provided.";

	if (!parseInt(time)) return;

	let t = time[time.length - 1];
	let pt = parseInt(time);

	time =
		t == "s"
			? pt * 1000
			: t == "m"
			? pt * 60000
			: t == "h"
			? pt * 3600000
			: "invalid";

	if (time == "invalid")
		return message.channel.sendMessage("Invalid time format, time<s|m|h>.");

	message.channel.server
		.fetchMember(user)
		.then((x) => {
			x.edit({
				roles: [...x.roles, mutedRole],
			})
				.then((b) => {
					message.channel.sendMessage(
						`${message.author.username} muted ${user} for ${args[1]}, for: ${reason}.`
					);

					setTimeout(() => {
						if (!x.roles.find((x) => x == mutedRole)) return;
						x.edit({
							roles: x.roles.filter((x) => x != mutedRole),
						})
							.then((x) => {
								message.channel.sendMessage(`${user} was unmuted.`);
							})
							.catch((e) => {});
					}, time);
				})
				.catch((e) => {
					message.channel.sendMessage(`Failed to mute ${user}.`);
				});
		})
		.catch((e) => {
			message.channel.sendMessage(`Could not find user ${user}`);
		});
});

mute.on("invalidRoles", (message, args) => {
	message.channel.sendMessage("You can't use this command big man");
});
