import { Client, GatewayIntentBits } from "discord.js";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { CommandHandler } from "./handlers/CommandHandler.js";
import { Logger } from "./logger/Logger.js";
import { LogLevel } from "./logger/LoggerTypes.js";

const basePath = join(fileURLToPath(import.meta.url), "../../bot");

export class PentagonClient extends Client {
	public commandHandler = new CommandHandler(this, join(basePath, "commands"));
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
		const results = await this.commandHandler.loadCommands();
		this.logger.info(`(COMMANDHANDLER): Loaded a total of ${results} commands.`);
	}

	/**
	 * Gets the loglevel depending on the run state of the bot.
	 * @returns A logLevel depending on the run state
	 */
	private getLevel() {
		return process.env.NODE_ENV === "development" ? LogLevel.Debug : LogLevel.Info;
	}
}
