import { bold } from "colorette";
import type { CommandInteraction, Interaction } from "discord.js";
import { ApplyOptions } from "../../../lib/decorators/StructureDecorators.js";
import { InteractionHandlerError } from "../../../lib/Errors/InteractionHandlerError.js";
import { EventListener, EventListenerOptions } from "../../../lib/structures/EventListener.js";

@ApplyOptions<EventListenerOptions>({
	name: "interactionCreate"
})
export default class extends EventListener {
	public run(interaction: Interaction) {
		if (interaction.isCommand()) return this.commandInteraction(interaction);
	}

	public commandInteraction(interaction: CommandInteraction): void {
		const command = this.client.commandHandler.commands.get(interaction.commandName);
		if (!command)
			return void this.client.errorHandler.handleError(
				new InteractionHandlerError("unknownCommand", `Interaction with name: ${bold(interaction.commandName)} is missing a command.`),
				interaction as Interaction
			);

		void command._run(interaction);
	}
}
