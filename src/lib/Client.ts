import { PrismaClient } from "@prisma/client";
import { Client, GatewayIntentBits } from "discord.js";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { TicketSystem } from "./components/TicketSystem.js";
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

	public ticketSystem = new TicketSystem(this);

	public logger = new Logger({ level: this.getLevel() });
	public prisma = new PrismaClient({
		log: [
			{ emit: "event", level: "warn" },
			{ emit: "event", level: "error" }
		]
	});

	public constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.GuildMembers
			],
			allowedMentions: {
				roles: [],
				users: [],
				repliedUser: true
			}
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

		this.prisma.$on("warn", (ev) => this.logger.warn(`(${ev.target}): ${ev.message}`));
		this.prisma.$on("error", (ev) => this.logger.error(`(${ev.target}): ${ev.message}`));

		await this.prisma.$connect();
		await this.login(this.getToken());
	}

	/**
	 * Gets the loglevel depending on the run state of the bot.
	 * @returns A logLevel depending on the run state
	 */
	private getLevel() {
		return process.env.NODE_ENV === "development" ? LogLevel.Trace : LogLevel.Info;
	}

	/**
	 * Gets the token of the Discord bot
	 * @returns A Discord bot token
	 */
	private getToken(): string {
		return process.env.DISCORD_TOKEN ?? "";
	}
}
