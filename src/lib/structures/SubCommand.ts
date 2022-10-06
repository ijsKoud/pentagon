import { bold } from "colorette";
import type { Awaitable, ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import { InteractionHandlerError } from "../Errors/InteractionHandlerError.js";
import { Command } from "./Command.js";

export class SubCommand extends Command {
	public subcommands: SubCommandType[] = [];

	public async _run(interaction: CommandInteraction): Promise<void> {
		try {
			if (!interaction.isChatInputCommand())
				throw new InteractionHandlerError(
					"unknownCommand",
					`The subcommand ${bold(this.name)} received a ${bold(interaction.type)} interaction instead of ${bold(
						"chatInputCommand"
					)} interaction.`
				);

			const subcommand = interaction.options.getSubcommand(true);
			if (!subcommand)
				throw new InteractionHandlerError(
					"unknownCommand",
					`The subcommand ${bold(this.name)} received a ${bold("chatInputCommand")} interaction without a subcommand option.`
				);

			const fn = this.subcommands.find((cmd) => cmd.name === subcommand);
			if (!fn) {
				void interaction.followUp("The logic behind this command already left before the party could start :(");
				throw new InteractionHandlerError(
					"unknownCommand",
					`The subcommand ${bold(this.name)} received a ${bold(
						"chatInputCommand"
					)} interaction without a linked function to it (expecting a function for ${bold(subcommand)}).`
				);
			}

			try {
				await fn.fn(interaction);
			} catch (error) {
				void this.client.errorHandler.handleError(error, interaction);
			}
		} catch (error) {
			void this.client.errorHandler.handleError(error);
		}
	}
}

interface SubCommandType {
	name: string;
	fn: (interaction: ChatInputCommandInteraction) => Awaitable<void>;
}
