import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import type { PentagonClient } from "../Client.js";
import { InteractionHandlerError } from "../Errors/InteractionHandlerError.js";
import { join } from "node:path";
import { Collection } from "discord.js";
import { EventListener } from "../structures/EventListener.js";

export class EventHandler {
	public events = new Collection<string, EventListener>();

	public constructor(public client: PentagonClient, public directory: string) {}

	public async loadEvents(): Promise<number> {
		if (!existsSync(this.directory)) throw new InteractionHandlerError("InvalidDirectory", `"${this.directory}" does not exist`);

		const files = await readdir(this.directory);
		for (const file of files) {
			const { default: event } = await import(join(this.directory, file));
			const ev = new event(this.client);

			if (!(event instanceof EventListener))
				throw new InteractionHandlerError("InvalidStructureClass", `"${file}" does not contain an EventListener extended default export`);

			this.events.set(ev.name, ev);
		}

		return this.events.size;
	}
}
