import { Client } from "discord.js";
import { join } from "node:path";
import { CommandHandler } from "../../src/lib/handlers/CommandHandler";
import { EventHandler } from "../../src/lib/handlers/EventHandler";
import { Logger } from "../../src/lib/logger/Logger";
import { LogLevel } from "../../src/lib/logger/LoggerTypes";

export class PentagonClient extends Client {
	public commandHandler = new CommandHandler(this as any, join(__dirname, "commands"));
	public eventHandler = new EventHandler(this as any, join(__dirname, "events"));
	public logger = new Logger({ level: this.getLevel() });

	public constructor() {
		super({
			intents: []
		});
	}

	/**
	 * Starts the bot and all its sub programs
	 */
	public async run() {
		const commands = await this.commandHandler.loadCommands();
		const events = await this.eventHandler.loadEvents();

		return {
			commands,
			events
		};
	}

	/**
	 * Gets the loglevel depending on the run state of the bot.
	 * @returns A logLevel depending on the run state
	 */
	private getLevel() {
		return process.env.NODE_ENV === "development" ? LogLevel.Debug : LogLevel.Info;
	}
}
