import { bold } from "colorette";
import type { CacheType, CommandInteraction, Interaction, MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
import { ApplyOptions } from "../../../lib/decorators/StructureDecorators.js";
import { InteractionHandlerError } from "../../../lib/Errors/InteractionHandlerError.js";
import { EventListener, EventListenerOptions } from "../../../lib/structures/EventListener.js";

@ApplyOptions<EventListenerOptions>({
	name: "interactionCreate"
})
export default class extends EventListener {
	public run(interaction: Interaction) {
		if (interaction.isCommand()) return this.commandInteraction(interaction);
		if (interaction.isMessageComponent() || interaction.isModalSubmit()) return this.customIdTypeInteraction(interaction);
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

	public customIdTypeInteraction(interaction: MessageComponentInteraction<CacheType> | ModalSubmitInteraction<CacheType>) {
		const CheckFunction = (str: string, strategy: "equal" | "include" | "endsWith" | "startsWith", check?: (str: string) => boolean) => {
			if (typeof check === "function") return check(interaction.customId);
			switch (strategy) {
				case "include":
					return str.includes(interaction.customId);
				case "startsWith":
					return str.startsWith(interaction.customId);
				case "endsWith":
					return str.endsWith(interaction.customId);
				case "equal":
				default:
					return str === interaction.customId;
			}
		};

		const interactionListener = this.client.interactionHandler.interactions.find((intListener) =>
			CheckFunction(intListener.name, intListener.strategy, intListener.check)
		);
		if (!interactionListener) return;
		if (
			(interaction.isMessageComponent() && interaction.componentType !== interactionListener.type) ||
			interaction.type !== interactionListener.type
		)
			return;

		void interactionListener._run(interaction);
	}
}
