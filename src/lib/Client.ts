import { Client, GatewayIntentBits } from "discord.js";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { CommandHandler } from "./handlers/CommandHandler.js";
import { ErrorHandler } from "./handlers/ErrorHandler.js";
import { EventHandler } from "./handlers/EventHandler.js";
import { InteractionHandler } from "./handlers/InteractionHandler.js";
import { Logger } from "./logger/Logger.js";
import { LogLevel } from "./logger/LoggerTypes.js";

const basePath = join(fileURLToPath(import.meta.url), "../../bot");

export class PentagonClient extends Client {
	public commandHandler = new CommandHandler(this, join(basePath, "commands"));
	public eventHandler = new EventHandler(this, join(basePath, "events"));
	public interactionHandler = new InteractionHandler(this, join(basePath, "interactions"));
	public errorHandler = new ErrorHandler(this);

	public logger = new Logger({ level: this.getLevel() });

	public constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.GuildMembers
			]
		});
	}

	/**
	 * Starts the bot and all its sub programs
	 */
	public async run(): Promise<void> {
		const commands = await this.commandHandler.loadCommands();
		const events = await this.eventHandler.loadEvents();
		const interactions = await this.interactionHandler.loadInteractions();

		this.logger.info(`(CommandHandler): Loaded a total of ${commands} Commands.`);
		this.logger.info(`(EventHandler): Loaded a total of ${events} EventListeners.`);
		this.logger.info(`(InteractionHandler): Loaded a total of ${interactions} InteractionListeners.`);

		await this.login(this.getToken());
	}

	/**
	 * Gets the loglevel depending on the run state of the bot.
	 * @returns A logLevel depending on the run state
	 */
	private getLevel() {
		return process.env.NODE_ENV === "development" ? LogLevel.Debug : LogLevel.Info;
	}

	/**
	 * Gets the token of the Discord bot
	 * @returns A Discord bot token
	 */
	private getToken(): string {
		return process.env.DISCORD_TOKEN ?? "";
	}
}
