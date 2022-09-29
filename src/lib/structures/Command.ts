import type { PentagonClient } from "../Client.js";

export class Command implements CommandOptions {
	public name: string;
	public description: string;

	/** @internal The name of the file associated with the command */
	public filename: string;

	public constructor(public client: PentagonClient, options: CommandOptions) {
		this.name = options.name;
		this.description = options.description;
		this.filename = __filename;
	}

	/**
	 * Runs when the command is loaded
	 */
	public load() {
		// placeholder for possible load function for command
	}

	/**
	 * Runs when the command is unloaded
	 */
	public unload() {
		// placeholder for possible unload function for command
	}
}

interface CommandOptions {
	/** The name of the command */
	name: string;
	/** A small description about the command */
	description: string;
}
