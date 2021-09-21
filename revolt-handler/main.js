const { Events } = require("./EventEmitter/module");
const c = [];

/**
 * Create a new command object
 * @param {string} name - Name of command
 * @param {array} aliases - Array of command aliases
 * @param {string} description - Description of command
 * @param {string} requiredPermission - requiredPermission to run command
 * @example
 * const ping = new Command({
 *	name: "ping",
 *	aliases: ["p"],
 *	description: "Returns Pong!",
 * });
 */
class Command extends Events {
	constructor({ name, aliases, description, requiredRoles }) {
		super();
		this.name = name;
		this.aliases = aliases ?? [];
		this.description = description;
		this.requiredRoles = requiredRoles
			? requiredRoles[0]
				? requiredRoles[0]
				: []
			: [];
		this.allRoles = requiredRoles
			? requiredRoles[1]
				? requiredRoles[1]
				: false
			: false;

		c.push(this);
	}
}

/**
 * Checks sent message for a command
 * @param {message} message - Revolt message object
 * @param {string} prefix - Your bots prefix
 * @returns {void}
 * @example
 * client.on("message", async (message) => {
 *	checkForCommand(message, "!");
 * });
 */
const checkForCommand = (message, prefix) => {
	let recieved = new Date().getTime();

	if (
		!message ||
		!message.content ||
		!prefix ||
		typeof message.content != "string" || //temp fix to system messages giving an error?
		!message.content.startsWith(prefix)
	)
		return;

	let command = message.content.split(" ")[0].slice(prefix.length),
		args = message.content.split(" ").splice(1);

	let r = c.filter((x) => x.name == command || x.aliases.includes(command));

	if (!r[0]) return;

	r = r[0];

	let userRoles = message.member.roles;

	if (
		r.requiredRoles.length && r.allRoles
			? !r.requiredRoles.every((v) => userRoles.includes(v))
			: !r.requiredRoles.some((v) => userRoles.includes(v))
	)
		return r.emit("invalidRoles", message, args, recieved);

	r.emit("ran", message, args, recieved);
};

module.exports = { checkForCommand, Command };
