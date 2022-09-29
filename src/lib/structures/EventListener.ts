import type { PentagonClient } from "../Client.js";

export class EventListener {
	public name: string;

	public constructor(public client: PentagonClient) {
		this.name = "test"; // TODO: options
	}
}
