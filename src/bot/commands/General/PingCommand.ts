import type { CommandInteraction } from "discord.js";
import { ApplyOptions } from "../../../lib/decorators/StructureDecorators.js";
import { Command, CommandOptions } from "../../../lib/structures/Command.js";

@ApplyOptions<CommandOptions>({
	name: "ping",
	nameLocalizations: {
		"en-GB": "ping",
		nl: "ping"
	},
	descriptions: {
		"en-GB": "Ping... Pong!"
	},
	permissions: {
		dm: true
	}
})
export default class extends Command {
	public async run(interaction: CommandInteraction) {
		const interactionDate = Date.now();
		await interaction.deferReply();

		await interaction.editReply(`>>> 🏓 Pong! Heartbeat: ${this.client.ws.ping}ms, roundtrip: ${Date.now() - interactionDate}ms`);
	}
}
