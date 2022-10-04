import type { Awaitable, CommandInteraction, Interaction } from "discord.js";
import type { PentagonClient } from "../Client.js";
import { InteractionHandlerError } from "../Errors/InteractionHandlerError.js";
import { Base } from "./Base.js";

export class Command extends Base implements CommandOptions {
	public name: string;
	public description: string;

	/** The category of the command (automatically set by the commandHandler) */
	public category!: string;
	/** @internal The name of the file associated with the command */
	public filename!: string;

	public constructor(client: PentagonClient, options: CommandOptions) {
		super(client);
		if (!options) throw new InteractionHandlerError("noConstructorOptions");

		this.name = options.name;
		this.description = options.description;
	}

	/**
	 * Runs when the command is loaded
	 * @requires super callback on overwrite
	 */
	public load(options: CommandLoadOptions) {
		this.category = options.category;
		this.filename = options.filename;
	}

	/**
	 * Runs when the command is unloaded
	 */
	public unload() {
		// placeholder for possible unload function for command
	}

	public run(interaction: CommandInteraction): Awaitable<void> {
		void interaction.reply({ content: "The logic behind this command left before the party could start :(" });
	}

	public async _run(interaction: CommandInteraction): Promise<void> {
		try {
			await this.run(interaction);
		} catch (error) {
			void this.client.errorHandler.handleError(error, interaction as Interaction);
		}
	}
}

export interface CommandOptions {
	/** The name of the command */
	name: string;
	/** A small description about the command */
	description: string;
}

export interface CommandLoadOptions {
	filename: string;
	category: string;
}
