import { bold } from "colorette";
import { ApplyOptions } from "../../lib/decorators/StructureDecorators.js";
import { EventListener, EventListenerOptions } from "../../lib/structures/EventListener.js";

@ApplyOptions<EventListenerOptions>({
	name: "ready",
	once: true
})
export default class extends EventListener {
	public run() {
		this.client.logger.info(`(Bot): Connected to Discord as ${bold(this.client.user?.tag ?? "")}.`);
	}
}
