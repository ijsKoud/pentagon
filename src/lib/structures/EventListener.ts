import type { PentagonClient } from "../Client.js";

export class EventListener implements CommandOptions {
	public name: string;

	/** @internal The name of the file associated with the command */
	public filepath!: string;

	public constructor(public client: PentagonClient, options: CommandOptions) {
		this.name = options.name;
	}

	/**
	 * Runs when the command is loaded
	 * @requires super callback on overwrite
	 */
	public load(options: CommandLoadOptions) {
		this.filepath = options.filepath;
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
}

export interface CommandLoadOptions {
	filepath: string;
}
