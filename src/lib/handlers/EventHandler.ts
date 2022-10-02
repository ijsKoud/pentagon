import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import type { PentagonClient } from "../Client.js";
import { InteractionHandlerError } from "../Errors/InteractionHandlerError.js";
import { join } from "node:path";
import { Collection } from "discord.js";
import { EventListener } from "../structures/EventListener.js";

export class EventHandler {
	/** All the available events */
	public events = new Collection<string, EventListener>();

	public constructor(public client: PentagonClient, public directory: string) {}

	/**
	 * Loads all the events
	 * @returns The amount of events that were loaded
	 * @throws InterActionHandlerError
	 */
	public async loadEvents(): Promise<number> {
		if (!existsSync(this.directory)) throw new InteractionHandlerError("InvalidDirectory", `"${this.directory}" does not exist`);

		const data = await readdir(this.directory);
		const categories = data.filter((str) => !/\.[0-9a-z]+$/i.test(str));

		for (const category of categories) {
			const files = await readdir(join(this.directory, category));
			const validFiles = files.filter((str) => str.endsWith(".js"));

			for (const file of validFiles) {
				const { default: event } = await import(join(this.directory, category, file));
				const evnt = new event(this.client);

				if (!(evnt instanceof EventListener))
					this.client.logger.warn(`(EVENTHANDLER): "${file}" does not contain a EventListener extended default export.`);

				evnt.load({ category, filename: file });
				this.events.set(evnt.name, evnt);
			}
		}

		return this.events.size;
	}

	/**
	 * Reloads all present events
	 * @throws InterActionHandlerError
	 */
	public async reloadevents(): Promise<void> {
		this.client.logger.debug("(EVENTHANDLER): Reloading all events...");

		this.events.forEach((event) => event.unload());
		this.events = new Collection<string, EventListener>();
		await this.loadEvents();

		this.client.logger.debug("(EVENTHANDLER): Successfully reloaded all events.");
	}

	/**
	 * Unloads an EventListener if present in the cache
	 * @param name The name of the EventListener
	 * @returns Boolean depending on EventListeners presence in cache
	 */
	public unloadEvent(name: string): boolean {
		const event = this.events.get(name);
		if (event) {
			event.unload();
			this.events.delete(name);

			this.client.logger.debug(`(EVENTHANDLER): Successfully unloaded ${event.name}`);

			return true;
		}

		return false;
	}

	/**
	 * Loads an EventListener if not yet present in the cache
	 * @param file The filepath name of the EventListener (not absolute)
	 * @returns Boolean depending on EventListeners presence in cache (true = already present)
	 * @throws InterActionHandlerError
	 */
	public async loadEvent(file: string): Promise<boolean> {
		const { default: event } = await import(join(this.directory, file));
		const evnt = new event(this.client);

		if (!(evnt instanceof EventListener))
			throw new InteractionHandlerError("InvalidStructureClass", `"${file}" does not contain a EventListener extended default export`);
		if (this.events.has(evnt.name)) return false;

		evnt.load({ filepath: file });
		this.events.set(evnt.name, evnt);

		this.client.logger.debug(`(EVENTHANDLER): Successfully loaded ${evnt.name}`);

		return true;
	}

	/**
	 * Reloads an EventListener
	 * @param name The name of the EventListener
	 * @returns Boolean depending on EventListeners presence in cache
	 *@throws InterActionHandlerError
	 */
	public async reloadEvent(name: string): Promise<boolean> {
		const event = this.events.get(name);
		if (event) {
			event.unload();
			const bool = await this.loadEvent(event.filepath);

			this.client.logger.debug(`(EVENTHANDLER): Successfully reloaded ${event.name}`);

			return bool;
		}

		return false;
	}
}
