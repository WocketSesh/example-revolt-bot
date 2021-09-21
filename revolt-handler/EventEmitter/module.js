class Events {
	constructor() {}

	on(event, func) {
		if (typeof func != "function")
			throw new TypeError("Needs to be of type function.");
		this[event] = func;
	}

	emit(event) {
		if (this[event]) this[event](...[...arguments].splice(1));
	}
}

module.exports = { Events };
