/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Command } from "../../../../src/lib/structures/Command";

export default class extends Command {
	constructor(client) {
		super(client, {
			name: "test",
			description: "test"
		});
	}

	run() {
		console.log("test(Command): test complete, command was called.");
	}
}
