import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import type { PentagonClient } from "../Client.js";
import { InteractionHandlerError } from "../Errors/InteractionHandlerError.js";
import { join } from "node:path";
import { Collection } from "discord.js";
import { Command } from "../structures/Command.js";

/*
TODO:
- Log results in console with logger via debug
*/

export class CommandHandler {
	/** All the available commands */
	public commands = new Collection<string, Command>();

	public constructor(public client: PentagonClient, public directory: string) {}

	/**
	 * Loads all the commands
	 * @returns The amount of commands that were loaded
	 * @throws InterActionHandlerError
	 */
	public async loadCommands(): Promise<number> {
		if (!existsSync(this.directory)) throw new InteractionHandlerError("InvalidDirectory", `"${this.directory}" does not exist`);

		const data = await readdir(this.directory);
		const categories = data.filter((str) => !str.endsWith(".ts") || !str.endsWith(".js"));

		for (const category of categories) {
			const files = await readdir(join(this.directory, category));
			const validFiles = files.filter((str) => str.startsWith(".ts") || str.startsWith(".js"));

			for (const file of validFiles) {
				const { default: command } = await import(join(this.directory, category, file));
				const cmd = new command(this.client);

				if (!(cmd instanceof Command))
					// TODO: change this to a error log
					throw new InteractionHandlerError("InvalidStructureClass", `"${file}" does not contain a Command extended default export`);

				cmd.load({ category, filename: file });
				this.commands.set(cmd.name, cmd);
			}
		}

		return this.commands.size;
	}

	/**
	 * Reloads all present commands
	 * @throws InterActionHandlerError
	 */
	public async reloadCommands(): Promise<void> {
		this.commands.forEach((cmd) => cmd.unload());
		this.commands = new Collection<string, Command>();
		await this.loadCommands();

		// TODO: Log results via debug
	}

	/**
	 * Unloads a command if present in the cache
	 * @param name The name of the command
	 * @returns Boolean depending on command presence in cache
	 */
	public unloadCommand(name: string): boolean {
		const command = this.commands.get(name);
		if (command) {
			command.unload();
			this.commands.delete(name);

			return true;
		}

		return false;

		// TODO: Log results via debug
	}

	/**
	 * Loads a command if not yet present in the cache
	 * @param category The category in which the file is located
	 * @param file The file name of the command
	 * @returns Boolean depending on command presence in cache (true = already present)
	 * @throws InterActionHandlerError
	 */
	public async loadCommand(category: string, file: string): Promise<boolean> {
		const { default: command } = await import(join(this.directory, category, file));
		const cmd = new command(this.client);

		if (!(cmd instanceof Command))
			throw new InteractionHandlerError("InvalidStructureClass", `"${file}" does not contain a Command extended default export`);
		if (this.commands.has(cmd.name)) return false;

		cmd.load({ category, filename: file });
		this.commands.set(cmd.name, cmd);

		return true;

		// TODO: Log results via debug
	}

	/**
	 * Reloads a command
	 * @param name The name of the command
	 * @returns Boolean depending on command presence in cache
	 *@throws InterActionHandlerError
	 */
	public async reloadCommand(name: string): Promise<boolean> {
		const command = this.commands.get(name);
		if (command) {
			command.unload();
			const bool = await this.loadCommand(command.category, command.filename);

			return bool;
		}

		return false;

		// TODO: Log results via debug
	}
}
