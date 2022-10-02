import type { PentagonClient } from "../Client.js";

export class Command implements CommandOptions {
	public name: string;
	public description: string;

	/** The category of the command (automatically set by the commandHandler) */
	public category!: string;
	/** @internal The name of the file associated with the command */
	public filename!: string;

	public constructor(public client: PentagonClient, options: CommandOptions) {
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
