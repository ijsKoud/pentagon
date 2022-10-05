import type { CommandInteraction } from "discord.js";
import { ApplyOptions } from "../../../lib/decorators/StructureDecorators.js";
import { Command, CommandOptions } from "../../../lib/structures/Command.js";

@ApplyOptions<CommandOptions>({
	name: "help",
	nameLocalizations: {
		"en-GB": "help"
	},
	descriptions: {
		"en-GB": "Shows some information about Pentagon and its commands.",
		nl: "Laat wat informatie over Pentagon & zijn commando's zien."
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
