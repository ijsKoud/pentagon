import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import type { PentagonClient } from "../Client.js";
import { InteractionHandlerError } from "../Errors/InteractionHandlerError.js";
import { join } from "node:path";
import { Collection } from "discord.js";
import { Command } from "../structures/Command.js";

export class CommandHandler {
	public commands = new Collection<string, Command>();

	public constructor(public client: PentagonClient, public directory: string) {}

	public async loadCommands(): Promise<number> {
		if (!existsSync(this.directory)) throw new InteractionHandlerError("InvalidDirectory", `"${this.directory}" does not exist`);

		const files = await readdir(this.directory);
		for (const file of files) {
			const { default: command } = await import(join(this.directory, file));
			const cmd = new command(this.client);

			if (!(cmd instanceof Command))
				throw new InteractionHandlerError("InvalidStructureClass", `"${file}" does not contain a Command extended default export`);

			this.commands.set(cmd.name, cmd);
		}

		return this.commands.size;
	}
}
