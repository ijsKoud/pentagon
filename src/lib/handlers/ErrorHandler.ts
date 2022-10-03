import { underline, bold } from "colorette";
import type { PentagonClient } from "../Client.js";
import { InteractionHandlerError } from "../Errors/InteractionHandlerError.js";

export class ErrorHandler {
	public constructor(public client: PentagonClient) {}

	public async handleError(error: Error): Promise<void> {
		await void 0; // placeholder

		if (error instanceof InteractionHandlerError) {
			let fatal = false;
			if (["InvalidDirectory", "noConstructorOptions"].includes(error.type)) fatal = true;

			const message = `${bold(underline(`InteractionHandlerError(${error.type})`))}: ${error.message}`;
			this.client.logger[fatal ? "fatal" : "error"](message);
		}
	}
}
