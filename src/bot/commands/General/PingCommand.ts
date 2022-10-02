import type { PentagonClient } from "../../../lib/Client.js";
import { Command, CommandLoadOptions } from "../../../lib/structures/Command.js";

export default class extends Command {
	public constructor(client: PentagonClient) {
		super(client, {
			name: "ping",
			description: "Ping... Pong!"
		});
	}

	public load(options: CommandLoadOptions) {
		super.load(options);
	}
}
