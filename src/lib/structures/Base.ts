import type { PentagonClient } from "../Client.js";

export class Base {
	/** The Discord client to interact with Discord */
	public client: PentagonClient;

	public constructor(client: PentagonClient, options: Record<string, unknown> = {}) {
		this.client = client;
		options;
	}
}
